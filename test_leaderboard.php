<?php
// Test script to simulate game completions
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
    
    // Simulate different users completing the game
    $testData = [
        ['username' => 'alice', 'time' => 120],
        ['username' => 'bob', 'time' => 95],
        ['username' => 'charlie', 'time' => 150],
        ['username' => 'diana', 'time' => 75],
        ['username' => 'eve', 'time' => 200],
    ];
    
    foreach ($testData as $data) {
        $username = $data['username'];
        $time = $data['time'];
        $level = 10; // Game completion
        
        // Insert/update user
        $stmt = $pdo->prepare('
            INSERT INTO users (username, password, current_level, total_time, best_time) 
            VALUES (?, "test123", ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                current_level = ?, 
                total_time = ?,
                best_time = CASE 
                    WHEN ? >= 10 AND (best_time IS NULL OR ? < best_time) 
                    THEN ? 
                    ELSE best_time 
                END
        ');
        $stmt->execute([$username, $level, $time, $time, $level, $time, $level, $time, $time]);
        
        // Insert progress record
        $stmt2 = $pdo->prepare('
            INSERT INTO user_progress (username, level, completed_at) 
            VALUES (?, ?, NOW()) 
            ON DUPLICATE KEY UPDATE 
                level = GREATEST(level, VALUES(level)), 
                completed_at = IF(VALUES(level) > level, NOW(), completed_at)
        ');
        $stmt2->execute([$username, $level]);
        
        echo "Added test data for $username with time {$time}s\n";
    }
    
    echo "\nTest data created successfully! Check your leaderboard.\n";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
