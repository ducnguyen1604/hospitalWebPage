<?php
class Review
{
    private $conn;
    private $table = 'reviews';

    public $id;
    public $doctor_id;
    public $user_id;
    public $reviewText;
    public $rating;
    public $created_at;
    public $updated_at;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Create Review
    public function create()
    {
        $query = 'INSERT INTO ' . $this->table . ' 
                  SET doctor_id = :doctor_id, user_id = :user_id, reviewText = :reviewText, rating = :rating, created_at = :created_at, updated_at = :updated_at';

        $stmt = $this->conn->prepare($query);

        // Bind parameters
        $stmt->bindParam(':doctor_id', $this->doctor_id);
        $stmt->bindParam(':user_id', $this->user_id);
        $stmt->bindParam(':reviewText', $this->reviewText);
        $stmt->bindParam(':rating', $this->rating);
        $stmt->bindParam(':created_at', $this->created_at);
        $stmt->bindParam(':updated_at', $this->updated_at);

        // Execute query
        if ($stmt->execute()) {
            return true;
        }

        // Print error if something goes wrong
        printf("Error: %s.\n", $stmt->error);
        return false;
    }

    // Read Reviews for a doctor
    public function readReviewsForDoctor($doctor_id)
    {
        $query = 'SELECT * FROM ' . $this->table . ' WHERE doctor_id = :doctor_id';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':doctor_id', $doctor_id);

        $stmt->execute();
        return $stmt;
    }

    public function readReviewsForDoctorWithUser($doctor_id)
    {
        // Query to join reviews with users to get user details
        $query = 'SELECT 
                r.id as review_id, 
                r.reviewText, 
                r.rating, 
                r.created_at, 
                u.id as user_id, 
                u.name as user_name, 
                u.photo as user_photo 
              FROM ' . $this->table . ' r
              JOIN users u ON r.user_id = u.id
              WHERE r.doctor_id = :doctor_id';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':doctor_id', $doctor_id);

        $stmt->execute();
        return $stmt;
    }
}
