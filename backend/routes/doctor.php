<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include the necessary files
require_once __DIR__ . '/../controllers/DoctorController.php';

// Initialize the DoctorController
$doctorController = new DoctorController();

// Get the current URL path (for routing)
$url = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$url = rtrim($url, '/');
echo 'URL: ' . htmlspecialchars($url);
// Set the content type to JSON
header('Content-Type: application/json');

// Handle routes for doctor-related actions
switch ($url) {
    case '/hospitalWebPage/backend/api/v1/doctors/updateDoctor':
        if ($_SERVER['REQUEST_METHOD'] === 'PUT' || $_SERVER['REQUEST_METHOD'] === 'PATCH') {
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
        // Handle GET request for retrieving a single doctor
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $id = $_GET['id'] ?? null;

            if ($id) {
                $response = $doctorController->getSingleDoctor($id);
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

    case '/hospitalWebPage/backend/api/v1/doctors/getAllDoctors':
        // Handle GET request for retrieving all doctors
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $searchQuery = $_GET['query'] ?? null;
            $response = $doctorController->getAllDoctors($searchQuery);
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
