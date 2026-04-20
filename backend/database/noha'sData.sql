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
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (1,4,1,'2026-04-20 00:58:15'),(2,4,3,'2026-04-20 00:58:16'),(3,4,8,'2026-04-20 00:58:17');
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
INSERT INTO `inquiries` VALUES (1,6,5,'Noha Shehab','nohashehab576@gmail.com','023779551','ياااا مريييييييييييييييييييييييمممممممم','Pending','2026-04-19 21:12:04'),(2,1,5,'Noha Shehab','nohashehab576@gmail.com','023779551','حجه مريم','Pending','2026-04-19 21:13:42'),(3,7,5,'Noha Shehab','nohashehab576@gmail.com','023779551','و بعدين الاميميل وصلك ولا لا','Pending','2026-04-19 21:14:36'),(7,8,5,'Noha Shehab','nohashehab576@gmail.com','023779551','nice villa','Accepted','2026-04-19 21:29:51'),(8,2,5,'Noha Shehab','nohashehab576@gmail.com','023779551','هيا دي شقتك المهم ف صفحتك انتي دايما بتعرضي تلت صور ولا اكتر ؟ عشان دايما بشوف تلت صور','Pending','2026-04-19 22:08:55'),(9,3,5,'Noha Shehab','nohashehab576@gmail.com','023779551','هو ليه دايما بتعرضي صور و عايزه منك حاجه هتبقى تعدليها انه فال ركوست بروبيرتش ضيفي صوره الاونر دا و اسمه عشان انا كك نهى دلوقتي عايزه ابعتلك ف اعرف حتى الاكاونت دا تبع مين اصلا','Pending','2026-04-19 22:10:18');
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
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,4,5,'ايوه وصل',1,'2026-04-19 21:15:11',3),(2,4,5,'الو',1,'2026-04-19 21:17:31',3),(3,4,5,'الو',1,'2026-04-19 21:17:34',3),(4,4,5,'الو',1,'2026-04-19 21:21:30',3),(5,4,5,'hi',1,'2026-04-19 21:30:17',7),(6,4,5,'hi',1,'2026-04-19 21:30:45',7),(7,4,5,'اه',1,'2026-04-19 21:36:40',7),(8,5,4,'هاي',1,'2026-04-19 21:36:54',7),(9,4,5,'بتست',1,'2026-04-19 21:39:11',7),(10,4,5,'شايفاني',1,'2026-04-19 21:39:17',7),(11,5,4,'ايوه',1,'2026-04-19 21:39:22',7),(12,4,5,'hg,',1,'2026-04-19 21:42:07',7),(13,4,5,'h',1,'2026-04-19 21:42:11',7),(14,4,5,'h',1,'2026-04-19 21:42:14',7),(15,5,4,'h',1,'2026-04-19 21:42:20',7),(16,4,5,'h',1,'2026-04-19 21:42:25',7),(17,5,4,'ا',1,'2026-04-19 21:45:43',7),(18,5,4,'ا',1,'2026-04-19 21:45:47',7),(19,5,4,'ا',1,'2026-04-19 21:45:51',7),(20,4,5,'ا',1,'2026-04-19 21:46:14',7),(21,4,5,'ا',1,'2026-04-19 21:46:17',7),(22,4,5,'ا',1,'2026-04-19 21:46:20',7),(23,4,5,'ا',1,'2026-04-19 21:46:23',7),(24,4,5,'ا',1,'2026-04-19 21:46:25',7),(25,4,5,'ا',1,'2026-04-19 21:46:28',7),(26,4,5,'ااااااا',1,'2026-04-19 21:51:54',7),(27,4,5,'اااا',1,'2026-04-19 21:52:16',7),(28,4,5,'نننن',1,'2026-04-19 21:52:24',7),(29,4,5,'ك',1,'2026-04-19 21:53:10',7),(30,4,5,'ك',1,'2026-04-19 21:53:12',7),(31,4,5,'م',1,'2026-04-19 21:53:20',7),(32,5,4,'وات',1,'2026-04-19 21:54:05',7),(33,5,4,'وات',1,'2026-04-19 21:54:18',7),(34,4,5,'ازيك',1,'2026-04-19 21:57:54',7),(35,5,4,'الحمدلله',1,'2026-04-19 21:58:06',7),(36,4,5,'اخبارك',1,'2026-04-19 21:58:39',7),(37,5,4,'ا',1,'2026-04-19 22:02:14',7),(38,4,5,'11',1,'2026-04-19 22:02:24',7),(39,4,5,'اه',1,'2026-04-19 22:05:19',7),(40,4,5,'hi',1,'2026-04-19 22:05:39',7),(41,4,5,'hi',1,'2026-04-19 22:05:40',7),(42,4,5,'hi',1,'2026-04-19 22:05:41',7),(43,4,5,'شتب',1,'2026-04-19 22:11:00',9),(44,4,5,'اخرسي',1,'2026-04-19 22:11:11',9),(45,5,4,'انا اخرس مين انتي مجنونه',1,'2026-04-19 22:11:27',9),(46,5,4,'مع السلامه ي سوء اختيار',1,'2026-04-19 22:14:39',9),(47,5,2,'الووو',0,'2026-04-19 22:23:59',8),(48,5,2,'الوو',0,'2026-04-19 22:24:03',8),(49,5,4,'الو',1,'2026-04-19 22:24:24',9),(50,5,4,'الو',1,'2026-04-19 22:24:32',9),(51,5,4,'الو',1,'2026-04-19 22:42:14',9),(52,5,4,'الو',1,'2026-04-19 22:42:38',9),(53,4,5,'عاجبك الديزاين',1,'2026-04-19 23:02:07',9),(54,5,4,'لا بصراحه',1,'2026-04-19 23:02:16',9),(55,5,4,'الو',1,'2026-04-19 23:10:42',9),(56,4,5,'امم ايه رايك',1,'2026-04-19 23:53:35',9),(57,5,4,'بحاول احبو اهو',1,'2026-04-19 23:53:44',9),(58,5,4,'يارب',1,'2026-04-20 00:07:55',7),(59,5,4,'الو',1,'2026-04-20 00:17:56',7),(60,4,5,'الو',1,'2026-04-20 00:18:07',7),(61,4,5,'الو',1,'2026-04-20 00:21:06',9),(62,4,5,'ya noooohhhaaaaaaaaaaaaaaaa',1,'2026-04-20 00:59:17',9),(63,5,4,'نعم',1,'2026-04-20 01:04:11',9);
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
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
INSERT INTO `users` VALUES (1,'Test Owner','owner@test.com','123456','01000000000','owner',0,NULL,NULL,'2026-04-19 16:38:42'),(2,'Ahmed Ali','ahmed@test.com','123456',NULL,'owner',0,NULL,NULL,'2026-04-19 17:00:36'),(4,'Mariam Khaled','mariam.khaledwhby87@gmail.com','$2b$10$g7Pxqr4EI0MKurbTmJfai.E8tsaMhzvbJO/i/VbxdtjkgvYjBdvne','0000000000','owner',1,NULL,NULL,'2026-04-19 17:28:53'),(5,'Noha Shehab','nohashehab576@gmail.com','$2b$10$FrGqhdj4619P.yj/YqoTKeoNfC/7m18bCWkB2tm.54QiKNSBarIiq','0000000000','owner',1,NULL,NULL,'2026-04-19 21:07:07'),(6,'نهى السعيد','nohagirl576@gmail.com','$2b$10$2W0HBCAG8UxdKT0DvjNAr.jjVq/pGb8JDXYbmxTWvfOUU4CxRIjpa','0000000000','owner',1,NULL,NULL,'2026-04-20 00:31:59');
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

-- Dump completed on 2026-04-20  3:05:59
