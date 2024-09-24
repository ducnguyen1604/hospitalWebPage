<?php
class AuthController
{
    public function register($userData)
    {
        // Extract data from $userData array
        $email = $userData['email'];
        $password = $userData['password'];
        $name = $userData['name'];
        $role = $userData['role'];
        $photo = $userData['photo'];
        $gender = $userData['gender'];

        // Get the database connection
        $database = new Database();
        $db = $database->connect();

        try {
            // Check if user already exists in either table (User for patients or Doctor for doctors)
            if ($role == 'patient') {
                $query = "SELECT * FROM users WHERE email = :email";
            } elseif ($role == 'doctor') {
                $query = "SELECT * FROM doctors WHERE email = :email";
            }

            // Prepare and execute the query
            $stmt = $db->prepare($query);
            $stmt->bindParam(':email', $email);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            // Check if user exists
            if ($user) {
                return json_encode(['status' => 400, 'message' => 'User already exists']);
            }

            // Hash password
            $hashPassword = password_hash($password, PASSWORD_BCRYPT);

            // Insert the new user into the appropriate table
            if ($role == 'patient') {
                $insertQuery = "INSERT INTO users (email, password, name, role, photo, gender) VALUES (:email, :password, :name, :role, :photo, :gender)";
            } elseif ($role == 'doctor') {
                $insertQuery = "INSERT INTO doctors (email, password, name, role, photo, gender) VALUES (:email, :password, :name, :role, :photo, :gender)";
            }

            // Prepare and execute the insert query
            $insertStmt = $db->prepare($insertQuery);
            $insertStmt->bindParam(':email', $email);
            $insertStmt->bindParam(':password', $hashPassword);
            $insertStmt->bindParam(':name', $name);
            $insertStmt->bindParam(':role', $role);
            $insertStmt->bindParam(':photo', $photo);
            $insertStmt->bindParam(':gender', $gender);

            if ($insertStmt->execute()) {
                return json_encode(['status' => 200, 'message' => 'User successfully created']);
            } else {
                return json_encode(['status' => 500, 'message' => 'Failed to create user']);
            }
        } catch (PDOException $e) {
            // Return a server error if any exception occurs
            return json_encode(['status' => 500, 'message' => 'Internal server error: ' . $e->getMessage()]);
        }
    }

    public function login($credentials)
    {
        // Handle login logic here (similar to registration)
    }
}
