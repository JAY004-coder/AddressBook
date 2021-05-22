Create User TABLE
CREATE TABLE `AddressBook`.`users` ( `user_id` INT NOT NULL AUTO_INCREMENT , `email` VARCHAR(100) NOT NULL , `name` VARCHAR(100) NOT NULL , `gender` VARCHAR(1) NOT NULL , `password` VARCHAR(256) NOT NULL ,`profile_url` VARCHAR(255)  DEFAULT NULL , PRIMARY KEY (`user_id`)) ENGINE = InnoDB

Create AddressBook
CREATE TABLE `AddressBook`.`address` ( `address_id` INT NOT NULL AUTO_INCREMENT , `user_id` INT NOT NULL , `title` VARCHAR(100) NOT NULL , `addressLine1` VARCHAR(256) NULL DEFAULT NULL , `addressLine2` VARCHAR(256) NULL DEFAULT NULL , `country` VARCHAR(50) NULL DEFAULT NULL , `state` VARCHAR(50) NULL DEFAULT NULL , `city` VARCHAR(50) NULL DEFAULT NULL , `pincode` VARCHAR(10) NULL DEFAULT NULL , `is_deleted` VARCHAR(10) NULL DEFAULT 0 , PRIMARY KEY (`address_id`)) ENGINE = InnoDB;
