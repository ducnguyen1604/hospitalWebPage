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
            $successMessages = [];
            $failedMessages = [];

            // Loop through each time slot and insert it
            foreach ($timeSlots as $slot) {
                $userId = !empty($slot['user_id']) ? $slot['user_id'] : 0;  // Use default value 0 if user_id is null
                
                // Bind parameters
                $stmt->bindParam(':doctor_id', $doctorId);
                $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);  // Always pass an integer, even if 0
                $stmt->bindParam(':ticket_price', $slot['ticket_price']);
                $stmt->bindParam(':appointment_date', $slot['date']);
                $stmt->bindParam(':start_time', $slot['startingTime']);
                $stmt->bindParam(':end_time', $slot['endingTime']);
                $stmt->bindValue(':status', 'pending');
                $stmt->bindValue(':is_paid', 0);
                
                // Execute the query for each time slot
                if ($stmt->execute()) {
                    $successMessages[] = "Time slot for " . $slot['date'] . " successfully added.";
                } else {
                    $failedMessages[] = "Failed to add time slot for " . $slot['date'] . ".";
                }
            }


            // Return success and failure messages as JSON
            echo json_encode([
                'success' => true,
                'message' => 'All time slots have been processed.',
                'added' => $successMessages,
                'failed' => $failedMessages
            ]);
        } catch (PDOException $e) {
            echo json_encode([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ]);
        }
    }

    // Function to fetch all bookings by doctor ID with user info
    public function getBookingsWithUserInfo($doctorId)
{
    try {
        // Use LEFT JOIN to include bookings with user_id = 0 or without matching users
        $query = "
        SELECT 
            bookings.*, 
            users.name AS user_name, 
            users.email AS user_email, 
            users.gender AS user_gender
        FROM bookings
        LEFT JOIN users ON bookings.user_id = users.id
        WHERE bookings.doctor_id = :doctor_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':doctor_id', $doctorId, PDO::PARAM_INT);
        $stmt->execute();

        $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Return the result as JSON
        echo json_encode([
            'success' => true,
            'data' => $bookings
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ]);
    }
}


    // New function to update booking details
    public function updateBooking($id)
    {
        $data = json_decode(file_get_contents('php://input'), true);
    
        // Log the received data
        error_log('Received data: ' . json_encode($data));
    
        if (
            !isset($data['appointment_date']) || 
            !isset($data['ticket_price']) || 
            !isset($data['start_time']) || 
            !isset($data['end_time'])
        ) {
            echo json_encode([
                'success' => false,
                'message' => 'Missing required fields.'
            ]);
            return;
        }
    
        try {
            $query = "UPDATE bookings SET 
                        user_id = :user_id,
                        appointment_date = :appointment_date, 
                        ticket_price = :ticket_price, 
                        start_time = :start_time, 
                        end_time = :end_time 
                      WHERE id = :id";
    
            $stmt = $this->conn->prepare($query);
    
            // Log to verify data types and values
            error_log('User ID: ' . var_export($data['user_id'], true));
    
            if (array_key_exists('user_id', $data) && $data['user_id'] === null) {
                $stmt->bindValue(':user_id', null, PDO::PARAM_NULL);
            } else {
                $stmt->bindValue(':user_id', $data['user_id'], PDO::PARAM_INT);
            }
    
            $stmt->bindParam(':appointment_date', $data['appointment_date']);
            $stmt->bindParam(':ticket_price', $data['ticket_price']);
            $stmt->bindParam(':start_time', $data['start_time']);
            $stmt->bindParam(':end_time', $data['end_time']);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Booking updated successfully.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to update booking.']);
            }
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
        }
    }
    



}
