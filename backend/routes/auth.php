<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include the necessary files
require_once __DIR__ . '/../controllers/AuthController.php';

// Initialize the AuthController
$authController = new AuthController();

// Get the current URL path (for routing)
$url = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$url = str_replace(['/hospitalWebPage/backend/index.php', '/hospitalWebPage/backend'], '', $url);
echo 'Parsed URL: ' . htmlspecialchars($url) . '<br>';  // Debugging output

// Handle routes for authentication
switch ($url) {
    case '/register':
        // Handle registration
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Get JSON input from request body
            $inputData = json_decode(file_get_contents('php://input'), true);

            // Validate the input data
            if (
                empty($inputData['email']) || empty($inputData['password']) ||
                empty($inputData['name']) || empty($inputData['role']) || empty($inputData['phone'])
            ) {
                http_response_code(400); // Bad request
                echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
                break;
            }

            // Call the register method and pass the JSON data
            $response = $authController->register($inputData);
            echo $response; // Handle response output
        } else {
            http_response_code(405); // Method not allowed
            echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
        }
        break;

    case '/login':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Get JSON input from request body
            $credentials = json_decode(file_get_contents('php://input'), true);

            // Validate the credentials
            if (empty($credentials['email']) || empty($credentials['password'])) {
                http_response_code(400); // Bad request
                echo json_encode(['status' => 'error', 'message' => 'Missing email or password']);
                break;
            }

            // Call the login method and pass the JSON credentials
            $response = $authController->login($credentials);
            echo $response; // Return the response from AuthController
        } else {
            http_response_code(405); // Method not allowed
            echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
        }
        break;

    default:
        http_response_code(404); // Not found
        echo json_encode(['status' => 'error', 'message' => 'Not Found']);
        break;
}
