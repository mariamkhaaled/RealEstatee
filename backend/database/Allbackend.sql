CREATE DATABASE  IF NOT EXISTS `real_estate` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `real_estate`;
-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: real_estate
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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (14,4,7,'2026-05-07 16:09:15'),(15,4,10,'2026-05-07 18:26:47'),(17,8,14,'2026-05-08 09:27:02'),(23,8,13,'2026-05-08 10:46:55');
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inquiries`
--

LOCK TABLES `inquiries` WRITE;
/*!40000 ALTER TABLE `inquiries` DISABLE KEYS */;
INSERT INTO `inquiries` VALUES (7,8,5,'Noha Shehab','nohashehab576@gmail.com','023779551','nice villa','Accepted','2026-04-19 21:29:51'),(9,3,5,'Noha Shehab','nohashehab576@gmail.com','023779551','هو ليه دايما بتعرضي صور و عايزه منك حاجه هتبقى تعدليها انه فال ركوست بروبيرتش ضيفي صوره الاونر دا و اسمه عشان انا كك نهى دلوقتي عايزه ابعتلك ف اعرف حتى الاكاونت دا تبع مين اصلا','Pending','2026-04-19 22:10:18'),(10,14,4,'Mariam Khaled','mariam.khaledwhby87@gmail.com','01154416271','hii noha??','Pending','2026-04-21 13:26:35'),(11,13,4,'Mariam Khaled','mariam.khaledwhby87@gmail.com','01154416271','nohaa333333','Pending','2026-04-21 13:27:13'),(12,11,4,'Mariam Khaled','mariam.khaledwhby87@gmail.com','01154416271','hi nohaaaaaaaaaa','Pending','2026-04-21 13:28:02'),(13,8,7,'Mariam Khaled','mariam.khaledwhby87@gmail.com','01154416271','hi','Pending','2026-05-07 20:15:03'),(15,13,7,'Mariam Khaled','mariam.khaledwhby87@gmail.com','01154416271','test el araf','Pending','2026-05-07 20:20:28'),(16,12,7,'Mariam Khaled','mariam.khaledwhby87@gmail.com','01154416271','hi npooha','Pending','2026-05-07 20:46:02'),(17,22,6,'Nohaa','nohagirl576@gmail.com','01154416271','testtt chat','Pending','2026-05-07 20:55:38'),(18,21,6,'noha','nohagirl576@gmail.com','01154416271','yarab ba2a','Pending','2026-05-07 21:43:55'),(19,12,6,'noha','nohagirl576@gmail.com','01154416271','yyyyyyyy','Pending','2026-05-07 21:44:48'),(20,5,6,'Nooooooooooohh','nohagirl576@gmail.com','01154416271','test 102','Accepted','2026-05-07 21:46:07');
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
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listings`
--

