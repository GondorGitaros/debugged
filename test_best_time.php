<?php
// Test best time update logic
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
    
    echo "Before update - Alice's times:\n";
    $stmt = $pdo->prepare('SELECT total_time, best_time FROM users WHERE username = "alice"');
    $stmt->execute();
    $result = $stmt->fetch();
    echo "Total time: {$result['total_time']}s, Best time: {$result['best_time']}s\n\n";
    
    // Simulate Alice completing the game with a better time
    $username = 'alice';
    $level = 10;
    $newTime = 60; // Better than her previous 120s
    
    $stmt = $pdo->prepare('
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
    $stmt->execute([$level, $newTime, $level, $newTime, $newTime, $username]);
    
    echo "After update - Alice's times:\n";
    $stmt = $pdo->prepare('SELECT total_time, best_time FROM users WHERE username = "alice"');
    $stmt->execute();
    $result = $stmt->fetch();
    echo "Total time: {$result['total_time']}s, Best time: {$result['best_time']}s\n\n";
    
    // Simulate Alice completing again with a worse time
    $worseTime = 180;
    $stmt = $pdo->prepare('
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
    $stmt->execute([$level, $worseTime, $level, $worseTime, $worseTime, $username]);
    
    echo "After worse time - Alice's times:\n";
    $stmt = $pdo->prepare('SELECT total_time, best_time FROM users WHERE username = "alice"');
    $stmt->execute();
    $result = $stmt->fetch();
    echo "Total time: {$result['total_time']}s, Best time: {$result['best_time']}s (should stay 60)\n";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
