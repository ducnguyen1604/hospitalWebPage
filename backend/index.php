<?php
//import
require_once 'config/Database.php';
require_once 'routes/auth.php';

//Check port running
echo 'Server is running on port: ' . $_SERVER['SERVER_PORT'];
echo '; ';


//CHECK DB CONNECTION
// Instantiate the Database class and connect
$database = new Database();
$db = $database->connect();

if ($db) {
    echo 'Database connection successful';
} else {
    echo 'Database connection failed';
}