LOCK TABLES `listings` WRITE;
/*!40000 ALTER TABLE `listings` DISABLE KEYS */;
INSERT INTO `listings` VALUES (3,5,'Sale',3200000.00,'Active',0,NULL,'2026-04-19 17:39:58'),(5,7,'Sale',6800000.00,'Active',0,NULL,'2026-04-19 17:51:40'),(8,10,'Rent',100000.00,'Active',0,NULL,'2026-04-19 18:23:14'),(9,11,'Sale',4500000.00,'Active',0,NULL,'2026-04-19 19:24:06'),(10,12,'Sale',2500000.00,'Active',0,NULL,'2026-04-21 11:26:22'),(11,13,'Rent',4000.00,'Active',0,NULL,'2026-04-21 11:26:46'),(12,14,'Rent',20000.00,'Active',0,NULL,'2026-04-21 11:27:48'),(13,15,'Rent',3500.00,'Active',0,NULL,'2026-04-21 11:28:29'),(14,16,'Installment',1800000.00,'Active',0,NULL,'2026-04-21 11:29:12'),(20,22,'Rent',50000.00,'Active',0,NULL,'2026-05-07 15:24:48'),(21,23,'Sale',3.00,'Active',0,NULL,'2026-05-07 15:30:02'),(22,24,'Rent',50000.00,'Active',0,NULL,'2026-05-07 16:58:56'),(23,25,'Installment',6.00,'Active',0,NULL,'2026-05-07 17:02:01'),(24,26,'Sale',5.00,'Closed',0,NULL,'2026-05-07 18:00:06'),(25,27,'Rent',5.00,'Active',0,NULL,'2026-05-07 22:13:42');
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
INSERT INTO `messages` VALUES (5,4,5,'hi',1,'2026-04-19 21:30:17',7),(6,4,5,'hi',1,'2026-04-19 21:30:45',7),(7,4,5,'اه',1,'2026-04-19 21:36:40',7),(8,5,4,'هاي',1,'2026-04-19 21:36:54',7),(9,4,5,'بتست',1,'2026-04-19 21:39:11',7),(10,4,5,'شايفاني',1,'2026-04-19 21:39:17',7),(11,5,4,'ايوه',1,'2026-04-19 21:39:22',7),(12,4,5,'hg,',1,'2026-04-19 21:42:07',7),(13,4,5,'h',1,'2026-04-19 21:42:11',7),(14,4,5,'h',1,'2026-04-19 21:42:14',7),(15,5,4,'h',1,'2026-04-19 21:42:20',7),(16,4,5,'h',1,'2026-04-19 21:42:25',7),(17,5,4,'ا',1,'2026-04-19 21:45:43',7),(18,5,4,'ا',1,'2026-04-19 21:45:47',7),(19,5,4,'ا',1,'2026-04-19 21:45:51',7),(20,4,5,'ا',1,'2026-04-19 21:46:14',7),(21,4,5,'ا',1,'2026-04-19 21:46:17',7),(22,4,5,'ا',1,'2026-04-19 21:46:20',7),(23,4,5,'ا',1,'2026-04-19 21:46:23',7),(24,4,5,'ا',1,'2026-04-19 21:46:25',7),(25,4,5,'ا',1,'2026-04-19 21:46:28',7),(26,4,5,'ااااااا',1,'2026-04-19 21:51:54',7),(27,4,5,'اااا',1,'2026-04-19 21:52:16',7),(28,4,5,'نننن',1,'2026-04-19 21:52:24',7),(29,4,5,'ك',1,'2026-04-19 21:53:10',7),(30,4,5,'ك',1,'2026-04-19 21:53:12',7),(31,4,5,'م',1,'2026-04-19 21:53:20',7),(32,5,4,'وات',1,'2026-04-19 21:54:05',7),(33,5,4,'وات',1,'2026-04-19 21:54:18',7),(34,4,5,'ازيك',1,'2026-04-19 21:57:54',7),(35,5,4,'الحمدلله',1,'2026-04-19 21:58:06',7),(36,4,5,'اخبارك',1,'2026-04-19 21:58:39',7),(37,5,4,'ا',1,'2026-04-19 22:02:14',7),(38,4,5,'11',1,'2026-04-19 22:02:24',7),(39,4,5,'اه',1,'2026-04-19 22:05:19',7),(40,4,5,'hi',1,'2026-04-19 22:05:39',7),(41,4,5,'hi',1,'2026-04-19 22:05:40',7),(42,4,5,'hi',1,'2026-04-19 22:05:41',7),(43,4,5,'شتب',1,'2026-04-19 22:11:00',9),(44,4,5,'اخرسي',1,'2026-04-19 22:11:11',9),(45,5,4,'انا اخرس مين انتي مجنونه',1,'2026-04-19 22:11:27',9),(46,5,4,'مع السلامه ي سوء اختيار',1,'2026-04-19 22:14:39',9),(49,5,4,'الو',1,'2026-04-19 22:24:24',9),(50,5,4,'الو',1,'2026-04-19 22:24:32',9),(51,5,4,'الو',1,'2026-04-19 22:42:14',9),(52,5,4,'الو',1,'2026-04-19 22:42:38',9),(53,4,5,'عاجبك الديزاين',1,'2026-04-19 23:02:07',9),(54,5,4,'لا بصراحه',1,'2026-04-19 23:02:16',9),(55,5,4,'الو',1,'2026-04-19 23:10:42',9),(56,4,5,'امم ايه رايك',1,'2026-04-19 23:53:35',9),(57,5,4,'بحاول احبو اهو',1,'2026-04-19 23:53:44',9),(58,5,4,'يارب',1,'2026-04-20 00:07:55',7),(59,5,4,'الو',1,'2026-04-20 00:17:56',7),(60,4,5,'الو',1,'2026-04-20 00:18:07',7),(61,4,5,'الو',1,'2026-04-20 00:21:06',9),(62,4,5,'ya noooohhhaaaaaaaaaaaaaaaa',1,'2026-04-20 00:59:17',9),(63,5,4,'نعم',1,'2026-04-20 01:04:11',9),(64,4,5,'aloo',1,'2026-04-21 09:30:58',9),(65,4,5,'بتتقلي عليا؟',1,'2026-04-21 13:29:45',12),(66,5,4,'اه',1,'2026-04-21 13:35:45',12),(67,4,5,'ليهه',1,'2026-04-21 13:37:46',12),(68,5,4,'كده',1,'2026-04-21 13:37:56',12),(69,4,5,'ززززززززززززززززززززز',1,'2026-04-21 13:38:07',12),(70,5,4,'تتتتتتتتتتتت',1,'2026-04-21 13:38:16',12),(71,5,4,'الووووووووو',1,'2026-04-21 13:38:40',12),(72,4,5,'عايزة ايه',1,'2026-04-21 13:38:52',12),(73,5,4,'ولا حاجة',1,'2026-04-21 13:39:00',12),(74,5,7,'hiii',0,'2026-05-07 20:47:59',16),(75,4,6,'ana etganent',1,'2026-05-07 20:58:27',17),(76,6,4,'ana etganent',1,'2026-05-07 20:58:40',17),(77,6,4,'hiii',1,'2026-05-07 21:50:36',20),(78,4,6,'hiiii',0,'2026-05-07 21:51:54',20),(79,4,6,'hi',1,'2026-05-08 08:59:39',18),(80,6,4,'hi',1,'2026-05-08 09:12:52',18);
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
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `properties`
--

