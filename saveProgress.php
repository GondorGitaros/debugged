<?php
header('Content-Type: application/json');
require_once __DIR__ . '/vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';
$level = $data['level'] ?? 0;
$time = $data['time'] ?? 0;

if (!$username) {
    echo json_encode(['success' => false, 'error' => 'User not logged in']);
    exit;
}

$host = $_ENV['DB_HOST'];
$user = $_ENV['DB_USER'];
$pass = $_ENV['DB_PASS'];
$db   = $_ENV['DB_NAME'];
$mysqli = new mysqli($host, $user, $pass, $db);

if ($mysqli->connect_errno) {
    echo json_encode(['success' => false, 'error' => 'DB error']);
    exit;
}

$stmt = $mysqli->prepare('
    INSERT INTO user_progress (username, level, completed_at) 
    VALUES (?, ?, NOW()) 
    ON DUPLICATE KEY UPDATE 
        level = GREATEST(level, VALUES(level)), 
        completed_at = IF(VALUES(level) > level, NOW(), completed_at)
');
$stmt->bind_param('si', $username, $level);

// Update users table with current progress (no best_time logic here)
$stmt2 = $mysqli->prepare('
    UPDATE users 
    SET current_level = ?, 
        total_time = ?
    WHERE username = ?
');
$stmt2->bind_param('iis', $level, $time, $username);

if ($stmt->execute() && $stmt2->execute()) {
    // If user completed the game (level 10), fix all best times
    if ($level >= 10) {
        require_once __DIR__ . '/fix_best_time.php';
        
        try {
            $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
            $affected = fixAllBestTimes($pdo);
        } catch (Exception $e) {
            // Don't fail the save if the fix fails
            error_log("Best time fix failed: " . $e->getMessage());
        }
    }
    
    // Get the updated values to confirm what was actually saved
    $verify = $mysqli->prepare('SELECT current_level, total_time, best_time FROM users WHERE username = ?');
    $verify->bind_param('s', $username);
    $verify->execute();
    $result = $verify->get_result()->fetch_assoc();
    $verify->close();
    
    echo json_encode([
        'success' => true, 
        'debug' => [
            'input' => ['level' => $level, 'time' => $time, 'username' => $username],
            'saved' => $result,
            'best_times_fixed' => $level >= 10 ? ($affected ?? 0) : 0
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to save progress', 'mysqli_error' => $mysqli->error]);
}
$stmt->close();
$stmt2->close();
$mysqli->close();
?>