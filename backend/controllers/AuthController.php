<?php

require 'vendor/autoload.php'; // Load Composer dependencies (JWT, dotenv, etc.)
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthController
{
    public function __construct()
    {
        // Load environment variables (if using dotenv for JWT_SECRET)
        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
        $dotenv->load();
    }

    public function register($userData)
    {
        // Extract data from $userData array
        $email = $userData['email'];
        $password = $userData['password'];
        $name = $userData['name'];
        $role = $userData['role'];
        $photo = $userData['photo'];
        $gender = $userData['gender'];
        $specialization = $userData['specialization'] ?? null; //for doctor
        $phone = $userData['phone'] ?? null; // For doctor

        // Get the database connection
        $database = new Database();
        $db = $database->connect();

        try {
            // Check if user already exists in either table (User for patients or Doctor for doctors)
            if ($role == 'patient') {
                $query = "SELECT * FROM users WHERE email = :email";
            } elseif ($role == 'doctor') {
                $query = "SELECT * FROM doctors WHERE email = :email";
            }

            // Prepare and execute the query
            $stmt = $db->prepare($query);
            $stmt->bindParam(':email', $email);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            // Check if user exists
            if ($user) {
                return json_encode(['status' => 400, 'message' => 'User already exists']);
            }

            // Hash password
            $hashPassword = password_hash($password, PASSWORD_BCRYPT);

            // Insert the new user into the appropriate table
            if ($role == 'patient') {
                $insertQuery = "INSERT INTO users (email, password, name, role, photo, gender) VALUES (:email, :password, :name, :role, :photo, :gender)";
            } elseif ($role == 'doctor') {
                $insertQuery = "INSERT INTO doctors (email, password, name, specialization, phone, photo, gender, role) 
                                VALUES (:email, :password, :name, :specialization, :phone, :photo, :gender, :role)";
            }

            // Prepare and execute the insert query
            $insertStmt = $db->prepare($insertQuery);
            $insertStmt->bindParam(':email', $email);
            $insertStmt->bindParam(':password', $hashPassword);
            $insertStmt->bindParam(':name', $name);
            $insertStmt->bindParam(':role', $role);
            $insertStmt->bindParam(':photo', $photo);
            $insertStmt->bindParam(':gender', $gender);

            // For doctors, bind the specialization
            if ($role == 'doctor') {
                $insertStmt->bindParam(':specialization', $specialization);
                $insertStmt->bindParam(':phone', $phone);
            }

            if ($insertStmt->execute()) {
                return json_encode(['status' => 200, 'message' => 'User successfully created']);
            } else {
                return json_encode(['status' => 500, 'message' => 'Failed to create user']);
            }
        } catch (PDOException $e) {
            // Return a server error if any exception occurs
            return json_encode(['status' => 500, 'message' => 'Internal server error: ' . $e->getMessage()]);
        }
    }

    public function login($credentials)
    {
        //Extract email and pw from credentials
        $email = $credentials['email'];
        $password = $credentials['password'];

        //Check DB connection
        $database = new Database();
        $db = $database->connect();

        try {
            // Check if the user exists in either the users or doctors table
            $queryPatient = "SELECT * FROM users WHERE email = :email";
            $queryDoctor = "SELECT * FROM doctors WHERE email = :email";

            $stmtPatient = $db->prepare($queryPatient);
            $stmtDoctor = $db->prepare($queryDoctor);

            $stmtPatient->bindParam(':email', $email);
            $stmtDoctor->bindParam(':email', $email);

            $stmtPatient->execute();
            $stmtDoctor->execute();

            $patient = $stmtPatient->fetch(PDO::FETCH_ASSOC);
            $doctor = $stmtDoctor->fetch(PDO::FETCH_ASSOC);

            // See if the user is a patient or doctor
            $user = null;
            if ($patient) {
                $user = $patient;
            } elseif ($doctor) {
                $user = $doctor;
            }

            // If no user found
            if (!$user) {
                return json_encode(['status' => 404, 'message' => 'User not found']);
            }

            // Verify the password
            if (!password_verify($password, $user['password'])) {
                return json_encode(['status' => 400, 'message' => 'Invalid credentials']);
            }

            // Generate a token
            $token = $this->generateToken($user);

            // Prepare response data
            unset($user['password']);  // Do not return the password in the response
            return json_encode([
                'status' => 200,
                'message' => 'Successfully logged in',
                'token' => $token,
                'data' => $user
            ]);
        } catch (PDOException $e) {
            return json_encode(['status' => 500, 'message' => 'Internal server error: ' . $e->getMessage()]);
        }
    }

    // Token generation logic (if needed)
    private function generateToken($user)
    { {
            $secretKey = $_ENV['JWT_SECRET_KEY']; // JWT secret key from .env
            $issuedAt = time(); // Current timestamp
            $expirationTime = $issuedAt + (90 * 24 * 60 * 60); // Token valid for 3 months

            // Token payload with user information
            $payload = [
                'iss' => 'localhost',      // Issuer
                'aud' => 'localhost',      // Audience
                'iat' => $issuedAt,        // Issued at time
                'exp' => $expirationTime,  // Expiration time
                'data' => [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'role' => $user['role']
                ]
            ];

            // Generate and return the JWT token
            return JWT::encode($payload, $secretKey, 'HS256');
        }
    }
    public function verifyToken($token)
    {
        $secretKey = $_ENV['JWT_SECRET_KEY']; // JWT secret key from .env
        try {
            // Decode the token (this returns a stdClass object)
            $decoded = JWT::decode($token, new Key($secretKey, 'HS256')); // Use Key class for security

            // Return the decoded stdClass object
            return $decoded;
        } catch (Exception $e) {
            // Handle token errors, such as expired or invalid signature
            return null; // Token is invalid
        }
    }
}
