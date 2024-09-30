<?php

//Em dung chatgpt cho cnay ma k xem vid
class Booking
{
    private $conn;

    // Constructor
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Method to get bookings by user ID
    public function getBookingsByUserId($userId)
    {
        try {
            $query = "SELECT * FROM bookings WHERE user_id = :user_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();

            $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $bookings;
        } catch (PDOException $e) {
            // Handle exception or return an empty array
            return [];
        }
    }
}
