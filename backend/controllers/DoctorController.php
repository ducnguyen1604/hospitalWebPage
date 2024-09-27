<?php
// Include the necessary files
require_once __DIR__ . '../../models/Doctor.php';
require_once __DIR__ . '../../config/Database.php';

class DoctorController
{
    private $conn;

    public function __construct()
    {
        // Initialize the Database and establish connection
        $database = new Database();
        $this->conn = $database->connect();
    }

    // Update Doctor
    public function updateDoctor($id, $doctorData)
    {
        try {
            $query = "UPDATE doctors SET 
                        email = :email,
                        name = :name,
                        phone = :phone,
                        role = :role,
                        gender = :gender,
                        photo = :photo,
                        specialization = :specialization,
                        isApproved = :isApproved
                      WHERE id = :id";

            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':email', $doctorData['email']);
            $stmt->bindParam(':name', $doctorData['name']);
            $stmt->bindParam(':phone', $doctorData['phone']);
            $stmt->bindParam(':role', $doctorData['role']);
            $stmt->bindParam(':gender', $doctorData['gender']);
            $stmt->bindParam(':photo', $doctorData['photo']);
            $stmt->bindParam(':specialization', $doctorData['specialization']);
            $stmt->bindParam(':isApproved', $doctorData['isApproved']);
            $stmt->bindParam(':id', $id);

            if ($stmt->execute()) {
                return json_encode([
                    'success' => true,
                    'message' => 'Successfully updated',
                    'data' => $this->getDoctorById($id)
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

    // Helper method to get doctor by ID
    public function getDoctorById($id)
    {
        try {
            $query = "SELECT * FROM doctors WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return null;
        }
    }

    // Function to delete a doctor by ID
    public function deleteDoctor($id)
    {
        try {
            $query = "DELETE FROM doctors WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);

            if ($stmt->execute()) {
                return json_encode([
                    'success' => true,
                    'message' => 'Doctor successfully deleted'
                ]);
            } else {
                return json_encode([
                    'success' => false,
                    'message' => 'Failed to delete doctor'
                ]);
            }
        } catch (PDOException $e) {
            return json_encode([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ]);
        }
    }

    // Function to get a single doctor by ID
    public function getSingleDoctor($id)
    {
        try {
            $doctor = $this->getDoctorById($id);
            if ($doctor) {
                unset($doctor['password']);
                return json_encode([
                    'success' => true,
                    'message' => 'Doctor found',
                    'data' => $doctor
                ]);
            } else {
                return json_encode([
                    'success' => false,
                    'message' => 'No doctor found'
                ]);
            }
        } catch (PDOException $e) {
            return json_encode([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ]);
        }
    }

    // Function to get all doctors with search functionality
    public function getAllDoctors($searchQuery = null)
    {
        try {
            // Base query to select doctors who are approved
            $query = "SELECT * FROM doctors WHERE isApproved = 'approved'";

            // If there is a search query, add conditions for name or specialization
            if (!empty($searchQuery)) {
                $query .= " AND (name LIKE :query OR specialization LIKE :query)";
            }

            $stmt = $this->conn->prepare($query);

            // Bind the search query parameter if present
            if (!empty($searchQuery)) {
                $searchPattern = '%' . $searchQuery . '%';
                $stmt->bindParam(':query', $searchPattern);
            }

            $stmt->execute();

            $doctors = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Remove the password field from each doctor in the result set
            foreach ($doctors as &$doctor) {
                unset($doctor['password']);
            }

            if ($doctors) {
                return json_encode([
                    'success' => true,
                    'message' => 'Doctors found',
                    'data' => $doctors
                ]);
            } else {
                return json_encode([
                    'success' => false,
                    'message' => 'No doctors found'
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