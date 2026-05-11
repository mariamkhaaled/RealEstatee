USE real_estate;

-- USERS
INSERT INTO users 
(user_id, full_name, email, password_hash, phone, role, is_verified, otp_code, token_expires, created_at, photo)
VALUES
(4,'Mariam Khaled','mariam.khaledwhby87@gmail.com','$2b$10$g7Pxqr4EI0MKurbTmJfai.E8tsaMhzvbJO/i/VbxdtjkgvYjBdvne','0000000000','owner',1,NULL,NULL,'2026-04-19 17:28:53','/uploads/1778230722478-387842432.jpg'),
(5,'Noha Shehab','nohashehab576@gmail.com','$2b$10$FrGqhdj4619P.yj/YqoTKeoNfC/7m18bCWkB2tm.54QiKNSBarIiq','01012345678','owner',1,NULL,NULL,'2026-04-19 21:07:07',NULL),
(6,'نهى السعيد','nohagirl576@gmail.com','$2b$10$2W0HBCAG8UxdKT0DvjNAr.jjVq/pGb8JDXYbmxTWvfOUU4CxRIjpa','0000000000','owner',1,NULL,NULL,'2026-04-20 00:31:59',NULL),
(7,'Mariam Khaled','mrymkhaldmhmd898@gmail.com','$2b$10$hdys7cWQgW.rPiwQrvEPDO5rjZTMP4Ju6iIBaNmRcWUSKeT9mGF2K','0000000000','admin',1,NULL,NULL,'2026-05-07 09:28:59','/uploads/1778183326285-172588306.jpg'),
(8,'Mariam Khaled','wahbymariam7@gmail.com','$2b$10$zokp4VGeOJR1S1Up.EhAiu2WHF1CcUGR2J0OnbGYUy4FpUls77z0i','0000000000','owner',1,NULL,NULL,'2026-05-08 09:18:47',NULL),
(9,'Mariam Riad','mariamriad919@gmail.com','$2b$10$GUoyOD2qTDUehQxuJOraSu.lnWRa27uURYuqDj4Bp.JCtWIIj./Oa','0000000000','admin',1,NULL,NULL,'2026-05-08 14:47:10','/uploads/1778252021563-545055217.jpg'),
(10,'Mariam Riad','mariomariad2005@gmail.com','$2b$10$TKPfWuC0IEfSC04uLIKxguqdiGkwKTmgnUW3F0UW8TzsXEFfKpzX2','0000000000','owner',1,NULL,NULL,'2026-05-08 15:46:12','/uploads/1778255474718-716228895.jpg');

-- FEATURES
INSERT INTO features (feature_id, feature_name)
VALUES
(7,'Balcony'),
(4,'Central AC'),
(9,'Elevator'),
(10,'Furnished'),
(3,'Garage'),
(8,'Garden'),
(6,'Ocean View'),
(5,'Security Cameras'),
(2,'Smart Home'),
(1,'Swimming Pool');

-- PROPERTIES
INSERT INTO properties
(property_id, owner_id, title, description, property_type, bedrooms, bathrooms, area, created_at, updated_at)
VALUES
(5,4,'Modern Apartment in New Cairoo','Spacious apartment with modern finishing, balcony, and great natural light.','Apartment',3,2,180.00,'2026-04-19 17:39:58','2026-05-07 18:21:42'),
(7,4,'Modern Smart Villa in New Capital','Luxury smart villa with private pool, garden, and modern design in the New Administrative Capital.','Villa',4,3,320.00,'2026-04-19 17:51:40','2026-04-19 17:51:40'),
(12,5,'Modern Apartment in New Cairo','A fully finished modern apartment in a prime location close to services and main roads.','Apartment',3,2,160.00,'2026-04-21 11:26:22','2026-04-21 11:26:22'),
(13,5,'Cozy Studio near the Sea','A cozy furnished studio perfect for students or singles, close to the beach.','Studio',1,1,60.00,'2026-04-21 11:26:46','2026-04-21 11:26:46'),
(14,5,'Penthouse with Panoramic View','Elegant penthouse with a large terrace and stunning open city view.','Penthouse',4,3,300.00,'2026-04-21 11:27:48','2026-04-21 11:27:48'),
(15,6,'Affordable Apartment for Small Family','Budget-friendly apartment suitable for a small family in a lively area.','Apartment',2,1,100.00,'2026-04-21 11:28:29','2026-04-21 11:28:29'),
(16,6,'Finished Apartment with Installment Plan','A stylish finished apartment available with a flexible installment payment plan.','Apartment',3,2,145.00,'2026-04-21 11:29:12','2026-04-21 11:29:12'),
(32,10,'Modern Apartment in New Cairo','Bright modern apartment located in a prime location in New Cairo with spacious layout and natural light.','Apartment',2,1,1200.00,'2026-05-09 17:40:42','2026-05-09 17:40:42'),
(33,4,'Modern Apartment in Fifth Settlement','Bright 2-bedroom apartment in a prime New Cairo location with modern finishing and balcony view.','Apartment',4,2,1600.00,'2026-05-09 17:54:35','2026-05-09 17:54:35');

