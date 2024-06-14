-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-06-2024 a las 19:26:33
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `urbano97`
--
CREATE DATABASE IF NOT EXISTS `urbano97` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `urbano97`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `ID` int(11) NOT NULL,
  `Nombre` varchar(50) DEFAULT NULL,
  `Apellido` varchar(50) DEFAULT NULL,
  `Direccion` varchar(100) DEFAULT NULL,
  `Telefono` varchar(20) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Contrasenya` varchar(100) DEFAULT NULL,
  `tipoUsuario` enum('admin','cliente') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`ID`, `Nombre`, `Apellido`, `Direccion`, `Telefono`, `Email`, `Contrasenya`, `tipoUsuario`) VALUES
(8, 'josemi', 'argiles', 'tu calle 2', '667656765', '222', '$2b$10$cwnk2XVqjNGB.WS/nTRrV.o3kh2SrEMvz2QwqLSXAegQ.9fuD.u/y', 'admin'),
(10, 'mario', 'mario1', 'marioº', '23424242342', 'samuelsenen@gmail.com', '$2b$10$3ztdMnkNB8AlPZ/jqJE02e9O/C8qZe1iVUMDI.skEmsMU4cdkQKr2', NULL),
(12, 'samuel', 'senen', 'rewerw', '3423423', 'pto.sanjay@gmail.com', '$2b$10$Vq4ypDwExB9So6vDvtJMpeq6qSBka.tBFU4RzdEUVjSv2EPxAoxGK', NULL),
(13, 'samuel', 'samuel', 'samuel', '444444444', 'samuel@gmail.com', '$2b$10$/XjC3fZKbnvx1W4FtWPxXugbBtGjTh7gho1Oj11UF1yJ0UN3jgupO', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horas_disponibles`
--

CREATE TABLE `horas_disponibles` (
  `id` int(11) NOT NULL,
  `id_peluquero` int(11) DEFAULT NULL,
  `horas` varchar(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `horas_disponibles`
--

INSERT INTO `horas_disponibles` (`id`, `id_peluquero`, `horas`) VALUES
(1, 1, '9:00'),
(2, 1, '9:40'),
(3, 1, '10:20'),
(4, 1, '11:00'),
(5, 1, '11:40'),
(6, 1, '12:20'),
(7, 1, '13:00'),
(8, 1, '13:40'),
(9, 2, '09:00'),
(10, 2, '09:40'),
(11, 2, '10:20'),
(12, 2, '11:00'),
(13, 2, '11:40'),
(14, 2, '12:20'),
(15, 2, '13:00'),
(16, 2, '13:40'),
(17, 3, '09:00'),
(18, 3, '09:40'),
(19, 3, '10:20'),
(20, 3, '11:00'),
(21, 3, '11:40'),
(22, 3, '12:20'),
(23, 3, '13:00'),
(24, 3, '13:40');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `peluqueros`
--

CREATE TABLE `peluqueros` (
  `ID` int(11) NOT NULL,
  `Nombre` varchar(50) DEFAULT NULL,
  `Apellido` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `peluqueros`
--

INSERT INTO `peluqueros` (`ID`, `Nombre`, `Apellido`) VALUES
(1, 'Samuel', NULL),
(2, 'Julian', NULL),
(3, 'Mario', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

CREATE TABLE `reservas` (
  `ID` int(11) NOT NULL,
  `EstadoReserva` enum('pendiente','confirmada','cancelada','completada') DEFAULT NULL,
  `QRReserva` varchar(100) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `id_peluquero` int(11) DEFAULT NULL,
  `reserva` varchar(100) DEFAULT NULL,
  `id_cliente` int(11) DEFAULT NULL,
  `hora` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reservas`
--

INSERT INTO `reservas` (`ID`, `EstadoReserva`, `QRReserva`, `fecha`, `id_peluquero`, `reserva`, `id_cliente`, `hora`) VALUES
(35, 'pendiente', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQQAAAEECAYAAADOCEoKAAAAAklEQVR4AewaftIAABBdSURBVO3BQW', '2024-06-20', 3, '{\"id_peluquero\":3,\"id_cliente\":10,\"hora\":\"13:40\",\"fecha\":\"2024-06-20\",\"numero_aleatorio\":100}', 10, '13:40'),
(36, 'pendiente', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQQAAAEECAYAAADOCEoKAAAAAklEQVR4AewaftIAABA7SURBVO3BQY', '2024-06-20', 3, '{\"id_peluquero\":3,\"id_cliente\":10,\"hora\":\"13:40\",\"fecha\":\"2024-06-20\",\"numero_aleatorio\":368}', 10, '13:40');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `horas_disponibles`
--
ALTER TABLE `horas_disponibles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `peluqueros`
--
ALTER TABLE `peluqueros`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `horas_disponibles`
--
ALTER TABLE `horas_disponibles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `peluqueros`
--
ALTER TABLE `peluqueros`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
