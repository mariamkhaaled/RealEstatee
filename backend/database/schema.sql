-- Active: 1776112129252@@127.0.0.1@3306@real_estate
DROP DATABASE IF EXISTS real_estate;
CREATE DATABASE real_estate;
USE real_estate;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('owner', 'customer', 'admin') NOT NULL,
    is_verified TINYINT(1) DEFAULT 0,
    otp_code VARCHAR(10) DEFAULT NULL, 
    token_expires TIMESTAMP NULL DEFAULT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE properties (
    property_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    property_type ENUM('Villa', 'Apartment', 'Penthouse', 'Studio') NOT NULL,
    bedrooms INT DEFAULT 0,
    bathrooms INT DEFAULT 0,
    area DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_property_owner
        FOREIGN KEY (owner_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE property_locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL UNIQUE,
    city VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    CONSTRAINT fk_location_property
        FOREIGN KEY (property_id) REFERENCES properties(property_id)
        ON DELETE CASCADE
);

CREATE TABLE listings (
    listing_id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    purpose ENUM('Sale', 'Rent', 'Installment') NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    status ENUM('Active', 'Pending', 'Sold', 'Rented', 'Closed') DEFAULT 'Active',
    views INT DEFAULT 0,
    closed_to VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_listing_property
        FOREIGN KEY (property_id) REFERENCES properties(property_id)
        ON DELETE CASCADE
);

CREATE TABLE property_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_image_property
        FOREIGN KEY (property_id) REFERENCES properties(property_id)
        ON DELETE CASCADE
);

CREATE TABLE features (
    feature_id INT AUTO_INCREMENT PRIMARY KEY,
    feature_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE property_features (
    property_id INT NOT NULL,
    feature_id INT NOT NULL,
    PRIMARY KEY (property_id, feature_id),
    CONSTRAINT fk_pf_property
        FOREIGN KEY (property_id) REFERENCES properties(property_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_pf_feature
        FOREIGN KEY (feature_id) REFERENCES features(feature_id)
        ON DELETE CASCADE
);

CREATE TABLE inquiries (
    inquiry_id INT AUTO_INCREMENT PRIMARY KEY,
    listing_id INT NOT NULL,
    customer_id INT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('Pending', 'Reviewed', 'Accepted', 'Rejected') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inquiry_listing
        FOREIGN KEY (listing_id) REFERENCES listings(listing_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_inquiry_customer
        FOREIGN KEY (customer_id) REFERENCES users(user_id)
        ON DELETE SET NULL
);

CREATE TABLE favorites (
    favorite_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    property_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (customer_id, property_id),
    CONSTRAINT fk_favorite_customer
        FOREIGN KEY (customer_id) REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_favorite_property
        FOREIGN KEY (property_id) REFERENCES properties(property_id)
        ON DELETE CASCADE
);

-- create messages table
CREATE TABLE messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    inquiry_id INT NOT NULL,
    CONSTRAINT fk_message_sender
        FOREIGN KEY (sender_id) REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_message_receiver
        FOREIGN KEY (receiver_id) REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_message_inquiry
    FOREIGN KEY (inquiry_id) REFERENCES inquiries(inquiry_id)
        ON DELETE CASCADE
);

INSERT INTO users (full_name, email, password_hash, phone, role, is_verified)
VALUES ('Test Owner', 'owner@test.com', '123456', '01000000000', 'owner', 0);