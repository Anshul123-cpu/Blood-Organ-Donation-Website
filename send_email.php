<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

function sendMail($toEmail, $name, $date, $type) {
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'chirag2006chaudhari@gmail.com'; // Replace with your Gmail address
        $mail->Password = 'dbivkftyxscdmjcy'; // Replace with your Gmail app password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Recipients
        $mail->setFrom('your-email@gmail.com', 'Blood & Organ Donation System'); // Replace with your Gmail address
        $mail->addAddress($toEmail, $name);

        // Content
        $mail->isHTML(false);
        $mail->Subject = 'Donation Registration Confirmation';
        $mail->Body = "Hello $name,\n\n" .
                      "You have successfully registered for $type donation.\n" .
                      "Preferred Date: $date\n\n" .
                      "Please reply to this email with your consent form.\n\n" .
                      "Thank you.";

        $mail->send();
        return true;
    } catch (Exception $e) {
        // Log error or handle as needed
        error_log("Email sending failed: " . $mail->ErrorInfo);
        return false;
    }
}
?>