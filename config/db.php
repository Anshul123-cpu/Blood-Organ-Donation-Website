<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'blood_organ_donation');
define('DB_USER', 'root'); // Change to your database username
define('DB_PASS', ''); // Change to your database password

try {
    // Create PDO connection
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    // Set PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Set default fetch mode to associative array
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    // Handle connection error
    die("Database connection failed: " . $e->getMessage());
}
?>