<?php
session_start();

// Include database connection
require_once 'config/db.php';

// Include email functionality
require_once 'send_email.php';

// Check if form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $blood_group = $_POST['blood_group'] ?? '';
    $donation_type = $_POST['donation_type'] ?? '';
    $preferred_date = $_POST['preferred_date'] ?? '';
    $hospital_id = $_POST['hospital_id'] ?? null;

    // Validate inputs
    $errors = [];

    if (empty($name)) {
        $errors[] = "Name is required";
    }

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Valid email is required";
    }

    if (empty($phone) || !preg_match('/^[0-9+\-\s()]+$/', $phone)) {
        $errors[] = "Valid phone number is required";
    }

    if (empty($blood_group) || !in_array($blood_group, ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])) {
        $errors[] = "Valid blood group is required";
    }

    if (empty($donation_type) || !in_array($donation_type, ['blood', 'organ'])) {
        $errors[] = "Valid donation type is required";
    }

    if (empty($preferred_date) || !strtotime($preferred_date)) {
        $errors[] = "Valid preferred date is required";
    }

    // If no errors, insert into database
    if (empty($errors)) {
        try {
            // Prepare SQL statement
            $stmt = $pdo->prepare("INSERT INTO users (name, email, phone, blood_group, donation_type, preferred_date, hospital_id) VALUES (?, ?, ?, ?, ?, ?, ?)");

            // Execute the statement
            $stmt->execute([$name, $email, $phone, $blood_group, $donation_type, $preferred_date, $hospital_id]);

            // Store user data in session
            $_SESSION['user_name'] = $name;
            $_SESSION['user_email'] = $email;

            // Create cookies
            setcookie("user_name", $name, time() + 3600);
            setcookie("user_email", $email, time() + 3600);

            // Send confirmation email
            sendMail($email, $name, $preferred_date, $donation_type);

            // Success - redirect with success parameter
            header("Location: registration.html?success=1");
            exit();
        } catch(PDOException $e) {
            // Handle database error - redirect with error parameter
            header("Location: registration.html?error=1");
            exit();
        }
    } else {
        // Validation errors - redirect with error parameter
        header("Location: registration.html?error=1");
        exit();
    }
} else {
    // Method not allowed - redirect to registration page
    header("Location: registration.html?error=1");
    exit();
}
?>