<?php
class User
{
    private $conn;
    private $table = 'users';

    public $id;
    public $email;
    public $password;
    public $name;
    public $phone;
    public $photo;
    public $role;
    public $gender;
    public $blood_type;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Create User
    public function create()
    {
        $query = 'INSERT INTO ' . $this->table . ' SET email = :email, password = :password, name = :name, phone = :phone, photo = :photo, role = :role, gender = :gender, blood_type = :blood_type';

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':password', password_hash($this->password, PASSWORD_BCRYPT));
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->bindParam(':photo', $this->photo);
        $stmt->bindParam(':role', $this->role);
        $stmt->bindParam(':gender', $this->gender);
        $stmt->bindParam(':blood_type', $this->blood_type);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);
        return false;
    }
}
