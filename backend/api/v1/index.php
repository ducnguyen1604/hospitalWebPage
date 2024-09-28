<?php
// Front Controller (api/v1/index.php)

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Require necessary files for routing
require_once __DIR__ . '/../../config/Database.php';


// echo 'Server is running on port: ' . $_SERVER['SERVER_PORT'] . '<br>';

// Check the URL path
$url = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$url = rtrim($url, '/'); // Ensure no trailing slashes

// Route handling for the API
if (strpos($url, '/hospitalWebPage/backend/api/v1/auth') === 0) {
    require_once __DIR__ . '/../../routes/auth.php';
} elseif (strpos($url, '/hospitalWebPage/backend/api/v1/users') === 0) {
    require_once __DIR__ . '/../../routes/user.php';
} elseif (strpos($url, '/hospitalWebPage/backend/api/v1/doctors') === 0) {
    // Route for doctors added
    require_once __DIR__ . '/../../routes/doctor.php';
} else {
    // If no route matches, return a 404 response
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Not Found']);
}

// Instantiate the Database class and connect
$database = new Database();
$db = $database->connect();

if ($db) {
    echo 'Database connection successful';
} else {
    echo 'Database connection failed';
}
