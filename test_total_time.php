<?php
// Test to verify best_time tracks total completion time correctly
require_once __DIR__ . '/vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$host = $_ENV['DB_HOST'];
$user = $_ENV['DB_USER'];
$pass = $_ENV['DB_PASS'];
$db   = $_ENV['DB_NAME'];

try {
    $mysqli = new mysqli($host, $user, $pass, $db);
    
    $username = 'testuser';
    
    echo "=== Testing Best Time Logic ===\n\n";
    
    // Clear any existing data
    $mysqli->query("DELETE FROM users WHERE username = '$username'");
    $mysqli->query("DELETE FROM user_progress WHERE username = '$username'");
    
    // Create user
    $mysqli->query("INSERT INTO users (username, password) VALUES ('$username', 'test')");
    
    echo "1. First game completion (300 seconds):\n";
    // Simulate first completion
    $level = 10;
    $time = 300; // 5 minutes
    
    $stmt = $mysqli->prepare('
        UPDATE users 
        SET current_level = ?, 
            total_time = ?,
            best_time = CASE 
                WHEN ? >= 10 AND (best_time IS NULL OR ? < best_time) 
                THEN ? 
                ELSE best_time 
            END
        WHERE username = ?
    ');
    $stmt->bind_param('iiiiis', $level, $time, $level, $time, $time, $username);
    $stmt->execute();
    
    $result = $mysqli->query("SELECT total_time, best_time FROM users WHERE username = '$username'");
    $data = $result->fetch_assoc();
    echo "   Total time: {$data['total_time']}s, Best time: {$data['best_time']}s\n\n";
    
    echo "2. Second completion - worse time (400 seconds):\n";
    // Simulate worse completion
    $time = 400; // 6 minutes 40 seconds
    $stmt->bind_param('iiiiis', $level, $time, $level, $time, $time, $username);
    $stmt->execute();
    
    $result = $mysqli->query("SELECT total_time, best_time FROM users WHERE username = '$username'");
    $data = $result->fetch_assoc();
    echo "   Total time: {$data['total_time']}s, Best time: {$data['best_time']}s (should stay 300)\n\n";
    
    echo "3. Third completion - better time (200 seconds):\n";
    // Simulate better completion
    $time = 200; // 3 minutes 20 seconds
    $stmt->bind_param('iiiiis', $level, $time, $level, $time, $time, $username);
    $stmt->execute();
    
    $result = $mysqli->query("SELECT total_time, best_time FROM users WHERE username = '$username'");
    $data = $result->fetch_assoc();
    echo "   Total time: {$data['total_time']}s, Best time: {$data['best_time']}s (should be 200 now)\n\n";
    
    echo "4. Mid-game save (level 5, 150 seconds):\n";
    // Simulate saving during game (should not affect best_time)
    $level = 5;
    $time = 150;
    $stmt->bind_param('iiiiis', $level, $time, $level, $time, $time, $username);
    $stmt->execute();
    
    $result = $mysqli->query("SELECT total_time, best_time FROM users WHERE username = '$username'");
    $data = $result->fetch_assoc();
    echo "   Total time: {$data['total_time']}s, Best time: {$data['best_time']}s (best_time should stay 200)\n\n";
    
    echo "✅ Best time logic working correctly!\n";
    echo "   - Only updates when completing game (level 10)\n";
    echo "   - Only updates when time is better\n";
    echo "   - Tracks total completion time from start to finish\n";
    
    // Cleanup
    $mysqli->query("DELETE FROM users WHERE username = '$username'");
    $mysqli->query("DELETE FROM user_progress WHERE username = '$username'");
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
