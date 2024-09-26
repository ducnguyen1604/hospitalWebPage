<?php
require_once __DIR__ . '/../vendor/autoload.php'; // Load JWT package and any other dependencies
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Doctor.php';
require_once __DIR__ . '/../config/Database.php';

use Dotenv\Dotenv;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class TokenMiddleware
{
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
        $authHeader = isset($requestHeaders['Authorization']) ? trim($requestHeaders['Authorization']) : '';
        $authToken = str_replace('Bearer ', '', $authHeader);

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

            // Check if the secret key is available
            if (!isset($_ENV['JWT_SECRET_KEY'])) {
                throw new Exception("JWT_SECRET_KEY is not set in the environment.");
            }

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
}
