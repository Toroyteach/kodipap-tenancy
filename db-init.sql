CREATE DATABASE IF NOT EXISTS aowleads_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'laravel_user'@'%' IDENTIFIED BY 'securepassword';
GRANT ALL PRIVILEGES ON *.* TO 'laravel_user'@'%';

FLUSH PRIVILEGES;
