<?php
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
require_once __DIR__ . '/vendor/autoload.php';
use Dotenv\Dotenv;


$username = $data['username'] ?? '';
$password = $data['password'] ?? '';


// Load .env file
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Retrieve env variables
$host = $_ENV['DB_HOST'];
$user = $_ENV['DB_USER'];
$pass = $_ENV['DB_PASS'];
$db   = $_ENV['DB_NAME'];

// Try connecting
$mysqli = new mysqli($host, $user, $pass, $db);
if ($mysqli->connect_errno) {
    echo json_encode(['success' => false, 'error' => 'DB error']);
    exit;
}

$stmt = $mysqli->prepare('SELECT password FROM users WHERE username = ?');
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->bind_result($hash);
if ($stmt->fetch() && password_verify($password, $hash)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
}
?>