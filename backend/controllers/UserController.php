<?php
// Include the necessary files
require_once __DIR__ . '../../models/User.php';
require_once __DIR__ . '../../config/Database.php';
require_once __DIR__ . '/../models/Booking.php';
require_once __DIR__ . '/../models/Doctor.php';


class UserController
{
    private $conn;

    public function __construct()
    {
        // Initialize the Database and establish connection
        $database = new Database();
        $this->conn = $database->connect();
    }

    // Update User (already provided)
    public function updateUser($id, $userData)
    {
        try {
            $query = "UPDATE users SET 
                        email = :email,
                        name = :name,
                        phone = :phone,
                        role = :role,
                        gender = :gender,
                        photo = :photo
                      WHERE id = :id";

            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':email', $userData['email']);
            $stmt->bindParam(':name', $userData['name']);
            $stmt->bindParam(':phone', $userData['phone']);
            $stmt->bindParam(':role', $userData['role']);
            $stmt->bindParam(':gender', $userData['gender']);
            $stmt->bindParam(':photo', $userData['photo']);
            $stmt->bindParam(':id', $id);

            if ($stmt->execute()) {
                return json_encode([
                    'success' => true,
                    'message' => 'Successfully updated',
                    'data' => $this->getUserById($id)
                ]);
            } else {
                return json_encode([
                    'success' => false,
                    'message' => 'Failed to update'
                ]);
            }
        } catch (PDOException $e) {
            return json_encode([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ]);
        }
    }

    // Helper method to get user by ID
    public function getUserById($id)
    {
        try {
            $query = "SELECT * FROM users WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return null;
        }
    }

    // Function to delete a user by ID
    public function deleteUser($id)
    {
        try {
            $query = "DELETE FROM users WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);

            if ($stmt->execute()) {
                return json_encode([
                    'success' => true,
                    'message' => 'User successfully deleted'
                ]);
            } else {
                return json_encode([
                    'success' => false,
                    'message' => 'Failed to delete user'
                ]);
            }
        } catch (PDOException $e) {
            return json_encode([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ]);
        }
    }

    // Function to get a single user by ID
    public function getSingleUser($id)
    {
        try {
            $user = $this->getUserById($id);
            if ($user) {
                unset($user['password']);
                return json_encode([
                    'success' => true,
                    'message' => 'User found',
                    'data' => $user
                ]);
            } else {
                return json_encode([
                    'success' => false,
                    'message' => 'No user found'
                ]);
            }
        } catch (PDOException $e) {
            return json_encode([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ]);
        }
    }

    // Function to get all users
    public function getAllUsers()
    {
        try {
            $query = "SELECT * FROM users";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();

            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            // Remove the password field from each user in the result set
            foreach ($users as &$user) {
                unset($user['password']);
            }

            if ($users) {
                return json_encode([
                    'success' => true,
                    'message' => 'Users found',
                    'data' => $users
                ]);
            } else {
                return json_encode([
                    'success' => false,
                    'message' => 'No users found'
                ]);
            }
        } catch (PDOException $e) {
            return json_encode([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ]);
        }
    }

    // Em ms add cai case nay va cai case duoi bang chat gpt. em chua test xem no co chay dc ko

    // Function to get user profile by ID
    public function getUserProfile($id)
    {
        try {
            // Fetch the user data
            $user = $this->getUserById($id);

            // Check if user exists
            if (!$user) {
                return json_encode([
                    'success' => false,
                    'message' => 'User not found'
                ]);
            }

            // Remove password from user data
            unset($user['password']);

            // Return user data
            return json_encode([
                'success' => true,
                'message' => 'Profile info retrieved successfully',
                'data' => $user
            ]);
        } catch (PDOException $e) {
            // Handle error
            return json_encode([
                'success' => false,
                'message' => 'Something went wrong, cannot get profile'
            ]);
        }
    }

    // Function to get appointments for a user
    public function getMyAppointments($userId)
    {
        try {
            // Step 1: Retrieve bookings for a specific user
            $query = "SELECT * FROM bookings WHERE user_id = :userId";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':userId', $userId);
            $stmt->execute();
            $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (!$bookings) {
                return json_encode([
                    'success' => false,
                    'message' => 'No bookings found'
                ]);
            }

            // Step 2: Extract doctor IDs from the bookings
            $doctorIds = array_map(function ($booking) {
                return $booking['doctor_id'];
            }, $bookings);

            // Step 3: Retrieve doctor details using doctor IDs
            $inQuery = implode(',', array_fill(0, count($doctorIds), '?'));
            $query = "SELECT * FROM doctors WHERE id IN ($inQuery)";
            $stmt = $this->conn->prepare($query);
            foreach ($doctorIds as $k => $id) {
                $stmt->bindValue(($k + 1), $id);
            }
            $stmt->execute();
            $doctors = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (!$doctors) {
                return json_encode([
                    'success' => false,
                    'message' => 'No doctors found for the bookings'
                ]);
            }

            // Remove any sensitive information from doctors, such as passwords
            foreach ($doctors as &$doctor) {
                unset($doctor['password']);
            }

            // Return appointments data
            return json_encode([
                'success' => true,
                'message' => 'Appointments retrieved successfully',
                'data' => $doctors
            ]);
        } catch (PDOException $e) {
            // Handle any error
            return json_encode([
                'success' => false,
                'message' => 'Something went wrong, cannot get appointments'
            ]);
        }
    }
}
