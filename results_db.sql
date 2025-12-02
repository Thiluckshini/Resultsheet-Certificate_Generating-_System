-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 01, 2025 at 10:22 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `results_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `certificates`
--

CREATE TABLE `certificates` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `issue_date` date NOT NULL,
  `expiry_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `course_code` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `institute` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `duration` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `name`, `course_code`, `description`, `institute`, `department`, `duration`) VALUES
(13, 'Computer Science', 'CS/00', 'Concepts of programming and software engineering studies.', 'Edu Lanka Institute', 'Computer Science', '3 Years'),
(14, 'Management', 'M/00', 'Management studies', 'Edu Lanka Institute', 'Management', '2.5 Years'),
(15, 'Mathematics', 'Math/00', 'Maths and statistics', 'Edu Lanka Institute', 'Mathematics', '3 Years'),
(16, 'Physics', 'P/00', 'Physical studies.', 'Edu Lanka Institute', 'Physics', '4 Years'),
(17, 'Medicine', 'Medi/00', 'Medial studies.', 'Edu Lanka Institute', 'Medicine', '6 Years'),
(18, 'Tourism and Hospitality Management', 'THM/00', 'Tourists and hospitality management studies.', 'Edu Lanka Institute', 'Tourism and Hospitality Management', '2 Years'),
(19, 'Accountancy', 'AC/00', 'Accounting studies.', 'Edu Lanka Institute', 'Accountancy', '3 Years'),
(20, 'English', 'EN/00', 'English language.', 'Edu Lanka Institute', 'English', '2 Years'),
(21, 'Business Administration', 'BA/00', 'Business studies.', 'Edu Lanka Institute', 'Business Administration', '3 Years'),
(22, 'Information Technology', 'IT/00', 'Concepts of programming and software engineering.', 'ABC Academy', 'Information Technology', '3 Years'),
(23, 'Management', 'MAN/00', 'Management studies', 'Git Academy', 'Management', '4 Years'),
(24, 'Information Technology', 'IT/00', 'IT', 'Git Academy', 'Information Technology', '3 Years'),
(25, 'Auto Electrical', 'AE/00', 'Electrical studies.', 'ABC Academy', 'Auto Electrical', '2 Years'),
(26, 'Civil Engineering', 'CE/00', 'Civil engineering studies.', 'Git Academy', 'Civil Engineering', '3 Years & 6 Months'),
(27, 'Law', 'L/00', 'Law studies...', 'King Academy', 'Law', '4 Years'),
(28, 'Information Technology', 'IT/00', 'Dep IT', 'Advanced Technological Institute - Kandy', 'Information Technology', '3 Years'),
(29, 'Business Studies', 'BA/00', 'ba', 'Advanced Technological Institute - Kandy', 'Business Administration', '4 Years'),
(32, 'Test Department', 'TD/00', 'Testing..', 'Test Institute', 'Test Department', '3 Years'),
(33, 'Computer Hardware', 'CH/00', 'Computer..', 'AI World', 'Computer Hardware', '2 Years'),
(34, 'Law', 'L/00', 'Law', 'Edu Lanka Institute', 'Law', '3 Years'),
(35, 'Statistics', 'S/00', 'Satistics studies', 'Smart Academy', 'Statistics', '1 Year');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `institute` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `description`, `institute`) VALUES
(1, 'Computer Science', 'Department focusing on computing and software engineering stream.', 'Edu Lanka Institute'),
(2, 'Mathematics', 'Department specializing in mathematical sciences and research.', 'Edu Lanka Institute'),
(3, 'Physics', 'Department for physics and related studies.', 'Edu Lanka Institute'),
(4, 'Medicine', 'Department of medical studies.', 'Edu Lanka Institute'),
(5, 'Management', 'Department of management studies.', 'Edu Lanka Institute'),
(6, 'Tourism and Hospitality Management', 'Department of Tourism and Hospitality Management', 'Edu Lanka Institute'),
(7, 'Accountancy', 'Department of Accountancy.', 'Edu Lanka Institute'),
(8, 'English', 'Department of English Language', 'Edu Lanka Institute'),
(9, 'Business Administration', 'Department of Business Administration.', 'Edu Lanka Institute'),
(10, 'Information Technology', 'Concepts of programming and software engineering.', 'ABC Academy'),
(11, 'Management', 'Department of management', 'Git Academy'),
(12, 'Information Technology', 'Department of information tech...', 'Git Academy'),
(13, 'Auto Electrical', 'Electrical studies.', 'ABC Academy'),
(14, 'Civil Engineering', 'Department of civil engineering.', 'Git Academy'),
(15, 'Law', 'Department of law studies.', 'King Academy'),
(16, 'Information Technology', 'DIT', 'Advanced Technological Institute - Kandy'),
(17, 'Management', 'DM', 'Advanced Technological Institute - Kandy'),
(18, 'Accountancy', 'DA', 'Advanced Technological Institute - Kandy'),
(19, 'Business Administration', 'BA', 'Advanced Technological Institute - Kandy'),
(20, 'Tourism and Hospitality Management', 'THM', 'Advanced Technological Institute - Kandy'),
(21, 'English', 'DEng', 'Advanced Technological Institute - Kandy'),
(22, 'Test Department', 'Testing..', 'Test Institute'),
(23, 'Computer Hardware', 'Computer hardware studies...', 'AI World'),
(24, 'Law', 'Law studies.', 'Edu Lanka Institute'),
(25, 'Statistics', 'Satcs...', 'Smart Academy');

