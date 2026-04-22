<?php

class RegisterTest {

    public function testValidInput() {
        $name = "Chirag";
        $email = "test@gmail.com";

        if (!empty($name) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo "Test Passed: Valid Input<br>";
        } else {
            echo "Test Failed: Valid Input<br>";
        }
    }

    public function testInvalidEmail() {
        $email = "invalid-email";
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo "Test Passed: Invalid Email<br>";
        } else {
            echo "Test Failed: Invalid Email<br>";
        }
    }

    public function testEmptyName() {
        $name = "";
        if (empty($name)) {
            echo "Test Passed: Empty Name<br>";
        } else {
            echo "Test Failed: Empty Name<br>";
        }
    }
}

// Run tests
$test = new RegisterTest();
$test->testValidInput();
$test->testInvalidEmail();
$test->testEmptyName();

?>