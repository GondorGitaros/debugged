<?php
// Force fix csasz's best_time to match total_time since total_time should be the current best
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
    
    echo "Current csasz data:\n";
    $stmt = $pdo->prepare('SELECT total_time, best_time FROM users WHERE username = "csasz"');
    $stmt->execute();
    $result = $stmt->fetch();
    echo "Total: {$result['total_time']}s, Best: {$result['best_time']}s\n\n";
    
    // Since total_time should be your latest completion, and best_time should only be better if you actually achieved it
    // Let's set best_time = total_time to reset it to your current completion time
    echo "Setting best_time = total_time for csasz...\n";
    $stmt = $pdo->prepare('UPDATE users SET best_time = total_time WHERE username = "csasz"');
    $stmt->execute();
    
    echo "After fix:\n";
    $stmt = $pdo->prepare('SELECT total_time, best_time FROM users WHERE username = "csasz"');
    $stmt->execute();
    $result = $stmt->fetch();
    echo "Total: {$result['total_time']}s, Best: {$result['best_time']}s\n";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
