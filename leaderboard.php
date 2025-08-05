<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$host = $_ENV['DB_HOST'];
$user = $_ENV['DB_USER'];
$pass = $_ENV['DB_PASS'];
$db   = $_ENV['DB_NAME'];

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get top 50 players who completed the entire game
    // Ranked by fastest best completion time
    $stmt = $pdo->prepare("
        SELECT u.username, u.best_time, up.level, up.completed_at
        FROM users u
        JOIN user_progress up ON u.username = up.username
        WHERE up.level >= 10 AND u.best_time IS NOT NULL
        ORDER BY u.best_time ASC, up.completed_at ASC
        LIMIT 50
    ");
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Add rank to each player
    $leaderboard = [];
    $rank = 1;
    foreach ($results as $player) {
        $leaderboard[] = [
            'rank' => $rank,
            'username' => $player['username'],
            'level' => $player['level'],
            'time' => $player['best_time'],
            'completed_at' => $player['completed_at']
        ];
        $rank++;
    }
    
    echo json_encode([
        'success' => true,
        'leaderboard' => $leaderboard
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
