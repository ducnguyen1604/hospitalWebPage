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
        $timeSlots = json_decode(file_get_contents('php://input'), true);

        if (empty($timeSlots)) {
            echo json_encode([
                'success' => false,
                'message' => 'No time slots provided.'
            ]);
            return;
        }

        try {
            $checkOverlapQuery = "
                SELECT COUNT(*) AS overlap_count 
                FROM bookings 
                WHERE doctor_id = :doctor_id 
                  AND appointment_date = :appointment_date 
                  AND (
                      (start_time < :end_time AND end_time > :start_time)
                  )";

            $stmtCheck = $this->conn->prepare($checkOverlapQuery);
            $query = "INSERT INTO bookings (doctor_id, user_id, ticket_price, appointment_date, start_time, end_time, status, is_paid) 
                      VALUES (:doctor_id, :user_id, :ticket_price, :appointment_date, :start_time, :end_time, :status, :is_paid)";
            $stmtInsert = $this->conn->prepare($query);

            $successMessages = [];
            $failedMessages = [];
            $conflictMessages = [];

            foreach ($timeSlots as $slot) {
                $userId = !empty($slot['user_id']) ? $slot['user_id'] : 0;

                $stmtCheck->bindParam(':doctor_id', $doctorId, PDO::PARAM_INT);
                $stmtCheck->bindParam(':appointment_date', $slot['date']);
                $stmtCheck->bindParam(':start_time', $slot['startingTime']);
                $stmtCheck->bindParam(':end_time', $slot['endingTime']);
                $stmtCheck->execute();
                $overlap = $stmtCheck->fetch(PDO::FETCH_ASSOC)['overlap_count'];

                if ($overlap > 0) {
                    $conflictMessages[] = "Conflict for " . $slot['date'] . " from " . $slot['startingTime'] . " to " . $slot['endingTime'] . ".";
                    continue;
                }

                $stmtInsert->bindParam(':doctor_id', $doctorId, PDO::PARAM_INT);
                $stmtInsert->bindParam(':user_id', $userId, PDO::PARAM_INT);
                $stmtInsert->bindParam(':ticket_price', $slot['ticket_price']);
                $stmtInsert->bindParam(':appointment_date', $slot['date']);
                $stmtInsert->bindParam(':start_time', $slot['startingTime']);
                $stmtInsert->bindParam(':end_time', $slot['endingTime']);
                $stmtInsert->bindValue(':status', 'pending');
                $stmtInsert->bindValue(':is_paid', 0);

                if ($stmtInsert->execute()) {
                    $successMessages[] = "Time slot for " . $slot['date'] . " successfully added.";
                } else {
                    $failedMessages[] = "Failed to add time slot for " . $slot['date'] . ".";
                }
            }

            echo json_encode([
                'success' => empty($conflictMessages), // success is false if there are conflicts
                'message' => 'All time slots have been processed.',
                'added' => $successMessages,
                'failed' => $failedMessages,
                'conflicts' => $conflictMessages // Include conflict messages
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
    // public function updateBooking($id)
    // {
    //     $data = json_decode(file_get_contents('php://input'), true);
    //     error_log('Received data: ' . json_encode($data));
    //     error_log('Received PUT request for booking ID: ' . $id);

    //     if (
    //         !isset($data['appointment_date']) ||
    //         !isset($data['ticket_price']) ||
    //         !isset($data['start_time']) ||
    //         !isset($data['end_time'])
    //     ) {
    //         echo json_encode([
    //             'success' => false,
    //             'message' => 'Missing required fields.'
    //         ]);
    //         return;
    //     }
    //     //echo json_encode(['debug' => 'Received data', 'data' => $data]);

    //     try {
    //         $query = "UPDATE bookings SET 
    //         user_id = :user_id,
    //         appointment_date = :appointment_date, 
    //         ticket_price = :ticket_price, 
    //         start_time = :start_time, 
    //         end_time = :end_time, 
    //         status = :status, 
    //         is_paid = :is_paid 
    //       WHERE id = :id";

    //         $stmt = $this->conn->prepare($query);

    //         // Log to verify data types and values
    //         error_log('User ID: ' . var_export($data['user_id'], true));

    //         if (array_key_exists('user_id', $data) && $data['user_id'] === null) {
    //             $stmt->bindValue(':user_id', null, PDO::PARAM_NULL);
    //         } else {
    //             $stmt->bindValue(':user_id', $data['user_id'], PDO::PARAM_INT);
    //         }

    //         $stmt->bindValue(':appointment_date', $data['appointment_date']);
    //         $stmt->bindValue(':ticket_price', $data['ticket_price'], PDO::PARAM_STR);
    //         $stmt->bindValue(':start_time', $data['start_time']);
    //         $stmt->bindValue(':end_time', $data['end_time']);
    //         $stmt->bindValue(':status', $data['status'], PDO::PARAM_STR);
    //         $stmt->bindValue(':is_paid', (int) $data['is_paid'], PDO::PARAM_INT);
    //         $stmt->bindValue(':id', (int) $id, PDO::PARAM_INT);

    //         if ($stmt->execute()) {
    //             echo json_encode(['success' => true, 'message' => 'Booking updated successfully.']);
    //         } else {
    //             echo json_encode(['success' => false, 'message' => 'Failed to update booking.']);
    //         }
    //     } catch (PDOException $e) {
    //         echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    //     }
    // }
    public function updateBooking($id)
    {
        $data = json_decode(file_get_contents('php://input'), true);

        // Log the received data for debugging
        error_log('Received data: ' . json_encode($data));
        error_log('Received PUT request for booking ID: ' . $id);

        if (
            !isset($data['appointment_date']) ||
            !isset($data['ticket_price']) ||
            !isset($data['start_time']) ||
            !isset($data['end_time']) ||
            !isset($data['is_paid']) ||
            !isset($data['status'])
        ) {
            echo json_encode([
                'success' => false,
                'message' => 'Missing required fields.'
            ]);
            return;
        }

        try {
            // Prepare the SQL query to update booking, including is_paid and status
            $query = "UPDATE bookings SET 
                        user_id = :user_id,
                        appointment_date = :appointment_date, 
                        ticket_price = :ticket_price, 
                        start_time = :start_time, 
                        end_time = :end_time, 
                        is_paid = :is_paid, 
                        status = :status 
                      WHERE id = :id";

            $stmt = $this->conn->prepare($query);

            // Bind parameters for the query
            if (array_key_exists('user_id', $data) && $data['user_id'] === null) {
                $stmt->bindValue(':user_id', null, PDO::PARAM_NULL);
            } else {
                $stmt->bindValue(':user_id', $data['user_id'], PDO::PARAM_INT);
            }

            $stmt->bindValue(':appointment_date', $data['appointment_date']);
            $stmt->bindValue(':ticket_price', $data['ticket_price'], PDO::PARAM_STR);
            $stmt->bindValue(':start_time', $data['start_time']);
            $stmt->bindValue(':end_time', $data['end_time']);
            $stmt->bindValue(':is_paid', (int)$data['is_paid'], PDO::PARAM_INT);
            $stmt->bindValue(':status', $data['status'], PDO::PARAM_STR);
            $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);

            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Booking updated successfully.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to update booking.']);
            }
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
        }
    }



    public function deleteBooking($id)
    {
        try {
            // Prepare the SQL query to delete the booking by ID
            $query = "DELETE FROM bookings WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);

            if ($stmt->execute()) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Booking deleted successfully.'
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to delete booking.'
                ]);
            }
        } catch (PDOException $e) {
            echo json_encode([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ]);
        }
    }
}