-- LISTINGS
INSERT INTO listings
(listing_id, property_id, purpose, price, status, views, closed_to, created_at)
VALUES
(3,5,'Sale',3200000.00,'Active',0,NULL,'2026-04-19 17:39:58'),
(5,7,'Sale',6800000.00,'Active',0,NULL,'2026-04-19 17:51:40'),
(10,12,'Sale',2500000.00,'Active',0,NULL,'2026-04-21 11:26:22'),
(11,13,'Rent',4000.00,'Active',0,NULL,'2026-04-21 11:26:46'),
(12,14,'Rent',20000.00,'Active',0,NULL,'2026-04-21 11:27:48'),
(13,15,'Rent',3500.00,'Active',0,NULL,'2026-04-21 11:28:29'),
(14,16,'Installment',1800000.00,'Active',0,NULL,'2026-04-21 11:29:12'),
(29,32,'Sale',2500000.00,'Active',0,NULL,'2026-05-09 17:40:42');

-- PROPERTY FEATURES
INSERT INTO property_features (property_id, feature_id)
VALUES
(5,1),(12,1),(13,1),(15,1),
(12,2),(14,2),(16,2),
(5,3),(7,3),(12,3),(14,3),(16,3),
(5,5),(7,5),(15,5),
(13,6),(16,6),
(7,7),(14,7),(32,7),(33,7),
(7,8),(32,8),(33,8),
(32,10);

-- PROPERTY LOCATIONS
INSERT INTO property_locations
(location_id, property_id, city, address)
VALUES
(3,5,'Cairo','New Cairo - Fifth Settlement'),
(5,7,'Cairo','New Administrative Capital - R7'),
(10,12,'Cairo','Fifth Settlement, New Cairo'),
(11,13,'Alexandria','Stanley Area'),
(12,14,'Cairo','Nasr City'),
(13,15,'Giza','Faisal Street'),
(14,16,'6th of October','October Gardens'),
(30,32,'New Cairo','New Administrative Capital – R7'),
(31,33,'New Cairo','New Cairo – Fifth Settlement');

-- PROPERTY IMAGES
INSERT INTO property_images
(image_id, property_id, image_url, is_primary)
VALUES
(14,7,'https://images.unsplash.com/photo-1613977257363-707ba9348227',1),
(15,7,'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',0),
(16,7,'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d',0),
(17,7,'https://images.unsplash.com/photo-1600573472550-8090b5e0745e',0),
(24,12,'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',1),
(25,12,'https://images.unsplash.com/photo-1507089947368-19c1da9775ae',0),
(26,13,'https://images.unsplash.com/photo-1493809842364-78817add7ffb',1),
(27,13,'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',0),
(28,14,'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',1),
(29,14,'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde',0),
(30,15,'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',1),
(31,15,'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',0),
(32,16,'https://images.unsplash.com/photo-1484154218962-a197022b5858',1),
(33,16,'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',0),
(82,5,'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',1),
(83,5,'https://images.unsplash.com/photo-1493809842364-78817add7ffb',0),
(84,5,'https://images.unsplash.com/photo-1484154218962-a197022b5858',0),
(85,5,'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',0),
(93,32,'/uploads/1778348441819-584496948.jpg',1),
(94,33,'/uploads/1778349275888-502822641.jpg',1),
(95,33,'/uploads/1778349275937-957463011.jpg',0);