-- --------------------------------------------------------

--
-- Table structure for table `institutes`
--

CREATE TABLE `institutes` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `establishedYear` year(4) DEFAULT NULL,
  `logoUrl` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `institutes`
--

INSERT INTO `institutes` (`id`, `name`, `location`, `establishedYear`, `logoUrl`) VALUES
(9, 'Edu Lanka Institute', 'Galle', '1990', 'uploads\\1744782847335-phone-call.png'),
(10, 'ABC Academy', 'Jaffna', '2000', 'uploads\\1744783185595-email.png'),
(11, 'Git Academy', 'Colombo', '2022', 'uploads\\1744783430667-github.png'),
(13, 'IN Institute', 'Matale', '2009', 'uploads\\1744805375345-linkedin.png'),
(15, 'Sha Institute', 'Kandy', '2025', 'uploads\\1745143422393-prof.jpg'),
(19, 'EC Institute', 'Puttalam', '2018', 'uploads\\1747193514975-Capture.PNG'),
(20, 'SriLanka Educational Institute', 'Negombo', '2025', 'uploads\\1748146610395-Capture.PNG'),
(21, 'King Academy', 'Kurunegala', '2020', 'uploads\\1748332838661-Capture1.PNG'),
(23, 'Students Lanka', 'Nuwara Eliya', '2009', 'uploads\\1748342922681-1.PNG'),
(26, 'Test Institute', 'Kandy', '2019', 'uploads\\1748798135102-Capture.PNG'),
(27, 'AI World', 'Kurunegala', '2025', 'uploads\\1748803164344-Capture1.PNG'),
(28, 'Smart Academy', 'Matare', '2004', 'uploads\\1748807588560-s.PNG');

-- --------------------------------------------------------

--
-- Table structure for table `institute_admins`
--

