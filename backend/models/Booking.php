<?php
class Booking
{
    private $conn;
    private $table_name = "bookings";

    // Properties (booking and user properties)
    public $id;
    public $doctor_id;
    public $user_id;
    public $ticket_price;
    public $appointment_date;
    public $start_time;
    public $end_time;
    public $status;
    public $is_paid;
    public $created_at;
    public $updated_at;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Insert new booking
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . " 
            (doctor_id, user_id, ticket_price, appointment_date, start_time, end_time, status, is_paid)
            VALUES
            (:doctor_id, :user_id, :ticket_price, :appointment_date, :start_time, :end_time, :status, :is_paid)";

        $stmt = $this->conn->prepare($query);

        // Sanitize inputs
        $this->doctor_id = htmlspecialchars(strip_tags($this->doctor_id));
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        $this->ticket_price = htmlspecialchars(strip_tags($this->ticket_price));
        $this->appointment_date = htmlspecialchars(strip_tags($this->appointment_date));
        $this->start_time = htmlspecialchars(strip_tags($this->start_time));
        $this->end_time = htmlspecialchars(strip_tags($this->end_time));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->is_paid = htmlspecialchars(strip_tags($this->is_paid));

        // Bind values
        $stmt->bindParam(':doctor_id', $this->doctor_id);
        $stmt->bindParam(':user_id', $this->user_id);
        $stmt->bindParam(':ticket_price', $this->ticket_price);
        $stmt->bindParam(':appointment_date', $this->appointment_date);
        $stmt->bindParam(':start_time', $this->start_time);
        $stmt->bindParam(':end_time', $this->end_time);
        $stmt->bindParam(':status', $this->status);
        $stmt->bindParam(':is_paid', $this->is_paid);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Method to get bookings by user ID, including user information
    public function getBookingsByUserId($userId)
    {
        try {
            // SQL query to join bookings with users to get user information
            $query = "
                SELECT 
                    bookings.*, 
                    users.name AS user_name, 
                    users.email AS user_email, 
                    users.gender AS user_gender
                FROM " . $this->table_name . " 
                JOIN users ON bookings.user_id = users.id
                WHERE bookings.user_id = :user_id";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();

            $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $bookings;
        } catch (PDOException $e) {
            // Log error or handle exception
            return [];
        }
    }

    // Additional method to get bookings by doctor ID (if needed)
    public function getBookingsByDoctorId($doctorId)
    {
        try {
            // SQL query to join bookings with users to get user information
            $query = "
                SELECT 
                    bookings.*, 
                    users.name AS user_name, 
                    users.email AS user_email, 
                    users.gender AS user_gender
                FROM " . $this->table_name . " 
                JOIN users ON bookings.user_id = users.id
                WHERE bookings.doctor_id = :doctor_id";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':doctor_id', $doctorId);
            $stmt->execute();

            $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $bookings;
        } catch (PDOException $e) {
            // Log error or handle exception
            return [];
        }
    }
}