LOCK TABLES `properties` WRITE;
/*!40000 ALTER TABLE `properties` DISABLE KEYS */;
INSERT INTO `properties` VALUES (5,4,'Modern Apartment in New Cairoo','Spacious apartment with modern finishing, balcony, and great natural light.','Apartment',3,2,180.00,'2026-04-19 17:39:58','2026-05-07 18:21:42'),(7,4,'Modern Smart Villa in New Capital','Luxury smart villa with private pool, garden, and modern design in the New Administrative Capital.','Villa',4,3,320.00,'2026-04-19 17:51:40','2026-04-19 17:51:40'),(10,4,'Cool Villa','test test','Apartment',52,23,22222.00,'2026-04-19 18:23:14','2026-04-19 18:23:14'),(11,4,'Updated Apartment','Updated description','Apartment',3,2,180.00,'2026-04-19 19:24:06','2026-04-21 16:14:37'),(12,5,'Modern Apartment in New Cairo','A fully finished modern apartment in a prime location close to services and main roads.','Apartment',3,2,160.00,'2026-04-21 11:26:22','2026-04-21 11:26:22'),(13,5,'Cozy Studio near the Sea','A cozy furnished studio perfect for students or singles, close to the beach.','Studio',1,1,60.00,'2026-04-21 11:26:46','2026-04-21 11:26:46'),(14,5,'Penthouse with Panoramic View','Elegant penthouse with a large terrace and stunning open city view.','Penthouse',4,3,300.00,'2026-04-21 11:27:48','2026-04-21 11:27:48'),(15,6,'Affordable Apartment for Small Family','Budget-friendly apartment suitable for a small family in a lively area.','Apartment',2,1,100.00,'2026-04-21 11:28:29','2026-04-21 11:28:29'),(16,6,'Finished Apartment with Installment Plan','A stylish finished apartment available with a flexible installment payment plan.','Apartment',3,2,145.00,'2026-04-21 11:29:12','2026-04-21 11:29:12'),(22,4,'testt','testtttttttttttttt','Apartment',5,2,200.00,'2026-05-07 15:24:48','2026-05-07 17:27:28'),(23,4,'ff','mm','Apartment',3,3,3.00,'2026-05-07 15:30:02','2026-05-07 17:48:47'),(24,4,'Edit shaghala?  yaraabbb','....','Villa',2,22,2.00,'2026-05-07 16:58:56','2026-05-07 17:49:15'),(25,4,'mmmmmmmmmmmmmmmmmmmmmmmmmm',',,','Studio',7,8,6.00,'2026-05-07 17:02:01','2026-05-07 17:02:01'),(26,4,'akher test','22','Apartment',6,2,19967.00,'2026-05-07 18:00:06','2026-05-07 18:00:06'),(27,4,'mmmmmmmmmm','mmmmmmmm','Villa',6,1,1111.00,'2026-05-07 22:13:42','2026-05-07 22:13:42');
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
INSERT INTO `property_features` VALUES (5,1),(11,1),(12,1),(13,1),(15,1),(10,2),(11,2),(12,2),(14,2),(16,2),(5,3),(7,3),(10,3),(12,3),(14,3),(16,3),(22,3),(27,3),(27,4),(5,5),(7,5),(15,5),(13,6),(16,6),(7,7),(10,7),(14,7),(22,7),(24,7),(25,7),(26,7),(7,8),(10,9),(23,10);
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
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_images`
--

LOCK TABLES `property_images` WRITE;
/*!40000 ALTER TABLE `property_images` DISABLE KEYS */;
INSERT INTO `property_images` VALUES (14,7,'https://images.unsplash.com/photo-1613977257363-707ba9348227',1),(15,7,'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',0),(16,7,'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d',0),(17,7,'https://images.unsplash.com/photo-1600573472550-8090b5e0745e',0),(20,10,'/uploads/1776622994541-293691838.jpeg',1),(21,10,'/uploads/1776622994541-180953021.jpg',0),(22,10,'/uploads/1776622994542-837811553.jpg',0),(24,12,'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',1),(25,12,'https://images.unsplash.com/photo-1507089947368-19c1da9775ae',0),(26,13,'https://images.unsplash.com/photo-1493809842364-78817add7ffb',1),(27,13,'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',0),(28,14,'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',1),(29,14,'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde',0),(30,15,'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',1),(31,15,'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',0),(32,16,'https://images.unsplash.com/photo-1484154218962-a197022b5858',1),(33,16,'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',0),(56,11,'https://images.unsplash.com/photo-1',1),(57,11,'https://images.unsplash.com/photo-2',0),(61,25,'/uploads/1778173321608-93137255.jpg',1),(71,23,'/uploads/1778175105787-975435375.jpg',1),(72,23,'/uploads/1778175105874-598192620.jpg',0),(73,23,'/uploads/1778175105961-484211219.jpg',0),(76,24,'/uploads/1778176143860-824625048.JPG',1),(77,24,'/uploads/1778176143961-340252033.JPG',0),(78,22,'/uploads/1778176170551-793700493.JPG',1),(79,22,'/uploads/1778176170551-384740471.JPG',0),(80,26,'/uploads/1778176806497-42322616.webp',1),(81,26,'/uploads/1778176806498-139193397.webp',0),(82,5,'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',1),(83,5,'https://images.unsplash.com/photo-1493809842364-78817add7ffb',0),(84,5,'https://images.unsplash.com/photo-1484154218962-a197022b5858',0),(85,5,'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',0),(86,27,'/uploads/1778192022169-378357664.jpg',1),(87,27,'/uploads/1778192022169-941642576.jpg',0);
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
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_locations`
--

