-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 04, 2024 at 08:12 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `doctor_booking`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `ticket_price` varchar(100) NOT NULL,
  `appointment_date` datetime DEFAULT NULL,
  `status` enum('pending','approved','cancelled') DEFAULT 'pending',
  `is_paid` tinyint(4) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `doctor_id`, `user_id`, `ticket_price`, `appointment_date`, `status`, `is_paid`, `created_at`, `updated_at`, `start_time`, `end_time`) VALUES
(1, 1, 1, '50.00', '2024-11-02 10:30:00', 'pending', 1, '2024-11-04 05:27:37', '2024-11-04 05:27:37', '10:30:00', '11:00:00'),
(2, 2, 3, '150.00', '2024-11-04 00:00:00', 'pending', 0, '2024-11-04 06:05:41', '2024-11-04 07:05:41', '16:05:00', '17:05:00'),
(4, 2, 2, '150.00', '2024-11-05 00:00:00', 'approved', 1, '2024-11-04 06:22:14', '2024-11-04 06:24:36', '14:22:00', '15:22:00'),
(5, 3, 3, '150.00', '2024-11-04 00:00:00', 'approved', 1, '2024-11-04 06:57:10', '2024-11-04 07:00:56', '14:57:00', '15:58:00');

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `id` int(11) UNSIGNED NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `role` enum('patient','doctor') DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `blood_type` varchar(3) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT NULL,
  `isApproved` enum('pending','approved','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `bio` text DEFAULT NULL,
  `ticket_price` int(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`id`, `email`, `password`, `name`, `specialization`, `phone`, `photo`, `role`, `gender`, `blood_type`, `is_available`, `isApproved`, `created_at`, `updated_at`, `bio`, `ticket_price`) VALUES
(1, 'doctor@example.com', 'securepassword123', 'Dr. John Doe', 'Cardiologist', '123-456-7890', 'https://www.scripps.org/sparkle-assets/variants/hi_res_primary_care_physician_1200x750-163ed71c4c87820817101e72ab78901d_desktop_x++-1200x1200.jpg', 'doctor', 'male', 'O+', 1, 'approved', '2024-11-04 05:26:49', '2024-11-04 05:59:37', 'Experienced cardiologist with over 10 years of practice.', 100),
(2, 'duc016@e.ntu.edu.sg', '$2y$10$8a5BqUirhZiHx1rfKCF/AuiWwazbDyqCOsNk9XKVIDSRqIzjGKrdC', 'Jerry Ng', 'Dentist', '123456', 'http://res.cloudinary.com/doctorbookingweb/image/upload/v1730699711/zp6rhg9kr60sbo91m2vb.jpg', 'doctor', 'male', NULL, NULL, 'approved', '2024-11-04 05:51:55', '2024-11-04 06:06:20', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum', 150),
(3, 'xiao@gmail.com', '$2y$10$O6oNeiBimQ5KNlbYXaMFteNlKazXT8zpaUTB.y10hViP5nX/nHN1O', 'Xiao', 'Cough', '1234', 'http://res.cloudinary.com/doctorbookingweb/image/upload/v1730703303/kghxuiogwd9pffrmsxtu.jpg', 'doctor', 'female', NULL, NULL, 'approved', '2024-11-04 06:55:06', '2024-11-04 06:56:15', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) UNSIGNED NOT NULL,
  `doctor_id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `reviewText` text NOT NULL,
  `rating` decimal(2,1) DEFAULT 0.0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `doctor_id`, `user_id`, `reviewText`, `rating`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Dr. Doe provided excellent care and was very attentive.', '4.0', '2024-11-04 05:27:54', '2024-11-04 05:27:54'),
(2, 2, 2, 'very handsome', '3.0', '2024-11-04 06:18:29', '2024-11-04 06:18:29'),
(3, 2, 2, 'quite good', '2.0', '2024-11-04 06:18:50', '2024-11-04 06:18:50'),
(4, 1, 2, 'cute phomaique', '2.0', '2024-11-04 06:19:11', '2024-11-04 06:19:11'),
(5, 2, 3, 'very good', '5.0', '2024-11-04 07:02:05', '2024-11-04 07:02:05');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) UNSIGNED NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `blood_type` varchar(3) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('patient','doctor','admin') DEFAULT 'patient'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `name`, `gender`, `photo`, `blood_type`, `password`, `role`) VALUES
(1, 'user@example.com', 'Jane Smith', 'female', 'user_photo.jpg', 'A+', 'securepassword123', 'patient'),
(2, 'demo@email.com', 'demouser', 'female', 'http://res.cloudinary.com/doctorbookingweb/image/upload/v1730701536/teihvrfejgilh3arptu9.jpg', 'L', '$2y$10$y9Zl57Pq6mQtWyDjy1NHiu0pTd8WmuO7ZLsGHlPHc9C/5ModnNNza', 'patient'),
(3, 'ducnguyen16042593@gmail.com', 'Duc Nguyen', 'male', 'http://res.cloudinary.com/doctorbookingweb/image/upload/v1730703528/i8mtrtsn9ldfsqq3cccd.jpg', 'F', '$2y$10$J/.a0pISiMkh4pX46j2TnOQ6ehQN2s1iFOGN5rpyiPj2PT9J1n4Uq', 'patient');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
