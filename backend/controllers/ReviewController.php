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
    // Function to create a new review
    public function createReview($reviewData, $doctorId, $userId)
    {
        // Validate required fields
        if (empty($doctorId) || empty($userId) || empty($reviewData['reviewText']) || empty($reviewData['rating'])) {


            return json_encode(['success' => false, 'message' => 'Doctor ID, User ID, comment, or rating is missing']);
        }

        // Set new review data
        $newReview = [
            'doctor_id' => $doctorId,
            'user_id' => $userId,
            'reviewText' => $reviewData['reviewText'],
            'rating' => $reviewData['rating']
        ];

        // Prepare and execute query to save the new review
        try {
            $query = "INSERT INTO reviews (doctor_id, user_id, reviewText, rating) VALUES (:doctor_id, :user_id, :reviewText, :rating)";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':doctor_id', $doctorId);
            $stmt->bindParam(':user_id', $userId);
            $stmt->bindParam(':reviewText', $newReview['reviewText']);
            $stmt->bindParam(':rating', $newReview['rating']);

            // Save the new review
            if ($stmt->execute()) {
                // Fetch the inserted review ID
                $newReviewId = $this->conn->lastInsertId();

                // Associate the review with the doctor (if needed)
                // $this->updateDoctorReviews($doctorId, $newReviewId);

                return json_encode([
                    'success' => true,
                    'message' => 'Review submitted',
                    'data' => $newReview
                ]);
            } else {
                return json_encode([
                    'success' => false,
                    'message' => 'Failed to create review'
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