LOCK TABLES `property_locations` WRITE;
/*!40000 ALTER TABLE `property_locations` DISABLE KEYS */;
INSERT INTO `property_locations` VALUES (3,5,'Cairo','New Cairo - Fifth Settlement'),(5,7,'Cairo','New Administrative Capital - R7'),(8,10,'Egypt','North-Cost'),(9,11,'New Cairo','Mivida'),(10,12,'Cairo','Fifth Settlement, New Cairo'),(11,13,'Alexandria','Stanley Area'),(12,14,'Cairo','Nasr City'),(13,15,'Giza','Faisal Street'),(14,16,'6th of October','October Gardens'),(20,22,'egypt','test'),(21,23,'f','f'),(22,24,'..','..'),(23,25,'hhh','lll'),(24,26,'gggggggggggggggg','gg'),(25,27,'fff','bb');
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (4,'Mariam Khaled','mariam.khaledwhby87@gmail.com','$2b$10$g7Pxqr4EI0MKurbTmJfai.E8tsaMhzvbJO/i/VbxdtjkgvYjBdvne','0000000000','owner',1,NULL,NULL,'2026-04-19 17:28:53','/uploads/1778230722478-387842432.jpg'),(5,'Noha Shehab','nohashehab576@gmail.com','$2b$10$FrGqhdj4619P.yj/YqoTKeoNfC/7m18bCWkB2tm.54QiKNSBarIiq','0000000000','owner',1,NULL,NULL,'2026-04-19 21:07:07',NULL),(6,'نهى السعيد','nohagirl576@gmail.com','$2b$10$2W0HBCAG8UxdKT0DvjNAr.jjVq/pGb8JDXYbmxTWvfOUU4CxRIjpa','0000000000','owner',1,NULL,NULL,'2026-04-20 00:31:59',NULL),(7,'Mariam Khaled','mrymkhaldmhmd898@gmail.com','$2b$10$hdys7cWQgW.rPiwQrvEPDO5rjZTMP4Ju6iIBaNmRcWUSKeT9mGF2K','0000000000','admin',1,NULL,NULL,'2026-05-07 09:28:59','/uploads/1778183326285-172588306.jpg'),(8,'Mariam Khaled','wahbymariam7@gmail.com','$2b$10$zokp4VGeOJR1S1Up.EhAiu2WHF1CcUGR2J0OnbGYUy4FpUls77z0i','0000000000','owner',1,NULL,NULL,'2026-05-08 09:18:47',NULL);
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

-- Dump completed on 2026-05-08 14:37:05
