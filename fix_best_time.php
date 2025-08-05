<?php
require_once __DIR__ . '/vendor/autoload.php';
use Dotenv\Dotenv;

// Fix best_time for all users who completed the game (level >= 10)
function fixAllBestTimes($pdo) {
    // Update best_time for all users who completed the game
    // Set best_time = total_time if total_time is better (less) than current best_time
    $stmt = $pdo->prepare('
        UPDATE users 
        SET best_time = total_time 
        WHERE current_level >= 10 
        AND (best_time IS NULL OR total_time < best_time)
    ');
    $stmt->execute();
    
    // Return count of affected rows
    return $stmt->rowCount();
}

// Only run if called directly (not when included)
if (basename(__FILE__) == basename($_SERVER["SCRIPT_NAME"])) {
    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->load();

    $host = $_ENV['DB_HOST'];
    $user = $_ENV['DB_USER'];
    $pass = $_ENV['DB_PASS'];
    $db   = $_ENV['DB_NAME'];

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
        
        echo "Fixing best_time for all completed users...\n";
        
        $affected = fixAllBestTimes($pdo);
        
        echo "✅ Fixed best_time for $affected users\n";
        
        // Show results
        $stmt = $pdo->prepare('SELECT username, current_level, total_time, best_time FROM users WHERE current_level >= 10 ORDER BY best_time ASC');
        $stmt->execute();
        $results = $stmt->fetchAll();
        
        echo "\nCompleted users after fix:\n";
        foreach ($results as $user) {
            echo "   {$user['username']}: Level {$user['current_level']}, Total: {$user['total_time']}s, Best: {$user['best_time']}s\n";
        }
        
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage() . "\n";
    }
}
?>
