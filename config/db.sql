-- Active: 1755252592225@@127.0.0.1@3306@power_tools
CREATE DATABASE power_tools;

USE power_tools;

SELECT DATABASE();

-- Admin table
CREATE TABLE admin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL,
    is_creator BOOLEAN NOT NULL
);

-- Tool table
CREATE TABLE tool (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tool_price DECIMAL(8,2) NOT NULL
);

-- User table
CREATE TABLE user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL,
    role ENUM('client', 'owner') NOT NULL,
    address VARCHAR(255) NOT NULL
);

-- District table
CREATE TABLE district (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Shop table
CREATE TABLE shop (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id BIGINT NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    district_id BIGINT NOT NULL,
    address VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES user(id),
    FOREIGN KEY (district_id) REFERENCES district(id)
);

-- Shop_Tool table (many-to-many: shop <-> tool)
CREATE TABLE shop_tool (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    shop_id BIGINT NOT NULL,
    tool_id BIGINT NOT NULL,
    rent_price DECIMAL(8,2) NOT NULL,
    FOREIGN KEY (shop_id) REFERENCES shop(id),
    FOREIGN KEY (tool_id) REFERENCES tool(id)
);

-- Order table
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT NOT NULL,
    shop_tool_id BIGINT NOT NULL,
    order_date DATE NOT NULL,
    period BIGINT NOT NULL,
    total_price DECIMAL(8,2) NOT NULL,
    FOREIGN KEY (client_id) REFERENCES user(id),
    FOREIGN KEY (shop_tool_id) REFERENCES shop_tool(id)
);
CREATE PROCEDURE getShopByDistrict(IN dname VARCHAR(50))
BEGIN
  SELECT 
    d.name AS district_name,
    s.name AS shop_name
  FROM 
    district d
  LEFT JOIN 
    shop s ON s.district_id = d.id
  WHERE 
    d.name LIKE CONCAT('%', dname, '%');
END

CALL `getShopByDistrict`('sergeli')

CREATE PROCEDURE getShopByOwner(IN ownerName VARCHAR(50))
BEGIN
  SELECT 
    u.name AS owner_name,
    s.name AS shop_name,
    d.name AS district_name
  FROM 
    user u
  LEFT JOIN 
    shop s ON s.owner_id = u.id
  LEFT JOIN 
    district d ON s.district_id = d.id
  WHERE 
    u.name LIKE CONCAT('%', ownerName, '%');
END

CALL getShopByOwner('Ali');