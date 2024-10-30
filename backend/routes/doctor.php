<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include the necessary files
require_once __DIR__ . '/../controllers/DoctorController.php';
require_once __DIR__ . '/../controllers/ReviewController.php';
require_once __DIR__ . '/../auth/verifyToken.php';

// Initialize controllers and token middleware
$doctorController = new DoctorController();
$reviewController = new ReviewController();
$tokenMiddleware = new TokenMiddleware();

// Get the current URL path (for routing)
$url = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$url = rtrim($url, '/');
//echo 'URL: ' . htmlspecialchars($url);
// Set the content type to JSON
header('Content-Type: application/json');

// Extract doctor ID from URL if available
$doctorId = null;
if (preg_match('/\/doctors\/(\d+)/', $url, $matches)) {
    $doctorId = $matches[1];
}

// Handle routes for doctor-related actions
switch ($url) {
        // Handle nested review routes for a doctor
    case preg_match('/\/hospitalWebPage\/backend\/api\/v1\/doctors\/' . $doctorId . '\/reviews/', $url) ? true : false:
        // Extract the action after /reviews (if any)
        $action = str_replace('/hospitalWebPage/backend/api/v1/doctors/' . $doctorId . '/reviews', '', $url);

        // Handle review-related actions
        if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === '') {
            // Get all reviews for a specific doctor
            $response = $reviewController->getReviewsByDoctorId($doctorId);
            echo $response;
        } elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === '') {
            // Authenticate token for creating a review
            $requestHeaders = getallheaders();
            $authResult = $tokenMiddleware->authenticate($requestHeaders);

            // Restrict access based on roles (only 'patient' can create reviews)
            $allowedRoles = ['patient'];
            $tokenMiddleware->restrict($allowedRoles, $requestHeaders, $authResult);

            // Get userId from the authenticated token
            $userId = $authResult['userId'] ?? null; // Make sure the token structure contains 'userId'

            // Get review data from JSON input
            $reviewData = json_decode(file_get_contents('php://input'), true);

            // Add doctorId and userId to the review data
            $reviewData['doctorId'] = $doctorId;
            $reviewData['userId'] = $userId;
            // Create a new review for the doctor
            $response = $reviewController->createReview($reviewData, $doctorId, $userId);

            echo $response;
        } else {
            http_response_code(405); // Method not allowed
            echo json_encode(['success' => false, 'message' => 'Invalid request method for reviews']);
        }
        break;

        // Other cases for doctor actions (update, delete, get, etc.)
    case '/hospitalWebPage/backend/api/v1/doctors/updateDoctor':
        if ($_SERVER['REQUEST_METHOD'] === 'PUT' || $_SERVER['REQUEST_METHOD'] === 'PATCH') {
            // Get request headers for token verification
            $requestHeaders = getallheaders();

            // Authenticate token
            $authResult = $tokenMiddleware->authenticate($requestHeaders);

            // Restrict access based on roles
            $allowedRoles = ['patient', 'doctor']; // Adjust the roles as per your needs
            $tokenMiddleware->restrict($allowedRoles, $requestHeaders, $authResult);

            $id = $_GET['id'] ?? null;
            if ($id) {
                // Get the JSON input data
                $doctorData = json_decode(file_get_contents('php://input'), true);

                // Validate if the necessary data is present
                if (!empty($doctorData['email']) && !empty($doctorData['name'])) {
                    $response = $doctorController->updateDoctor($id, $doctorData);
                    echo $response;
                } else {
                    http_response_code(400); // Bad request
                    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
                }
            } else {
                http_response_code(400); // Bad request
                echo json_encode(['success' => false, 'message' => 'Missing doctor ID']);
            }
        } else {
            http_response_code(405); // Method not allowed
            echo json_encode(['success' => false, 'message' => 'Invalid request method']);
        }
        break;

    case '/hospitalWebPage/backend/api/v1/doctors/deleteDoctor':
        // Handle DELETE request for deleting a doctor
        if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

            // Get request headers for token verification
            $requestHeaders = getallheaders();

            // Authenticate token
            $authResult = $tokenMiddleware->authenticate($requestHeaders);

            // Restrict access based on roles
            $allowedRoles = ['admin'];
            $tokenMiddleware->restrict($allowedRoles, $requestHeaders, $authResult);

            $id = $_GET['id'] ?? null;

            if ($id) {
                $response = $doctorController->deleteDoctor($id);
                echo $response;
            } else {
                http_response_code(400); // Bad request
                echo json_encode(['success' => false, 'message' => 'Missing doctor ID']);
            }
        } else {
            http_response_code(405); // Method not allowed
            echo json_encode(['success' => false, 'message' => 'Invalid request method']);
        }
        break;

    case '/hospitalWebPage/backend/api/v1/doctors/getDoctor':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $id = $_GET['id'] ?? null;

            if ($id) {
                $response = $doctorController->getSingleDoctor($id);
                echo $response;
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Missing doctor ID']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Invalid request method']);
        }
        break;


    case '/hospitalWebPage/backend/api/v1/doctors/getAllDoctors':
        // Handle GET request for retrieving all doctors
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $searchQuery = $_GET['query'] ?? null;

            // Call the controller method to fetch all doctors
            $response = $doctorController->getAllDoctors($searchQuery);
            echo $response;
        } else {
            http_response_code(405); // Method not allowed
            echo json_encode(['success' => false, 'message' => 'Invalid request method']);
        }
        break;


    case '/hospitalWebPage/backend/api/v1/doctors/getDoctorProfile':
        // Handle GET request for retrieving doctor profile
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            // Get request headers for token verification
            $requestHeaders = getallheaders();
            $authResult = $tokenMiddleware->authenticate($requestHeaders);
            $allowedRoles = ['doctor'];
            $tokenMiddleware->restrict($allowedRoles, $requestHeaders, $authResult);

            $doctorId = $authResult['userId'] ?? null;
            //echo 'doctorId is:' . $doctorId;
            // Get doctor profile with required arguments
            $response = $doctorController->getDoctorProfile($doctorId);
            http_response_code(200);
            echo $response;
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
