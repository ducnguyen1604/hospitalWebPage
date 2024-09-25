<?php
// Include the necessary files
require_once __DIR__ . '../../models/User.php';
require_once __DIR__ . '../../config/Database.php';

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
}
