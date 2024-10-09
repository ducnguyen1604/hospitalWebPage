<?php
class Doctor
{
    private $conn;
    private $table = 'doctors';

    public $id;
    public $name;
    public $specialization;
    public $phone;
    public $photo;
    public $gender;
    public $blood_type;
    public $bio;
    public $is_available;
    public $isApproved;
    public $ticket_price;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Create Doctor
    public function create()
    {
        $query = 'INSERT INTO ' . $this->table . ' 
                  SET name = :name, specialization = :specialization, phone = :phone, photo = :photo, gender = :gender, blood_type = :blood_type, is_available = :is_available,isApproved = :isApproved,';

        $stmt = $this->conn->prepare($query);

        // Bind parameters
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':specialization', $this->specialization);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->bindParam(':photo', $this->photo);
        $stmt->bindParam(':gender', $this->gender);
        $stmt->bindParam(':blood_type', $this->blood_type);
        $stmt->bindParam(':bio', $this->bio);
        $stmt->bindParam(':is_available', $this->is_available, PDO::PARAM_BOOL);
        $stmt->bindParam(':isApproved', $this->isApproved);
        $stmt->bindParam(':ticket_price', $this->isApproved);

        // Execute query
        if ($stmt->execute()) {
            return true;
        }

        // Print error if something goes wrong
        printf("Error: %s.\n", $stmt->error);
        return false;
    }
}
