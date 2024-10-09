<?php
require_once __DIR__ . '../../models/Doctor.php';
require_once __DIR__ . '../../models/Review.php';
require_once __DIR__ . '../../models/Booking.php';
require_once __DIR__ . '../../config/Database.php';

class BookingController
{
    private $conn;

    public function __construct()
    {
        $database = new Database();
        $this->conn = $database->connect();
    }

    public function postTimeSlots($doctorId)
    {
        // Assuming timeSlots come from an HTTP POST request
        $timeSlots = json_decode(file_get_contents('php://input'), true);

        // Check if timeSlots are provided
        if (empty($timeSlots)) {
            echo json_encode([
                'success' => false,
                'message' => 'No time slots provided.'
            ]);
            return;
        }

        try {
            // Prepare the SQL query for inserting time slots
            $query = "INSERT INTO bookings (doctor_id, user_id, ticket_price, appointment_date, start_time, end_time, status, is_paid) 
                  VALUES (:doctor_id, :user_id, :ticket_price, :appointment_date, :start_time, :end_time, :status, :is_paid)";

            $stmt = $this->conn->prepare($query);

            // Loop through each time slot and insert it
            foreach ($timeSlots as $slot) {
                // Bind parameters
                $stmt->bindParam(':doctor_id', $doctorId);
                $stmt->bindValue(':user_id', null, PDO::PARAM_NULL); // Since user_id is null
                $stmt->bindValue(':ticket_price', 0);
                $stmt->bindParam(':appointment_date', $slot['date']);
                $stmt->bindParam(':start_time', $slot['startingTime']);
                $stmt->bindParam(':end_time', $slot['endingTime']);
                $stmt->bindValue(':status', 'pending');
                $stmt->bindValue(':is_paid', 0);

                // Execute the query for each time slot
                if ($stmt->execute()) {
                    echo "Time slot for " . $slot['date'] . " successfully added.\n";
                } else {
                    echo "Failed to add time slot for " . $slot['date'] . ".\n";
                }
            }

            echo json_encode([
                'success' => true,
                'message' => 'All time slots have been successfully added.'
            ]);
        } catch (PDOException $e) {
            echo json_encode([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ]);
        }
    }
}
