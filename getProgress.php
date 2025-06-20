<?php
header('Content-Type: application/json');
require_once __DIR__ . '/vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$username = $_GET['username'] ?? '';

if (!$username) {
    echo json_encode(['success' => false, 'error' => 'User not specified']);
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

$stmt = $mysqli->prepare('SELECT current_level, total_time FROM users WHERE username = ?');
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->bind_result($level, $time);

if ($stmt->fetch()) {
    echo json_encode(['success' => true, 'level' => $level, 'time' => $time]);
} else {
    echo json_encode(['success' => false, 'error' => 'User not found']);
}
$stmt->close();
$mysqli->close();
?>