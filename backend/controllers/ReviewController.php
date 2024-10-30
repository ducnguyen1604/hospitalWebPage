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

    // Function to get reviews by doctor ID
    public function getReviewsByDoctorId($doctorId)
    {
        try {
            // Validate the doctor ID
            if (empty($doctorId)) {
                return json_encode([
                    'success' => false,
                    'message' => 'Doctor ID is required'
                ]);
            }

            // Query to fetch reviews by doctor ID
            $query = "SELECT * FROM reviews WHERE doctor_id = :doctor_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':doctor_id', $doctorId, PDO::PARAM_INT);
            $stmt->execute();

            $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (empty($reviews)) {
                return json_encode([
                    'success' => false,
                    'message' => 'No reviews found for this doctor'
                ]);
            }

            return json_encode([
                'success' => true,
                'message' => 'Reviews retrieved successfully',
                'data' => $reviews
            ]);
        } catch (PDOException $e) {
            return json_encode([
                'success' => false,
                'message' => 'Failed to retrieve reviews',
                'error' => $e->getMessage()
            ]);
        }
    }

    // Function to create a new review
    public function createReview($reviewData, $doctorId, $userId)
    {
        // Validate required fields
        if (empty($doctorId) || empty($userId) || empty($reviewData['reviewText']) || empty($reviewData['rating'])) {
            return json_encode(['success' => false, 'message' => 'Doctor ID, User ID, review text, or rating is missing']);
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
                $newReviewId = $this->conn->lastInsertId();

                return json_encode([
                    'success' => true,
                    'message' => 'Review submitted successfully',
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

    // Optional: Function to update doctor's reviews (if needed)
    private function updateDoctorReviews($doctorId, $reviewId)
    {
        try {
            $query = "UPDATE doctors SET reviews = JSON_ARRAY_APPEND(reviews, '$', :reviewId) WHERE id = :doctorId";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':reviewId', $reviewId);
            $stmt->bindParam(':doctorId', $doctorId);
            $stmt->execute();
        } catch (PDOException $e) {
            echo json_encode([
                'success' => false,
                'message' => 'Failed to update doctor reviews',
                'error' => $e->getMessage()
            ]);
        }
    }
}
