<?php
header('Content-Type: application/json');
require_once __DIR__ . '/vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';

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

$stmt = $mysqli->prepare('UPDATE users SET current_level = 0, total_time = 0 WHERE username = ?');
$stmt->bind_param('s', $username);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to reset progress']);
}
$stmt->close();
$mysqli->close();
?>