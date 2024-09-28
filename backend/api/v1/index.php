<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Allow CORS
header('Access-Control-Allow-Origin: *'); // Adjust the domain as needed
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');


// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Require necessary files for routing
require_once __DIR__ . '/../../config/Database.php';


// echo 'Server is running on port: ' . $_SERVER['SERVER_PORT'] . '<br>';

// Check the URL path
$url = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$url = rtrim($url, '/'); // Ensure no trailing slashes
echo "this url is here:" . $url;

// Route handling for the API
if (strpos($url, '/hospitalWebPage/backend/api/v1/auth') === 0) {
    require_once __DIR__ . '/../../routes/auth.php';
} elseif (strpos($url, '/hospitalWebPage/backend/api/v1/users') === 0) {
    require_once __DIR__ . '/../../routes/user.php';
} elseif (strpos($url, '/hospitalWebPage/backend/api/v1/doctors') === 0) {
    require_once __DIR__ . '/../../routes/doctor.php';
} elseif (strpos($url, '/hospitalWebPage/backend/api/v1/reviews') === 0) {
    require_once __DIR__ . '/../../routes/review.php';
} else {
    // If no route matches, return a 404 response
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Not Found']);
}

//Instantiate the Database class and connect
$database = new Database();
$db = $database->connect();

if ($db) {
    echo 'Database connection successful';
} else {
    echo 'Database connection failed';
}
