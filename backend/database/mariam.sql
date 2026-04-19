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
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `features`
--

LOCK TABLES `features` WRITE;
/*!40000 ALTER TABLE `features` DISABLE KEYS */;
INSERT INTO `features` VALUES (7,'Balcony'),(4,'Central AC'),(9,'Elevator'),(10,'Furnished'),(3,'Garage'),(8,'Garden'),(6,'Ocean View'),(5,'Security Cameras'),(2,'Smart Home'),(1,'Swimming Pool');
/*!40000 ALTER TABLE `features` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `inquiries`
--

LOCK TABLES `inquiries` WRITE;
/*!40000 ALTER TABLE `inquiries` DISABLE KEYS */;
/*!40000 ALTER TABLE `inquiries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `listings`
--

LOCK TABLES `listings` WRITE;
/*!40000 ALTER TABLE `listings` DISABLE KEYS */;
INSERT INTO `listings` VALUES (1,1,'Sale',7500000.00,'Active',0,NULL,'2026-04-19 16:39:29'),(2,3,'Sale',3200000.00,'Active',0,NULL,'2026-04-19 17:00:53'),(3,5,'Sale',3200000.00,'Active',0,NULL,'2026-04-19 17:39:58'),(4,6,'Sale',10000000000.00,'Active',0,NULL,'2026-04-19 17:42:45'),(5,7,'Sale',6800000.00,'Active',0,NULL,'2026-04-19 17:51:40'),(6,8,'Rent',100.00,'Active',0,NULL,'2026-04-19 17:52:52'),(7,9,'Rent',1.00,'Active',0,NULL,'2026-04-19 17:56:32'),(8,10,'Rent',100000.00,'Active',0,NULL,'2026-04-19 18:23:14'),(9,11,'Sale',20000.00,'Active',0,NULL,'2026-04-19 19:24:06');
/*!40000 ALTER TABLE `listings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `properties`
--

LOCK TABLES `properties` WRITE;
/*!40000 ALTER TABLE `properties` DISABLE KEYS */;
INSERT INTO `properties` VALUES (1,1,'Luxury Beachfront Villa','A stunning villa directly on the beach with private pool and garden.','Villa',5,4,450.00,'2026-04-19 16:39:29','2026-04-19 16:39:29'),(3,2,'Modern Apartment in New Cairo','Spacious apartment with modern finishing, balcony, and great natural light.','Apartment',3,2,180.00,'2026-04-19 17:00:53','2026-04-19 17:00:53'),(5,4,'Modern Apartment in New Cairo','Spacious apartment with modern finishing, balcony, and great natural light.','Apartment',3,2,180.00,'2026-04-19 17:39:58','2026-04-19 17:39:58'),(6,1,'Villa','Villa','Villa',5,2,3200.00,'2026-04-19 17:42:45','2026-04-19 17:42:45'),(7,4,'Modern Smart Villa in New Capital','Luxury smart villa with private pool, garden, and modern design in the New Administrative Capital.','Villa',4,3,320.00,'2026-04-19 17:51:40','2026-04-19 17:51:40'),(8,1,'Mariom','test','Apartment',5,1,49941.00,'2026-04-19 17:52:52','2026-04-19 17:52:52'),(9,4,'test','test','Studio',4,4,4.00,'2026-04-19 17:56:32','2026-04-19 17:56:32'),(10,4,'Cool Villa','test test','Apartment',52,23,22222.00,'2026-04-19 18:23:14','2026-04-19 18:23:14'),(11,4,'Test testtt','testtt testt mariamm is hereeeee ee','Apartment',5,6,4000.00,'2026-04-19 19:24:06','2026-04-19 19:24:06');
/*!40000 ALTER TABLE `properties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `property_features`
--

LOCK TABLES `property_features` WRITE;
/*!40000 ALTER TABLE `property_features` DISABLE KEYS */;
INSERT INTO `property_features` VALUES (1,1),(3,1),(5,1),(6,1),(1,2),(10,2),(1,3),(3,3),(5,3),(6,3),(7,3),(10,3),(1,4),(3,5),(5,5),(6,5),(7,5),(6,7),(7,7),(8,7),(9,7),(10,7),(11,7),(6,8),(7,8),(10,9),(6,10),(11,10);
/*!40000 ALTER TABLE `property_features` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `property_images`
--

LOCK TABLES `property_images` WRITE;
/*!40000 ALTER TABLE `property_images` DISABLE KEYS */;
INSERT INTO `property_images` VALUES (1,1,'https://images.unsplash.com/photo-1613490493576-7fde63acd811',1),(2,1,'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',0),(3,1,'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',0),(4,1,'https://images.unsplash.com/photo-1600573472550-8090b5e0745e',0),(5,3,'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',1),(6,3,'https://images.unsplash.com/photo-1493809842364-78817add7ffb',0),(7,3,'https://images.unsplash.com/photo-1484154218962-a197022b5858',0),(8,3,'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',0),(9,5,'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',1),(10,5,'https://images.unsplash.com/photo-1493809842364-78817add7ffb',0),(11,5,'https://images.unsplash.com/photo-1484154218962-a197022b5858',0),(12,5,'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',0),(13,6,'/uploads/1776620565788-772499836.jpg',1),(14,7,'https://images.unsplash.com/photo-1613977257363-707ba9348227',1),(15,7,'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',0),(16,7,'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d',0),(17,7,'https://images.unsplash.com/photo-1600573472550-8090b5e0745e',0),(18,8,'/uploads/1776621172946-413326417.jpg',1),(19,9,'/uploads/1776621392885-563002257.jpg',1),(20,10,'/uploads/1776622994541-293691838.jpeg',1),(21,10,'/uploads/1776622994541-180953021.jpg',0),(22,10,'/uploads/1776622994542-837811553.jpg',0),(23,11,'/uploads/1776626646056-721678327.jpg',1);
/*!40000 ALTER TABLE `property_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `property_locations`
--

LOCK TABLES `property_locations` WRITE;
/*!40000 ALTER TABLE `property_locations` DISABLE KEYS */;
INSERT INTO `property_locations` VALUES (1,1,'Alexandria','North Coast - Marina 5'),(2,3,'Cairo','New Cairo - Fifth Settlement'),(3,5,'Cairo','New Cairo - Fifth Settlement'),(4,6,'Egypt','North Coast'),(5,7,'Cairo','New Administrative Capital - R7'),(6,8,'test','test'),(7,9,'test','test'),(8,10,'Egypt','North-Cost'),(9,11,'Egypt','Cairo');
/*!40000 ALTER TABLE `property_locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Test Owner','owner@test.com','123456','01000000000','owner',0,NULL,NULL,'2026-04-19 16:38:42'),(2,'Ahmed Ali','ahmed@test.com','123456',NULL,'owner',0,NULL,NULL,'2026-04-19 17:00:36'),(4,'Mariam Khaled','mariam.khaledwhby87@gmail.com','$2b$10$g7Pxqr4EI0MKurbTmJfai.E8tsaMhzvbJO/i/VbxdtjkgvYjBdvne','0000000000','owner',1,NULL,NULL,'2026-04-19 17:28:53');
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

-- Dump completed on 2026-04-19 21:35:47
