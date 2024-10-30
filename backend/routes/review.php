<?php

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../controllers/ReviewController.php';
require_once __DIR__ . '/../auth/verifyToken.php';

// Initialize required objects
$tokenMiddleware = new TokenMiddleware();
$reviewController = new ReviewController();

// Set CORS headers to allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get request headers for token verification
$requestHeaders = getallheaders();

// Determine the route and HTTP method from the request
$url = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Extract doctorId from the URL pattern: /hospitalWebPage/backend/api/v1/doctors/{doctorId}/reviews
$doctorId = null;
if (preg_match('/\/hospitalWebPage\/backend\/api\/v1\/doctors\/(\d+)\/reviews/', $url, $matches)) {
    $doctorId = $matches[1];
}

// Main route handling logic
switch (true) {
    case ($doctorId !== null && strpos($url, '/reviews') !== false):
        if ($method === 'GET') {
            // Retrieve reviews for the given doctor ID
            $response = $reviewController->getReviewsByDoctorId($doctorId);
            echo $response;
        } elseif ($method === 'POST') {
            // Authenticate token and ensure the user has the correct role
            try {
                $authResult = $tokenMiddleware->authenticate($requestHeaders);

                // Restrict access to patients only
                $allowedRoles = ['patient'];
                $tokenMiddleware->restrict($allowedRoles, $authResult);

                // Get userId from the authenticated token
                $userId = $authResult['userId']; // Adjust based on token structure

                // Get JSON input data from the request body
                $reviewData = json_decode(file_get_contents('php://input'), true);

                if (!empty($reviewData)) {
                    // Create a new review for the given doctor ID and user ID
                    $response = $reviewController->createReview($reviewData, $doctorId, $userId);
                    echo $response;
                } else {
                    http_response_code(400); // Bad request
                    echo json_encode(['success' => false, 'message' => 'Missing review data']);
                }
            } catch (Exception $e) {
                http_response_code(401); // Unauthorized
                echo json_encode(['success' => false, 'message' => $e->getMessage()]);
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
