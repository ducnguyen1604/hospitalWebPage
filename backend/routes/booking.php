<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include the necessary files
require_once __DIR__ . '/../controllers/BookingController.php';
require_once __DIR__ . '/../auth/verifyToken.php';

// Initialize controllers and token middleware
$bookingController = new BookingController();
$tokenMiddleware = new TokenMiddleware();

// Get the current URL path (for routing)
$url = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$url = rtrim($url, '/');

// Set the content type to JSON
header('Content-Type: application/json');

// Extract doctor ID from URL if available
$doctorId = null;
if (preg_match('/\/doctors\/(\d+)/', $url, $matches)) {
    $doctorId = $matches[1];
}

// Routing based on URL path
if (preg_match('/\/hospitalWebPage\/backend\/api\/v1\/bookings\/doctors\/' . $doctorId . '\/timeSlots/', $url)) {
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'POST':
            // Get request headers for token verification
            $requestHeaders = getallheaders();

            // Authenticate token
            $authResult = $tokenMiddleware->authenticate($requestHeaders);

            // Restrict access based on roles (only doctors can post time slots)
            $allowedRoles = ['doctor'];
            $tokenMiddleware->restrict($allowedRoles, $requestHeaders, $authResult);
            $doctorId = $authResult['userId'] ?? null;

            // Get time slot data from JSON input
            $timeSlots = json_decode(file_get_contents('php://input'), true);

            // Check if time slots data is available
            if (!empty($timeSlots)) {
                // Call the controller to post time slots
                $response = $bookingController->postTimeSlots($doctorId);
                echo json_encode(['success' => true, 'message' => 'Time slots posted successfully', 'data' => $response]);
            } else {
                http_response_code(400); // Bad request
                echo json_encode(['success' => false, 'message' => 'No time slots data provided']);
            }
            break;

        default:
            http_response_code(405); // Method not allowed
            echo json_encode(['success' => false, 'message' => 'Invalid request method for time slots']);
            break;
    }
} else {
    http_response_code(404); // Not found
    echo json_encode(['success' => false, 'message' => 'Not Found']);
}

