<?php
require_once __DIR__ . '/../vendor/autoload.php'; // Load JWT package and any other dependencies
require_once __DIR__ . '/../controllers/UserController.php';
require_once __DIR__ . '/../controllers/DoctorController.php';

use Dotenv\Dotenv;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class TokenMiddleware
{
    private $conn;
    //load env variable
    public function __construct()
    {
        $dotenv = Dotenv::createImmutable(__DIR__ . '/../');
        $dotenv->load();
    }

    // Function to verify JWT token
    public function authenticate($requestHeaders)
    {
        // Get token from Authorization header
        $authHeader = isset($requestHeaders['Authorization']) ? trim($requestHeaders['Authorization']) : (isset($requestHeaders['authorization']) ? trim($requestHeaders['authorization']) : '');
        $authToken = str_replace('Bearer ', '', $authHeader);

        // Debugging: check what is being extracted
        echo "Auth Header: " . $authHeader . "\n"; // Debugging line
        echo "Extracted Token: " . $authToken . "\n"; // Debugging line

        // Check if token exists
        if (!$authToken) {
            // Respond with unauthorized status if no token provided
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'No token, authorization denied']);
            exit();
        }

        try {
            // Extract token part after "Bearer"
            $tokenParts = explode(" ", $authHeader);
            $token = isset($tokenParts[1]) ? $tokenParts[1] : null;


            // Debugging: ensure token is correctly extracted
            echo "Token after extraction: " . $token . "\n";

            // Check if the secret key is available
            if (!isset($_ENV['JWT_SECRET_KEY'])) {
                throw new Exception("JWT_SECRET_KEY is not set in the environment.");
            }

            // Debugging: Print JWT secret key to ensure it's being loaded
            echo "JWT Secret Key: " . $_ENV['JWT_SECRET_KEY'] . "\n";

            // Verify the token
            $decoded = JWT::decode($token, new Key($_ENV['JWT_SECRET_KEY'], 'HS256'));

            // You can set user details in the request object for further use
            $userId = $decoded->data->id; // Assuming your JWT payload has 'data' with 'id'
            $userRole = $decoded->data->role; // Assuming your JWT payload has 'data' with 'role'

            // Return the decoded token data for further processing or use
            return [
                'userId' => $userId,
                'role' => $userRole,
                'decodedToken' => $decoded
            ];
        } catch (\Firebase\JWT\ExpiredException $e) {
            // Handle expired token error
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Token is expired']);
            exit();
        } catch (Exception $e) {
            // Handle invalid token errors (e.g., expired token, invalid signature)
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid token, authorization denied', 'error' => $e->getMessage()]);
            exit();
        }
    }

    public function restrict($roles, $requestHeaders, $authData = null)
    {
        // If authData is not provided, authenticate with the provided headers
        if ($authData === null) {
            $authData = $this->authenticate($requestHeaders);
        }

        $userId = $authData['userId'];
        $userRole = $authData['role'];
        $user = null;

        // If userId is present, fetch user or doctor based on userId
        if ($userId) {
            // Use UserController and DoctorController to find the correct entity
            $userController = new UserController();
            $doctorController = new DoctorController();

            // Attempt to find as patient first
            $patient = $userController->getUserById($userId);
            if ($patient) {
                $user = $patient;
            }

            // If not found as patient, find as doctor
            if (!$user) {
                $doctor = $doctorController->getDoctorById($userId);
                if ($doctor) {
                    $user = $doctor;
                }
            }

            // If user is found, verify role
            if ($user && in_array($userRole, $roles)) {
                // User is authorized
                return true;
            }
        }

        // User is not authorized
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'You\'re not authorized']);
        exit();
    }
}
