-- Comandos SQL para crear la base de datos y tabla de productos
-- Ejecutar estos comandos en phpMyAdmin o MySQL Workbench

CREATE DATABASE IF NOT EXISTS taller_productos;

USE taller_productos;

CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  categoria VARCHAR(50) NOT NULL
);

-- Datos de ejemplo (opcional)
INSERT INTO productos (nombre, precio, categoria) VALUES
('Laptop HP', 899.99, 'Electrónicos'),
('Mesa de Oficina', 150.00, 'Muebles'),
('Auriculares Bluetooth', 45.99, 'Electrónicos'),
('Silla Ergonómica', 200.00, 'Muebles');

-- Para solucionar el problema de autenticación en XAMPP:
-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
-- FLUSH PRIVILEGES;