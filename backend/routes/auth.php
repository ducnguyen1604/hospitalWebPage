<?php
// Include the necessary files
require_once '../controllers/AuthController.php';

// Initialize the AuthController
$authController = new AuthController();

// Get the current URL path (for routing)
$url = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Handle routes for authentication
switch ($url) {
    case '/register':
        // Handle registration
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $userData = [
                'username' => $_POST['username'],
                'email' => $_POST['email'],
                'password' => $_POST['password']
            ];
            $authController->register($userData);
        } else {
            // Show the registration form (view)
            include_once '../views/register.php';
        }
        break;

    case '/login':
        // Handle login
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $credentials = [
                'email' => $_POST['email'],
                'password' => $_POST['password']
            ];
            $authController->login($credentials);
        } else {
            // Show the login form (view)
            include_once '../views/login.php';
        }
        break;

    default:
        echo "404 - Page not found";
        break;
}
