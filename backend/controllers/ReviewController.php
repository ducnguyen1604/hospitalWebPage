<?php
// Include necessary files
require_once __DIR__ . '/../models/Review.php';
require_once __DIR__ . '/../models/Doctor.php';
require_once __DIR__ . '/../config/Database.php';

class ReviewController
{
    private $conn;

    public function __construct()
    {
        // Initialize the Database and establish connection
        $database = new Database();
        $this->conn = $database->connect();
    }

    // Function to get all reviews
    public function getAllReviews()
    {
        try {
            $query = "SELECT * FROM reviews";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();

            $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return json_encode([
                'success' => true,
                'message' => 'Successful',
                'data' => $reviews
            ]);
        } catch (PDOException $e) {
            return json_encode([
                'success' => false,
                'message' => 'Not found',
                'error' => $e->getMessage()
            ]);
        }
    }

    // Function to create a new review
    public function createReview($reviewData)
    {
        // Set the doctor and user IDs if not present in the body
        $doctorId = $reviewData['doctor_id'] ?? null;
        $userId = $reviewData['user_id'] ?? null;

        // If doctor or user ID is missing, handle them here (assumes route parameters)
        if (!$doctorId || !$userId) {
            return json_encode([
                'success' => false,
                'message' => 'Doctor ID or User ID is missing'
            ]);
        }

        // Set new review data
        $newReview = [
            'doctor_id' => $doctorId,
            'user_id' => $userId,
            'comment' => $reviewData['comment'],
            'rating' => $reviewData['rating']
        ];

        // Prepare and execute query to save the new review
        try {
            $query = "INSERT INTO reviews (doctor_id, user_id, comment, rating) VALUES (:doctor_id, :user_id, :comment, :rating)";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':doctor_id', $newReview['doctor_id']);
            $stmt->bindParam(':user_id', $newReview['user_id']);
            $stmt->bindParam(':comment', $newReview['comment']);
            $stmt->bindParam(':rating', $newReview['rating']);

            // Save the new review
            if ($stmt->execute()) {
                // Fetch the inserted review ID
                $newReviewId = $this->conn->lastInsertId();

                // Associate the review with the doctor
                $this->updateDoctorReviews($doctorId, $newReviewId);

                return json_encode([
                    'success' => true,
                    'message' => 'Review submitted',
                    'data' => $newReview
                ]);
            }
        } catch (PDOException $e) {
            return json_encode([
                'success' => false,
                'message' => 'Failed to create review',
                'error' => $e->getMessage()
            ]);
        }
    }

    // Function to update doctor's reviews
    private function updateDoctorReviews($doctorId, $reviewId)
    {
        try {
            // Add the review ID to the doctor's reviews array
            $query = "UPDATE doctors SET reviews = JSON_ARRAY_APPEND(reviews, '$', :reviewId) WHERE id = :doctorId";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':reviewId', $reviewId);
            $stmt->bindParam(':doctorId', $doctorId);
            $stmt->execute();
        } catch (PDOException $e) {
            // Handle error if updating doctor fails
            echo json_encode([
                'success' => false,
                'message' => 'Failed to update doctor reviews',
                'error' => $e->getMessage()
            ]);
        }
    }
}
