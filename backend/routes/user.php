<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include the necessary files
require_once __DIR__ . '/../controllers/UserController.php';
require_once __DIR__ . '/../auth/verifyToken.php';

// Initialize the UserController
$userController = new UserController();
$tokenMiddleware = new TokenMiddleware();

// Get the current URL path (for routing)
$url = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$url = rtrim($url, '/');
//echo 'URL: ' . htmlspecialchars($url);
// Set the content type to JSON
header('Content-Type: application/json');

// Handle routes for user-related actions
switch ($url) {
    case '/hospitalWebPage/backend/api/v1/users/updateUser':
        if ($_SERVER['REQUEST_METHOD'] === 'PUT' || $_SERVER['REQUEST_METHOD'] === 'PATCH') {
            // Get request headers for token verification
            $requestHeaders = getallheaders();
            // Authenticate token
            $authResult = $tokenMiddleware->authenticate($requestHeaders);

            // Restrict access based on roles
            $allowedRoles = ['patient'];
            $tokenMiddleware->restrict($allowedRoles, $requestHeaders, $authResult);

            $id = $_GET['id'] ?? null;
            if ($id) {
                // Get the JSON input data
                $userData = json_decode(file_get_contents('php://input'), true);

                // Validate if the necessary data is present
                if (!empty($userData['email']) && !empty($userData['name'])) {
                    $response = $userController->updateUser($id, $userData);
                    echo $response;
                } else {
                    http_response_code(400); // Bad request
                    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
                }
            } else {
                http_response_code(400); // Bad request
                echo json_encode(['success' => false, 'message' => 'Missing user ID']);
            }
        } else {
            http_response_code(405); // Method not allowed
            echo json_encode(['success' => false, 'message' => 'Invalid request method']);
        }
        break;

    case '/hospitalWebPage/backend/api/v1/users/deleteUser':
        // Handle DELETE request for deleting a user
        if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

            // Get request headers for token verification
            $requestHeaders = getallheaders();
            // Authenticate token
            $authResult = $tokenMiddleware->authenticate($requestHeaders);

            // Restrict access based on roles
            $allowedRoles = ['patient'];
            $tokenMiddleware->restrict($allowedRoles, $requestHeaders, $authResult);

            $id = $_GET['id'] ?? null;

            if ($id) {
                $response = $userController->deleteUser($id);
                echo $response;
            } else {
                http_response_code(400); // Bad request
                echo json_encode(['success' => false, 'message' => 'Missing user ID']);
            }
        } else {
            http_response_code(405); // Method not allowed
            echo json_encode(['success' => false, 'message' => 'Invalid request method']);
        }
        break;
    case '/hospitalWebPage/backend/api/v1/users/getUser':
        // Handle GET request for retrieving a single user
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {

            // Get request headers for token verification
            $requestHeaders = getallheaders();
            echo json_encode($requestHeaders);
            // Authenticate token
            $authResult = $tokenMiddleware->authenticate($requestHeaders);

            // Restrict access based on roles
            $allowedRoles = ['patient'];
            $tokenMiddleware->restrict($allowedRoles, $requestHeaders, $authResult);

            $id = $_GET['id'] ?? null;

            if ($id) {
                $response = $userController->getSingleUser($id);
                echo $response;
            } else {
                http_response_code(400); // Bad request
                echo json_encode(['success' => false, 'message' => 'Missing user ID']);
            }
        } else {
            http_response_code(405); // Method not allowed
            echo json_encode(['success' => false, 'message' => 'Invalid request method']);
        }
        break;
    case '/hospitalWebPage/backend/api/v1/users/getAllUsers':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            // Get request headers for token verification
            $requestHeaders = getallheaders();

            // Initialize TokenMiddleware
            $tokenMiddleware = new TokenMiddleware();

            // Authenticate token
            $authResult = $tokenMiddleware->authenticate($requestHeaders);

            // Restrict access based on roles
            $allowedRoles = ['admin'];
            $tokenMiddleware->restrict($allowedRoles, $requestHeaders, $authResult);

            // If the user is authorized, proceed with fetching all users
            $response = $userController->getAllUsers();
            echo $response;
        } else {
            http_response_code(405); // Method not allowed
            echo json_encode(['success' => false, 'message' => 'Invalid request method']);
        }
        break;

    case '/hospitalWebPage/backend/api/v1/users/getUserProfile':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            // Get request headers for token verification
            $requestHeaders = getallheaders();
            $authResult = $tokenMiddleware->authenticate($requestHeaders);
            $allowedRoles = ['patient'];
            $tokenMiddleware->restrict($allowedRoles, $requestHeaders, $authResult);
            $userId = $authResult['userId'] ?? null;
            // Get user profile
            $response = $userController->getUserProfile($userId);
            http_response_code(200);
            echo $response;
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Invalid request method']);
        }
        break;

    case '/hospitalWebPage/backend/api/v1/users/bookings/getMyAppointments':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            // Get request headers for token verification
            $requestHeaders = getallheaders();
            $authResult = $tokenMiddleware->authenticate($requestHeaders);
            $allowedRoles = ['patient'];
            $tokenMiddleware->restrict($allowedRoles, $requestHeaders, $authResult);

            $userId = $authResult['userId'] ?? null;
            // Check if userId is available
            if ($userId) {
                // Get user's appointments
                $response = $userController->getMyAppointments($userId);
                echo $response;
            } else {
                http_response_code(400); // Bad request
                echo json_encode(['success' => false, 'message' => 'User ID not found in token']);
            }
        } else {
            http_response_code(405); // Method not allowed
            echo json_encode(['success' => false, 'message' => 'Invalid request method']);
        }
        break;

    default:
        error_log('Invalid route accessed: ' . $_SERVER['REQUEST_URI'], 0);
        http_response_code(404); // Not found
        echo json_encode(['success' => false, 'message' => 'Not Found']);
        break;
}
