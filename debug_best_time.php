<?php
// Debug script to investigate the mysterious 29s best time
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
    
    echo "=== DEBUGGING BEST TIME ISSUE ===\n\n";
    
    // Check all users and their times
    echo "1. All users in database:\n";
    $stmt = $pdo->prepare('SELECT username, current_level, total_time, best_time FROM users ORDER BY username');
    $stmt->execute();
    $users = $stmt->fetchAll();
    
    foreach ($users as $user) {
        echo "   {$user['username']}: Level {$user['current_level']}, Total: {$user['total_time']}s, Best: {$user['best_time']}s\n";
    }
    
    echo "\n2. User progress records:\n";
    $stmt = $pdo->prepare('SELECT username, level, completed_at FROM user_progress ORDER BY username, completed_at');
    $stmt->execute();
    $progress = $stmt->fetchAll();
    
    foreach ($progress as $p) {
        echo "   {$p['username']}: Level {$p['level']} at {$p['completed_at']}\n";
    }
    
    // Look for your specific user (replace 'your_username' with your actual username)
    echo "\n3. Enter your username to check specific data:\n";
    echo "   (or check the output above to see if anything looks suspicious)\n";
    
    // Check for any unusual patterns
    echo "\n4. Looking for suspicious data:\n";
    
    $stmt = $pdo->prepare('SELECT username, best_time FROM users WHERE best_time < 50 AND best_time IS NOT NULL');
    $stmt->execute();
    $suspicious = $stmt->fetchAll();
    
    if (count($suspicious) > 0) {
        echo "   ⚠️  Found users with suspiciously fast best times:\n";
        foreach ($suspicious as $s) {
            echo "      {$s['username']}: {$s['best_time']}s\n";
        }
    } else {
        echo "   ✅ No suspiciously fast times found\n";
    }
    
    // Check for data integrity issues
    echo "\n5. Data integrity check:\n";
    $stmt = $pdo->prepare('SELECT username FROM users WHERE best_time < total_time AND best_time IS NOT NULL');
    $stmt->execute();
    $integrity_issues = $stmt->fetchAll();
    
    if (count($integrity_issues) > 0) {
        echo "   ⚠️  Found users where best_time < total_time (this could be normal):\n";
        foreach ($integrity_issues as $issue) {
            $stmt2 = $pdo->prepare('SELECT username, total_time, best_time FROM users WHERE username = ?');
            $stmt2->execute([$issue['username']]);
            $data = $stmt2->fetch();
            echo "      {$data['username']}: Total: {$data['total_time']}s, Best: {$data['best_time']}s\n";
        }
    } else {
        echo "   ✅ No obvious data integrity issues\n";
    }
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
