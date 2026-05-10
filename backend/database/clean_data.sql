-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: real_estate
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `favorite_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `property_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`favorite_id`),
  UNIQUE KEY `customer_id` (`customer_id`,`property_id`),
  KEY `fk_favorite_property` (`property_id`),
  CONSTRAINT `fk_favorite_customer` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_favorite_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (14,4,7,'2026-05-07 16:09:15'),(17,8,14,'2026-05-08 09:27:02'),(23,8,13,'2026-05-08 10:46:55'),(26,9,5,'2026-05-08 14:47:54'),(27,9,7,'2026-05-08 14:47:55'),(29,9,12,'2026-05-08 15:45:31'),(30,9,13,'2026-05-08 15:45:33'),(31,10,13,'2026-05-08 15:46:57'),(32,10,14,'2026-05-08 15:46:57'),(33,10,15,'2026-05-08 15:46:58'),(34,10,12,'2026-05-08 15:46:59');
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `features`
--

DROP TABLE IF EXISTS `features`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `features` (
  `feature_id` int NOT NULL AUTO_INCREMENT,
  `feature_name` varchar(100) NOT NULL,
  PRIMARY KEY (`feature_id`),
  UNIQUE KEY `feature_name` (`feature_name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `features`
--

LOCK TABLES `features` WRITE;
/*!40000 ALTER TABLE `features` DISABLE KEYS */;
INSERT INTO `features` VALUES (7,'Balcony'),(4,'Central AC'),(9,'Elevator'),(10,'Furnished'),(3,'Garage'),(8,'Garden'),(6,'Ocean View'),(5,'Security Cameras'),(2,'Smart Home'),(1,'Swimming Pool');
/*!40000 ALTER TABLE `features` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inquiries`
--

DROP TABLE IF EXISTS `inquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inquiries` (
  `inquiry_id` int NOT NULL AUTO_INCREMENT,
  `listing_id` int NOT NULL,
  `customer_id` int DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `message` text NOT NULL,
  `status` enum('Pending','Reviewed','Accepted','Rejected') DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`inquiry_id`),
  KEY `fk_inquiry_listing` (`listing_id`),
  KEY `fk_inquiry_customer` (`customer_id`),
  CONSTRAINT `fk_inquiry_customer` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_inquiry_listing` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`listing_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=206 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inquiries`
--

LOCK TABLES `inquiries` WRITE;
/*!40000 ALTER TABLE `inquiries` DISABLE KEYS */;
INSERT INTO `inquiries` VALUES (100,3,5,'Noha Shehab','noha.shehab@example.com','01012345678','I am interested in scheduling a viewing for this property. Please let me know available times.','Pending','2026-04-20 08:15:00'),(101,12,7,'Mariam Khaled','mariam.khaled@example.com','01154416271','Hello, I would like more details about the apartment features and maintenance fees.','Reviewed','2026-05-07 15:30:00'),(201,3,9,'Mariam Riad','mariamriad919@gmail.com','01154416271','Can you provide more details about the pricing and payment plan for this listing?','Pending','2026-05-09 09:10:00'),(202,3,5,'Noha Shehab','nohashehab576@gmail.com','01012345678','Is the apartment still available? I would like to schedule a viewing.','Pending','2026-05-09 09:20:00'),(203,5,7,'Mariam Khaled','mrymkhaldmhmd898@gmail.com','01000000000','Can you confirm if this property includes parking and balcony?','Reviewed','2026-05-09 09:25:00'),(204,10,10,'Mariam Riad','mariomariad2005@gmail.com','01000000000','I would like to know more about the payment plan and monthly installments.','Pending','2026-05-09 09:30:00'),(205,12,4,'Mariam Khaled','mariam.khaledwhby87@gmail.com','0000000000','Is it possible to book a viewing tomorrow afternoon?','Accepted','2026-05-09 09:35:00');
/*!40000 ALTER TABLE `inquiries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listings`
--

DROP TABLE IF EXISTS `listings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listings` (
  `listing_id` int NOT NULL AUTO_INCREMENT,
  `property_id` int NOT NULL,
  `purpose` enum('Sale','Rent','Installment') NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `status` enum('Active','Pending','Sold','Rented','Closed') DEFAULT 'Active',
  `views` int DEFAULT '0',
  `closed_to` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`listing_id`),
  KEY `fk_listing_property` (`property_id`),
  CONSTRAINT `fk_listing_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listings`
--

LOCK TABLES `listings` WRITE;
/*!40000 ALTER TABLE `listings` DISABLE KEYS */;
INSERT INTO `listings` VALUES (3,5,'Sale',3200000.00,'Active',0,NULL,'2026-04-19 17:39:58'),(5,7,'Sale',6800000.00,'Active',0,NULL,'2026-04-19 17:51:40'),(10,12,'Sale',2500000.00,'Active',0,NULL,'2026-04-21 11:26:22'),(11,13,'Rent',4000.00,'Active',0,NULL,'2026-04-21 11:26:46'),(12,14,'Rent',20000.00,'Active',0,NULL,'2026-04-21 11:27:48'),(13,15,'Rent',3500.00,'Active',0,NULL,'2026-04-21 11:28:29'),(14,16,'Installment',1800000.00,'Active',0,NULL,'2026-04-21 11:29:12'),(29,32,'Sale',2500000.00,'Active',0,NULL,'2026-05-09 17:40:42');
/*!40000 ALTER TABLE `listings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `content` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `inquiry_id` int NOT NULL,
  PRIMARY KEY (`message_id`),
  KEY `fk_message_sender` (`sender_id`),
  KEY `fk_message_receiver` (`receiver_id`),
  KEY `fk_message_inquiry` (`inquiry_id`),
  CONSTRAINT `fk_message_inquiry` FOREIGN KEY (`inquiry_id`) REFERENCES `inquiries` (`inquiry_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_message_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_message_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,5,7,'Hi, I am interested in the property. Is it still available?',1,'2026-05-09 11:00:00',202),(2,7,5,'Yes, it is available. Would you like to schedule a visit?',1,'2026-05-09 11:02:00',202),(3,9,4,'Can you provide more details about finishing quality?',0,'2026-05-09 11:05:00',203),(4,4,9,'Sure, it is semi-finished with premium materials.',0,'2026-05-09 11:06:30',203),(5,10,5,'Is the price negotiable for this property?',0,'2026-05-09 11:10:00',204),(6,5,10,'Yes, negotiation is possible depending on payment method.',1,'2026-05-09 11:12:00',204),(7,7,10,'Do you offer installment plans?',0,'2026-05-09 11:15:00',205),(8,10,7,'Yes, installment plans are available for selected listings.',0,'2026-05-09 11:17:00',205);
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `properties`
--

DROP TABLE IF EXISTS `properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `properties` (
  `property_id` int NOT NULL AUTO_INCREMENT,
  `owner_id` int NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `property_type` enum('Villa','Apartment','Penthouse','Studio') NOT NULL,
  `bedrooms` int DEFAULT '0',
  `bathrooms` int DEFAULT '0',
  `area` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`property_id`),
  KEY `fk_property_owner` (`owner_id`),
  CONSTRAINT `fk_property_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `properties`
--

LOCK TABLES `properties` WRITE;
/*!40000 ALTER TABLE `properties` DISABLE KEYS */;
INSERT INTO `properties` VALUES (5,4,'Modern Apartment in New Cairoo','Spacious apartment with modern finishing, balcony, and great natural light.','Apartment',3,2,180.00,'2026-04-19 17:39:58','2026-05-07 18:21:42'),(7,4,'Modern Smart Villa in New Capital','Luxury smart villa with private pool, garden, and modern design in the New Administrative Capital.','Villa',4,3,320.00,'2026-04-19 17:51:40','2026-04-19 17:51:40'),(12,5,'Modern Apartment in New Cairo','A fully finished modern apartment in a prime location close to services and main roads.','Apartment',3,2,160.00,'2026-04-21 11:26:22','2026-04-21 11:26:22'),(13,5,'Cozy Studio near the Sea','A cozy furnished studio perfect for students or singles, close to the beach.','Studio',1,1,60.00,'2026-04-21 11:26:46','2026-04-21 11:26:46'),(14,5,'Penthouse with Panoramic View','Elegant penthouse with a large terrace and stunning open city view.','Penthouse',4,3,300.00,'2026-04-21 11:27:48','2026-04-21 11:27:48'),(15,6,'Affordable Apartment for Small Family','Budget-friendly apartment suitable for a small family in a lively area.','Apartment',2,1,100.00,'2026-04-21 11:28:29','2026-04-21 11:28:29'),(16,6,'Finished Apartment with Installment Plan','A stylish finished apartment available with a flexible installment payment plan.','Apartment',3,2,145.00,'2026-04-21 11:29:12','2026-04-21 11:29:12'),(32,10,'Modern Apartment in New Cairo','Bright modern apartment located in a prime location in New Cairo with spacious layout and natural light.','Apartment',2,1,1200.00,'2026-05-09 17:40:42','2026-05-09 17:40:42'),(33,4,'Modern Apartment in Fifth Settlement','\nBright 2-bedroom apartment in a prime New Cairo location with modern finishing and balcony view.','Apartment',4,2,1600.00,'2026-05-09 17:54:35','2026-05-09 17:54:35');
/*!40000 ALTER TABLE `properties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `property_features`
--

DROP TABLE IF EXISTS `property_features`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_features` (
  `property_id` int NOT NULL,
  `feature_id` int NOT NULL,
  PRIMARY KEY (`property_id`,`feature_id`),
  KEY `fk_pf_feature` (`feature_id`),
  CONSTRAINT `fk_pf_feature` FOREIGN KEY (`feature_id`) REFERENCES `features` (`feature_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pf_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_features`
--

LOCK TABLES `property_features` WRITE;
/*!40000 ALTER TABLE `property_features` DISABLE KEYS */;
INSERT INTO `property_features` VALUES (5,1),(12,1),(13,1),(15,1),(12,2),(14,2),(16,2),(5,3),(7,3),(12,3),(14,3),(16,3),(5,5),(7,5),(15,5),(13,6),(16,6),(7,7),(14,7),(32,7),(33,7),(7,8),(32,8),(33,8),(32,10);
/*!40000 ALTER TABLE `property_features` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `property_images`
--

DROP TABLE IF EXISTS `property_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_images` (
  `image_id` int NOT NULL AUTO_INCREMENT,
  `property_id` int NOT NULL,
  `image_url` text NOT NULL,
  `is_primary` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`image_id`),
  KEY `fk_image_property` (`property_id`),
  CONSTRAINT `fk_image_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_images`
--

LOCK TABLES `property_images` WRITE;
/*!40000 ALTER TABLE `property_images` DISABLE KEYS */;
INSERT INTO `property_images` VALUES (14,7,'https://images.unsplash.com/photo-1613977257363-707ba9348227',1),(15,7,'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',0),(16,7,'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d',0),(17,7,'https://images.unsplash.com/photo-1600573472550-8090b5e0745e',0),(24,12,'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',1),(25,12,'https://images.unsplash.com/photo-1507089947368-19c1da9775ae',0),(26,13,'https://images.unsplash.com/photo-1493809842364-78817add7ffb',1),(27,13,'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',0),(28,14,'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',1),(29,14,'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde',0),(30,15,'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',1),(31,15,'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',0),(32,16,'https://images.unsplash.com/photo-1484154218962-a197022b5858',1),(33,16,'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',0),(82,5,'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',1),(83,5,'https://images.unsplash.com/photo-1493809842364-78817add7ffb',0),(84,5,'https://images.unsplash.com/photo-1484154218962-a197022b5858',0),(85,5,'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',0),(93,32,'/uploads/1778348441819-584496948.jpg',1),(94,33,'/uploads/1778349275888-502822641.jpg',1),(95,33,'/uploads/1778349275937-957463011.jpg',0);
/*!40000 ALTER TABLE `property_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `property_locations`
--

DROP TABLE IF EXISTS `property_locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_locations` (
  `location_id` int NOT NULL AUTO_INCREMENT,
  `property_id` int NOT NULL,
  `city` varchar(100) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`location_id`),
  UNIQUE KEY `property_id` (`property_id`),
  CONSTRAINT `fk_location_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_locations`
--

LOCK TABLES `property_locations` WRITE;
/*!40000 ALTER TABLE `property_locations` DISABLE KEYS */;
INSERT INTO `property_locations` VALUES (3,5,'Cairo','New Cairo - Fifth Settlement'),(5,7,'Cairo','New Administrative Capital - R7'),(10,12,'Cairo','Fifth Settlement, New Cairo'),(11,13,'Alexandria','Stanley Area'),(12,14,'Cairo','Nasr City'),(13,15,'Giza','Faisal Street'),(14,16,'6th of October','October Gardens'),(30,32,'New Cairo','New Administrative Capital – R7'),(31,33,'New Cairo','New Cairo – Fifth Settlement');
/*!40000 ALTER TABLE `property_locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('owner','customer','admin') NOT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `otp_code` varchar(10) DEFAULT NULL,
  `token_expires` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `photo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (4,'Mariam Khaled','mariam.khaledwhby87@gmail.com','$2b$10$g7Pxqr4EI0MKurbTmJfai.E8tsaMhzvbJO/i/VbxdtjkgvYjBdvne','0000000000','owner',1,NULL,NULL,'2026-04-19 17:28:53','/uploads/1778230722478-387842432.jpg'),(5,'Noha Shehab','nohashehab576@gmail.com','$2b$10$FrGqhdj4619P.yj/YqoTKeoNfC/7m18bCWkB2tm.54QiKNSBarIiq','01012345678','owner',1,NULL,NULL,'2026-04-19 21:07:07',NULL),(6,'نهى السعيد','nohagirl576@gmail.com','$2b$10$2W0HBCAG8UxdKT0DvjNAr.jjVq/pGb8JDXYbmxTWvfOUU4CxRIjpa','0000000000','owner',1,NULL,NULL,'2026-04-20 00:31:59',NULL),(7,'Mariam Khaled','mrymkhaldmhmd898@gmail.com','$2b$10$hdys7cWQgW.rPiwQrvEPDO5rjZTMP4Ju6iIBaNmRcWUSKeT9mGF2K','0000000000','admin',1,NULL,NULL,'2026-05-07 09:28:59','/uploads/1778183326285-172588306.jpg'),(8,'Mariam Khaled','wahbymariam7@gmail.com','$2b$10$zokp4VGeOJR1S1Up.EhAiu2WHF1CcUGR2J0OnbGYUy4FpUls77z0i','0000000000','owner',1,NULL,NULL,'2026-05-08 09:18:47',NULL),(9,'Mariam Riad','mariamriad919@gmail.com','$2b$10$GUoyOD2qTDUehQxuJOraSu.lnWRa27uURYuqDj4Bp.JCtWIIj./Oa','0000000000','admin',1,NULL,NULL,'2026-05-08 14:47:10','/uploads/1778252021563-545055217.jpg'),(10,'Mariam Riad','mariomariad2005@gmail.com','$2b$10$TKPfWuC0IEfSC04uLIKxguqdiGkwKTmgnUW3F0UW8TzsXEFfKpzX2','0000000000','owner',1,NULL,NULL,'2026-05-08 15:46:12','/uploads/1778255474718-716228895.jpg');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-09 21:23:05
