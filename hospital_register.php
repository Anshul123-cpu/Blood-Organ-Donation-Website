<?php
// Include database connection
require_once 'config/db.php';

// Check if form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $name = trim($_POST['name'] ?? '');
    $address = trim($_POST['address'] ?? '');
    $city = trim($_POST['city'] ?? '');
    $state = trim($_POST['state'] ?? '');
    $pincode = trim($_POST['pincode'] ?? '');
    $contact = trim($_POST['contact'] ?? '');
    $email = trim($_POST['email'] ?? '');
$services = isset($_POST['services']) ? implode(',', $_POST['services']) : '';

    // Validate inputs
    $errors = [];

    if (empty($name)) {
        $errors[] = "Hospital name is required";
    }

    if (empty($address)) {
        $errors[] = "Address is required";
    }

    if (empty($city)) {
        $errors[] = "City is required";
    }

    if (empty($state)) {
        $errors[] = "State is required";
    }

    if (empty($pincode) || !preg_match('/^[0-9]{6}$/', $pincode)) {
        $errors[] = "Valid 6-digit pincode is required";
    }

    if (empty($contact) || !preg_match('/^[0-9+\-\s()]+$/', $contact)) {
        $errors[] = "Valid contact number is required";
    }

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Valid email is required";
    }

    // If no errors, insert into database
    if (empty($errors)) {
        try {
            // Prepare SQL statement
            $stmt = $pdo->prepare("INSERT INTO hospitals (name, address, city, state, pincode, contact, email, services) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

            // Execute the statement
            $stmt->execute([$name, $address, $city, $state, $pincode, $contact, $email, $services]);

            // Success message
            echo json_encode(['success' => true, 'message' => 'Hospital registered successfully']);
        } catch(PDOException $e) {
            // Handle database error
            echo json_encode(['success' => false, 'message' => 'Registration failed: ' . $e->getMessage()]);
        }
    } else {
        // Return validation errors
        echo json_encode(['success' => false, 'message' => 'Validation errors', 'errors' => $errors]);
    }
} else {
    // Method not allowed
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>