<?php

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../controllers/ReviewController.php';
require_once __DIR__ . '/../auth/verifyToken.php';

$tokenMiddleware = new TokenMiddleware();
$reviewController = new ReviewController();

// Get request headers for token verification
$requestHeaders = getallheaders();

// Determine the route and method from the request
$url = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

header('Content-Type: application/json');

// Extract doctorId from the URL pattern: /hospitalWebPage/backend/api/v1/doctors/{doctorId}/reviews
$doctorId = null;
if (preg_match('/\/hospitalWebPage\/backend\/api\/v1\/doctors\/(\d+)\/reviews/', $url, $matches)) {
    $doctorId = $matches[1];
}

switch (true) {
        // Assuming the route to create and retrieve reviews is /hospitalWebPage/backend/api/v1/doctors/{doctorId}/reviews
    case ($doctorId !== null && strpos($url, '/reviews') !== false):
        // Handle GET request to retrieve all reviews for a specific doctor
        if ($method === 'GET') {
            // Retrieve all reviews for the given doctorId
            $response = $reviewController->getAllReviews($doctorId);
            echo $response;
        }
        // Handle POST request to create a new review for a specific doctor
        elseif ($method === 'POST') {
            // Authenticate token to extract user information
            $authResult = $tokenMiddleware->authenticate($requestHeaders);

            // Restrict access to only "patient" role
            $allowedRoles = ['patient'];
            $tokenMiddleware->restrict($allowedRoles, $authResult);

            // Get userId from the authenticated token
            $userId = $authResult['userId']; // Adjust according to your token structure

            // Get the JSON input data
            $reviewData = json_decode(file_get_contents('php://input'), true);

            if (!empty($reviewData)) {
                // Call the createReview function with doctorId and userId
                $response = $reviewController->createReview($reviewData, $doctorId, $userId);
                echo $response;
            } else {
                http_response_code(400); // Bad request
                echo json_encode(['success' => false, 'message' => 'Missing review data']);
            }
        } else {
            http_response_code(405); // Method not allowed
            echo json_encode(['success' => false, 'message' => 'Invalid request method']);
        }
        break;

    default:
        http_response_code(404); // Not found
        echo json_encode(['success' => false, 'message' => 'Not Found']);
        break;
}