CREATE TABLE `institute_admins` (
  `id` int(11) NOT NULL,
  `admin_id` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `nic` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contact` varchar(20) NOT NULL,
  `address` varchar(255) NOT NULL,
  `institute` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `institute_admins`
--

INSERT INTO `institute_admins` (`id`, `admin_id`, `name`, `nic`, `email`, `contact`, `address`, `institute`, `created_at`, `updated_at`) VALUES
(1, 'A001', 'John Does', '123456789V', 'john.doe@example.com', '0771234567', '123 Main St, Colombo', 'Edu Lanka Institute', '2025-04-20 10:06:35', '2025-05-27 08:16:14'),
(2, 'A002', 'Jane Smith', '987654321V', 'jane.smith@example.com', '0777654321', '456 High St, Kandy', 'ABC Academy', '2025-04-20 10:06:35', '2025-04-20 10:06:35'),
(3, 'A003', 'Robert Brown', '111223344V', 'robert.brown@example.com', '0771122334', '789 Park Ave, Galle', 'Git Academy', '2025-04-20 10:06:35', '2025-04-20 10:06:35'),
(4, 'A004', 'Emily White', '223344556V', 'emily.white@example.com', '0775566778', '101 Ocean Blvd, Negombo', 'IN Institute', '2025-04-20 10:06:35', '2025-04-20 10:06:35'),
(5, 'A005', 'Michael Green', '334455667V', 'michael.green@example.com', '0779988776', '202 River Rd, Jaffna', 'A1 Institute', '2025-04-20 10:06:35', '2025-04-20 10:06:35'),
(6, 'A006', 'Olivia Black', '445566778V', 'olivia.black@example.com', '0776677889', '303 Hilltop Rd, Anuradhapura', 'Sha Institute', '2025-04-20 10:06:35', '2025-04-20 10:06:35'),
(7, 'A007', 'John Smith', '199923098759', 'john1234@gmail.com', '0761298361', '25/A, Kandy Road, Colombo', 'S Academy', '2025-04-21 16:13:11', '2025-04-21 16:13:11'),
(12, 'A008', 'A.M.N.Amal', '123412347V', 'amal@gmail.com', '0771236549', '34/A, Kurunegala Road, Puttalam', 'EC Institute', '2025-05-14 03:33:24', '2025-05-14 03:33:24'),
(13, 'A009', 'N.M.R.Perera', '199923456817', 'npmrperera@gmail.com', '0771289634', '12/A, Main Road, Negombo', 'SriLanka Educational Institute', '2025-05-25 04:18:52', '2025-05-25 04:19:05'),
(14, 'A010', 'M.N.I.R.Smith', '199867234561', 'smithmnir@gmail.com', '0712365781', '12/A, Main Street, Colombo-12', 'King Academy', '2025-05-28 12:19:43', '2025-05-28 12:19:43'),
(15, 'A011', 'N.M.R.Que', '199987654326', 'que@gmail.com', '0778965437', '23/A, Puttalam', 'L1 Institute', '2025-05-28 16:56:45', '2025-05-28 16:56:45'),
(16, 'A012', 'M.R.Stephan', '198956239816', 'stephan@gmail.com', '0817634876', '27/A, Kandy', 'Students Lanka', '2025-05-28 16:58:11', '2025-05-28 16:58:11'),
(17, 'A013', 'N.R.M.Aberathna', '196578124537', 'aberathna@gmail.com', '0771276548', '32/B, Colombo-10', 'AI Institute', '2025-05-28 16:59:22', '2025-05-28 16:59:22'),
(18, 'A014', 'W.M.T.Shamila', '197656478923', 'silwa123@gmail.com', '0778956432', '12/A, Main Street, Nuwara Eliya', 'Advanced Technological Institute - Kandy', '2025-06-01 16:07:17', '2025-06-01 16:07:49'),
(19, 'A015', 'Test Admin', '123456789V', 'testadmin@gmail.com', '0771234567', '12/A, Kandy', 'Test Institute', '2025-06-01 17:16:39', '2025-06-01 17:16:50'),
(20, 'A0016', 'W.R.T.Thilakarathne', '12345678910', 'thilakarathne@gmail.com', '0771235612', '23/B, Kandy', 'AI World', '2025-06-01 18:41:03', '2025-06-01 18:41:03'),
(21, 'A017', 'Final Test', '123456789V', 'finaltest@gmail.com', '0751234567', '103/A, Kandy', 'Smart Academy', '2025-06-01 19:54:40', '2025-06-01 19:54:56');

-- --------------------------------------------------------

--
-- Table structure for table `lecturers`
--

CREATE TABLE `lecturers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `lecturer_id` varchar(50) NOT NULL,
  `nic` varchar(20) NOT NULL,
  `contact` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `institute` varchar(255) NOT NULL,
  `department` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lecturers`
--

INSERT INTO `lecturers` (`id`, `name`, `email`, `lecturer_id`, `nic`, `contact`, `address`, `institute`, `department`) VALUES
(1, 'Dr. A.M.N. Silva ', 'a.silva@gmail.com', 'ELA/L/001', '987654321V', '0771234567', '123 Main St, Colombo', 'Edu Lanka Institute', 'Computer Science'),
(2, 'Dr. B. Perera', 'b.perera@gmail.com', 'ELA/L/002', '876543210V', '0777654321', '45 Park Rd, Kandy', 'Edu Lanka Institute', 'Mathematics'),
(3, 'Ms. C. Fernando', 'c.fernando@gmail.com', 'ELA/L/003', '765432109V', '0779876543', '78 River St, Galle', 'Edu Lanka Institute', 'Physics'),
(4, 'Prof. M.N.Bandara', 'nbandara@gmail.com', 'ELA/L/004', '123987645V', '0771238764', '23, Galle Road, Colombo', 'Edu Lanka Institute', 'Accountancy'),
(5, 'Dr. M.N.John', 'johnmn@gmail.com', 'ELA/L/005', '987123654V', '0817628765', '21/A, Kandy Road, Colombo', 'Edu Lanka Institute', 'Management'),
(6, 'Prof. C.M.N.K.Kamala', 'kamalak@gmail.com', 'ELA/L/006', '987126534V', '0771238765', '21, Kurunegala Road, Puttalam', 'Edu Lanka Institute', 'Tourism and Hospitality Management'),
(7, 'Prof. John Doe', 'johnsmith123@gmail.com', 'ELA/L/007', '123987645V', '0776514872', '12, Jaffna', 'Edu Lanka Institute', 'English'),
(8, 'Dr. K.Kanthi', 'kanthi@gmail.com', 'ELA/L/008', '897612543V', '0812563478', '12, Galle', 'Edu Lanka Institute', 'Business Administration'),
(9, 'B.M.W.Wijerathna', 'bmw@gmail.com', 'ELA/L/009', '918273645V', '0712689726', '12, Kinniya', 'Edu Lanka Institute', 'Medicine'),
(10, 'Prof. W.M.N.A.Bandara', 'bandara@gmail.com', 'ABCA/L/001', '9987651423V', '0771243567', '123/A, Kandy Road, Colombo', 'ABC Academy', 'Information Technology'),
(11, 'Prof C.M.Y.K.Banadaranayake', 'bandaranayake@gmail.com', 'GA/L/001', '9988776655V', '0778614267', '12/A, Colombo Road, Galle', 'Git Academy', 'Information Technology'),
(12, 'DR. A.S.Anna', 'anna678@gmail.com', 'GA/L/002', '987651234V', '0712345678', '12/C, Kandy Road, Nuwara Eliya', 'Git Academy', 'Management'),
(13, 'Prof. N.M.R.D.Perera', 'perearanma@gmail.com', 'ELA/L/010', '1986762345', '0815628765', '12/A, Main Road, Colombo - 10', 'Edu Lanka Institute', 'Computer Science'),
(14, 'Dr. A.N.M.R.Amal', 'anmramal@gmail.com', 'ABCA/L/002', '1999872367', '0778912367', '123/A, Negombo Road, Colombo', 'ABC Academy', 'Auto Electrical'),
(15, 'Ann', 'ann@gmail.com', 'ELA/L/011', '123456789V', '0817628765', '21, Kurunegala Road, Puttalam', 'Edu Lanka Institute', 'Computer Science'),
(16, 'W.R.Q.Teena', 'teena@gmail.com', 'GA/L/003', '199867134529', '0778914256', '134/A, Hatton', 'Git Academy', 'Civil Engineering'),
(17, 'Prof. N.M.R.Rathnayaka Bandara', 'nmrtathnayake@gmail.com', 'KA/L/001', '196456123987', '0757823564', '123/A, Bandarawala', 'King Academy', 'Law'),
(18, 'M.R.Wijerathna', 'wijerathna123@gmail.com', 'ATI/L/001', '196456237865', '0812346154', '28/A, Kandy', 'Advanced Technological Institute - Kandy', 'Information Technology'),
(19, 'Test Lecturer', 'testlecturer@gmail.com', 'TI/L/001', '123456789V', '0812345678', '11/A, Kandy', 'Test Institute', 'Test Department'),
(20, 'W.R.Nani', 'nane@gmail.com', 'AW/L/001', '123456789V', '0778123456', '12/A, Galle', 'AI World', 'Computer Hardware'),
(21, 'S.R.Ekanayake', 'ekanayake@gmail.com', 'ELA/L/011', '123456789V', '0771234121', '17/B, Nuwara Eliya', 'Edu Lanka Institute', 'Law'),
(23, 'Testing Lecturer', 'testinglecturer@gmail.com', 'SA/L/001', '123456789V', '0812341561', '13/C, Badulla', 'Smart Academy', 'Statistics');

-- --------------------------------------------------------

--
-- Table structure for table `marks`
--

CREATE TABLE `marks` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `marks` float NOT NULL,
  `subject_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `marks`
--

INSERT INTO `marks` (`id`, `student_id`, `marks`, `subject_id`) VALUES
(1, 1, 95, 1),
(2, 1, 76, 2),
(3, 1, 99, 3),
(4, 2, 78, 1),
(5, 2, 78, 2),
(6, 2, 98, 3),
(7, 1, 90, 5),
(22, 2, 89, 5),
(23, 5, 67, 1),
(24, 5, 89, 2),
(25, 5, 90, 3),
(26, 5, 78, 5),
(27, 7, 78, 1),
(28, 7, 91, 2),
(29, 7, 90, 3),
(30, 7, 95, 5),
(31, 8, 65, 1),
(32, 8, 18, 2),
(33, 8, 78, 3),
(34, 8, 45, 5),
(94, 4, 90, 10),
(95, 6, 84, 10),
(118, 9, 45, 1),
(119, 9, 78, 2),
(120, 9, 98, 3),
(121, 9, 89, 5),
(122, 10, 74, 13),
(203, 1, 78, 14),
(208, 2, 90, 14),
(213, 5, 45, 14),
(218, 7, 78, 14),
(223, 8, 87, 14),
(228, 9, 87, 14),
(264, 13, 34, 1),
(265, 13, 76, 2),
(266, 13, 90, 3),
(267, 13, 67, 5),
(268, 13, 90, 14),
(304, 12, 89, 1),
(305, 12, 74, 2),
(306, 12, 56, 3),
(307, 12, 78, 5),
(308, 12, 90, 14),
(315, 14, 50, 13),
(316, 15, 78, 15),
(317, 15, 80, 16),
(318, 15, 98, 17),
(319, 15, 89, 18),
(320, 16, 99, 19),
(321, 17, 30, 20),
(323, 18, 75, 22);

-- --------------------------------------------------------

--
-- Table structure for table `results`
--

CREATE TABLE `results` (
  `student_id` int(11) NOT NULL,
  `student_name` varchar(255) NOT NULL,
  `institute` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `subject_name` varchar(255) NOT NULL,
  `semester` int(11) NOT NULL,
  `marks` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `student_id` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `nic` varchar(20) NOT NULL,
  `department` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `institute` varchar(255) NOT NULL,
  `course` varchar(255) NOT NULL,
  `year` int(11) NOT NULL,
  `status` varchar(20) DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `student_id`, `name`, `nic`, `department`, `email`, `contact_number`, `address`, `institute`, `course`, `year`, `status`) VALUES
(1, 'ELI/CS/2022/0001', 'Alice Johnson', '901234567V', 'computer-science', 'alice.johnson@gmail.com', '0771234569', '123 Main St, City', 'edu-lanka-institute', 'Computer Science', 2022, 'active'),
(2, 'ELI/CS/2022/0002', 'John Smith', '200212456734', 'computer-science', 'johnsmith2022@gmail.com', '0771342875', '23, A/ Kandy Road, Puttalam', 'edu-lanka-institute', 'Computer Science', 2022, 'active'),
(4, 'ABCA/IT/2022/0001', 'M.N.R.I.Bandara', '200123451768', 'information-technology', 'mnribandara@gmail.com', '0779865432', '34/A, Kurunegala Road, Puttalam', 'abc-academy', 'Information Technology', 2022, 'active'),
(5, 'ELI/CS/2022/0003', 'M.R.Aneesha', '200245678123', 'computer-science', 'aneesha123@gmail.com', '0778965423', '12/4, Main Road, Kandy', 'edu-lanka-institute', 'Computer Science', 2022, 'active'),
(6, 'ABCA/IT/2023/0001', 'M.N.R.I.Imesh Ekanayake', '200312345678', 'information-technology', 'imaeshmnri@gmail.com', '0758976543', '76/C, Main Street, Colombo - 10', 'abc-academy', 'Information Technology', 2023, 'active'),
(7, 'ELI/CS/2022/0004', 'M.N.E.R.Bandaranayake', '200245678123', 'computer-science', 'bandaranayake89@gmail.com', '0778965423', '23, A/ Kandy Road, Puttalam', 'edu-lanka-institute', 'Computer Science', 2022, 'active'),
(8, 'ELI/CS/2022/005', 'John', '2001987654', 'computer-science', 'jihn@gmail.com', '0812345667', '12/A, Colombo Road, Galle', 'edu-lanka-institute', 'Computer Science', 2022, 'active'),
(9, 'ELI/CS/2023/0001', 'Q.R.I.Queeni', '200356745124', 'computer-science', 'queeni@gmail.com', '0776512345', '23/AQ, Colombo', 'edu-lanka-institute', 'Computer Science', 2023, 'active'),
(10, 'GA/CE/2019/0001', 'W.R.M.I.Amma', '200078612678', 'civil-engineering', 'amma123@gmail.com', '0756712456', '98/A, Main Street, Kandy', 'git-academy', 'Civil Engineering', 2019, 'active'),
(12, 'ELI/CS/2021/0001', 'A.M.R.Reena', '200098725461', 'computer-science', 'reena123@gmail.com', '0778123409', '23/A, Kandy Road, Gampola', 'edu-lanka-institute', 'Computer Science', 2021, 'active'),
(13, 'ELI/CS/2020/0001', 'N.R.Nila', '199978912341', 'computer-science', 'nila@gmail.com', '0816724598', '12/A, Jaffna', 'edu-lanka-institute', 'Computer Science', 2020, 'active'),
(14, 'GA/CE/2020/0001', 'M.N.E.Y.Smitha Johnson', '2000908761235', 'civil-engineering', 'smithjohn@gmail.com', '0776723489', '12/A, Main Street, Colombo-10', 'git-academy', 'Civil Engineering', 2020, 'active'),
(15, 'KA/L/2020/0001', 'W.Q.R.I.Aishu', '200098761237', 'law', 'aishu@gmail.com', '0778125634', '2/A, Kurunegala Road, Puttalam', 'king-academy', 'Law', 2020, 'active'),
(16, 'TI/TD/2022/0001', 'Test Student', '123456789V', 'test-department', 'teststudent@gmail.com', '0778912345', '22/C, Colombo', 'test-institute', 'Test Department', 2022, 'active'),
(17, 'AI/CH/2019/0001', 'N.M.Dissanayake', '123456789V', 'computer-hardware', 'dissanayake@gmail.com', '0771235467', '12/C, Hatton', 'ai-world', 'Computer Hardware', 2019, 'active'),
(18, 'SA/S/2020/0001', 'Testing Student', '123456789V', 'statistics', 'tesingstudent@gmail.com', '0771298763', '12/4, Main Street, Puttalam', 'smart-academy', 'Statistics', 2020, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(100) NOT NULL,
  `credits` int(11) NOT NULL,
  `department` varchar(255) NOT NULL,
  `course` varchar(255) NOT NULL,
  `semester` int(11) NOT NULL,
  `institute` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `name`, `code`, `credits`, `department`, `course`, `semester`, `institute`, `createdAt`, `updatedAt`) VALUES
(1, 'Software Engineering', 'CS/SE/1001', 4, 'Computer Science', 'Computer Science', 1, 'Edu Lanka Institute', '2025-05-22 09:13:28', '2025-05-22 16:59:03'),
(2, 'Web Programming', 'CS/WP/1002', 4, 'Computer Science', 'Computer Science', 1, 'Edu Lanka Institute', '2025-05-22 09:16:18', '2025-05-22 16:59:03'),
(3, 'Operating System', 'CS/OS/1003', 3, 'Computer Science', 'Computer Science', 1, 'Edu Lanka Institute', '2025-05-22 09:20:30', '2025-05-22 16:59:03'),
(4, 'Statistics ', 'M/S/1001', 3, 'Mathematics', 'Mathematics', 1, 'Edu Lanka Institute', '2025-05-22 11:27:50', '2025-05-22 11:27:50'),
(5, 'Object Oriented Programming', 'CS/OOP/2001', 4, 'Computer Science', 'Computer Science', 2, 'Edu Lanka Institute', '2025-05-22 11:33:38', '2025-05-29 09:13:35'),
(6, 'Basic Newton\'s Law ', 'P/BNL/1001', 3, 'Physics', 'Physics', 1, 'Edu Lanka Institute', '2025-05-24 04:16:39', '2025-05-25 04:30:29'),
(7, 'Software Engineering', 'IT/SE/1001', 3, 'Information Technology', 'Information Technology', 1, 'Git Academy', '2025-05-24 12:42:12', '2025-05-24 12:42:12'),
(8, 'Human Resource', 'MAN/HR/1001', 3, 'Management', 'Management', 1, 'Git Academy', '2025-05-24 12:43:10', '2025-05-24 12:43:10'),
(9, 'Software Development', 'IT/SD/2001', 3, 'Information Technology', 'Information Technology', 2, 'Git Academy', '2025-05-24 12:43:42', '2025-05-24 12:43:42'),
(10, 'Software Development', 'IT/SD/1001', 3, 'Information Technology', 'Information Technology', 1, 'ABC Academy', '2025-05-25 10:41:29', '2025-05-25 10:41:29'),
(11, 'Vehicle Parts', 'AE/VP/1001', 3, 'Auto Electrical', 'Auto Electrical', 1, 'ABC Academy', '2025-05-25 10:42:04', '2025-05-25 10:42:04'),
(12, 'Accounting', 'AC/A/1001', 3, 'Accountancy', 'Accountancy', 1, 'Edu Lanka Institute', '2025-05-28 17:19:52', '2025-05-28 17:19:52'),
(13, 'Engineering', 'CE/E/1001', 3, 'Civil Engineering', 'Civil Engineering', 1, 'Git Academy', '2025-05-29 11:34:18', '2025-05-29 11:34:18'),
(14, 'ITPM', 'CS/ITPM/1004', 3, 'Computer Science', 'Computer Science', 1, 'Edu Lanka Institute', '2025-05-30 08:29:34', '2025-05-30 08:29:34'),
(15, 'Srilankan Law', 'L/SLL/1001', 3, 'Law', 'Law', 1, 'King Academy', '2025-06-01 11:46:39', '2025-06-01 11:59:38'),
(16, 'Political Science', 'L/PS/1002', 3, 'Law', 'Law', 1, 'King Academy', '2025-06-01 11:47:37', '2025-06-01 11:47:37'),
(17, 'Logics', 'L/L/2001', 3, 'Law', 'Law', 2, 'King Academy', '2025-06-01 11:48:11', '2025-06-01 11:48:11'),
(18, 'World Laww', 'L/WL/3001', 3, 'Law', 'Law', 3, 'King Academy', '2025-06-01 12:04:09', '2025-06-01 12:04:29'),
(19, 'Test Subject', 'TS/TS/1001', 3, 'Test Department', 'Test Department', 1, 'Test Institute', '2025-06-01 17:22:00', '2025-06-01 17:22:00'),
(20, 'Hardware Components', 'CH/HC/1001', 3, 'Computer Hardware', 'Computer Hardware', 1, 'AI World', '2025-06-01 18:57:54', '2025-06-01 18:57:54'),
(21, 'Java Programming', 'CS/JP/3001', 3, 'Computer Science', 'Computer Science', 3, 'Edu Lanka Institute', '2025-06-01 19:47:02', '2025-06-01 19:47:02'),
(22, 'Mathematics', 'S/M/1001', 3, 'Statistics', 'Statistics', 1, 'Smart Academy', '2025-06-01 20:07:48', '2025-06-01 20:07:48');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  `institute` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `institutes`
--
ALTER TABLE `institutes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `institute_admins`
--
ALTER TABLE `institute_admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admin_id` (`admin_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `lecturers`
--
ALTER TABLE `lecturers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `marks`
--
ALTER TABLE `marks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_student_subject` (`student_id`,`subject_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indexes for table `results`
--
ALTER TABLE `results`
  ADD PRIMARY KEY (`student_id`,`subject_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `student_id` (`student_id`),
  ADD KEY `course_id` (`course`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `certificates`
--
ALTER TABLE `certificates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `institutes`
--
ALTER TABLE `institutes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `institute_admins`
--
ALTER TABLE `institute_admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `lecturers`
--
ALTER TABLE `lecturers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `marks`
--
ALTER TABLE `marks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=324;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `certificates`
--
ALTER TABLE `certificates`
  ADD CONSTRAINT `certificates_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `certificates_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `marks`
--
ALTER TABLE `marks`
  ADD CONSTRAINT `marks_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `marks_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`),
  ADD CONSTRAINT `marks_ibfk_3` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `marks_ibfk_4` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
