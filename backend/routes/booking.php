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

// Route for posting time slots (matches URLs like /doctors/{doctorId}/timeSlots)
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
                $bookingController->postTimeSlots($doctorId);
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
    exit();  // Add exit to prevent further code execution after time slots are handled
}

// Route for fetching bookings with user information (matches URLs like /bookings/doctors/{doctorId})
if (preg_match('/\/hospitalWebPage\/backend\/api\/v1\/bookings\/doctors\/(\d+)/', $url, $matches)) {
    $doctorId = $matches[1];
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            // Get request headers for token verification (optional if needed)
            //$requestHeaders = getallheaders();

            try {
                // Optional: Check if the token exists (only warn if missing)
                //$authResult = $tokenMiddleware->authenticate($requestHeaders);

                // Allow any user (guests, patients, doctors, etc.) to fetch bookings
                // If needed, remove the restrictive role check here to allow everyone access

                // Call the controller to get bookings with user info
                $bookingController->getBookingsWithUserInfo($doctorId);
            } catch (Exception $e) {
                // Log and return a warning if token is invalid but don't block access
                echo json_encode([
                    'success' => false,
                    'message' => 'Warning: Token verification failed, but continuing with guest access.',
                    'error' => $e->getMessage()
                ]);
            }
            break;

        default:
            http_response_code(405); // Method not allowed
            echo json_encode(['success' => false, 'message' => 'Invalid request method for bookings']);
            break;
    }
    exit();  // Add exit to stop further execution after fetching bookings
}


// Route for updating booking (matches URLs like /bookings/{bookingId})
if (preg_match('/\/hospitalWebPage\/backend\/api\/v1\/bookings\/(\d+)/', $url, $matches)) {
    $bookingId = $matches[1];
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'PUT':
            $requestHeaders = getallheaders();
            $authResult = $tokenMiddleware->authenticate($requestHeaders);

            // Allow both patients and doctors to update bookings
            $allowedRoles = ['patient', 'doctor'];
            $tokenMiddleware->restrict($allowedRoles, $requestHeaders, $authResult);

            // Call the updateBooking method
            $bookingController->updateBooking($bookingId);
            break;

        case 'DELETE':
            error_log("Processing DELETE request for booking ID: $bookingId");

            $requestHeaders = getallheaders();
            $authResult = $tokenMiddleware->authenticate($requestHeaders);

            // Allow both patients and doctors to delete bookings
            $allowedRoles = ['patient', 'doctor'];
            $tokenMiddleware->restrict($allowedRoles, $requestHeaders, $authResult);

            // Call the deleteBooking method
            $bookingController->deleteBooking($bookingId);
            break;

        default:
            http_response_code(405); // Method not allowed
            echo json_encode(['success' => false, 'message' => 'Invalid request method for bookings']);
            break;
    }
    exit();  // Add exit to prevent further execution
}






// If no matching routes were found, return a 404 error
http_response_code(404); // Not found
echo json_encode(['success' => false, 'message' => 'Not Found']);
