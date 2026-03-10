-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 31/10/2025 às 17:44
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `lojacarros`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `cars`
--

CREATE TABLE `cars` (
  `id` int(11) NOT NULL,
  `make` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `year` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `category` enum('luxury','sports','suv','limited') NOT NULL DEFAULT 'luxury',
  `brand_logo` varchar(255) DEFAULT NULL,
  `gallery` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`gallery`)),
  `specs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specs`)),
  `featured` tinyint(1) DEFAULT 0,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `cars`
--

INSERT INTO `cars` (`id`, `make`, `model`, `year`, `price`, `category`, `brand_logo`, `gallery`, `specs`, `featured`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Rolls-Royce', 'Cullinan - LINEA D`ARABO', 2025, 650000.00, 'limited', 'assets/RR-Cullinan.webp', NULL, NULL, 1, 'Rolls-Royce Cullinan com edição especial MANSORY LINEA D`ARABO. Atelier completo com kit de corpo largo (Full body kit), edição limitada e única (One of one). SUV de alto luxo com 571 HP, transmissão automática.', '2025-10-31 00:36:12', '2025-10-31 00:36:12'),
(2, 'Ferrari', 'Purosangue - Pugnator', 2025, 850000.00, 'sports', 'assets/Purosangue.webp', NULL, NULL, 1, 'Ferrari Purosangue transformada em Pugnator by MANSORY. Atelier com kit de corpo largo completo, SUV esportivo com 755 HP. Uma obra-prima única de engenharia automotiva.', '2025-10-31 00:36:12', '2025-10-31 00:36:12'),
(3, 'Lamborghini', 'Urus SE - Venatus', 2025, 420000.00, 'suv', 'assets/UrusSE.webp', NULL, NULL, 1, 'Lamborghini Urus SE convertida em Venatus by MANSORY. Kit de corpo largo completo do Atelier. SUV superesportivo com 1100 HP, transmissão automática.', '2025-10-31 00:36:12', '2025-10-31 00:36:12'),
(4, 'Mercedes-Benz', 'AMG G63 - Grande Entrée P820', 2025, 580000.00, 'limited', 'assets/AMG-G63.webp', NULL, NULL, 1, 'Mercedes-AMG G63 MANSORY Grande Entrée P820 - Edição limitada 1 de 8. Atelier completo com kit de corpo largo. SUV de luxo extremo com 820 HP, transmissão automática.', '2025-10-31 00:36:12', '2025-10-31 00:36:12'),
(5, 'Rolls-Royce', 'Phantom - Linea D`ORO', 2024, 980000.00, 'limited', 'assets/RR-Phantom.webp', NULL, NULL, 0, 'Rolls-Royce Phantom com edição especial MANSORY Linea D`ORO. Atelier com kit suave e edição limitada. Sedan de luxo máximo com 571 HP, transmissão automática, apenas 100 km rodados.', '2025-10-31 00:36:12', '2025-10-31 00:36:12'),
(6, 'Ferrari', '812 GTS - Stallone', 2022, 750000.00, 'sports', 'assets/812GTS.webp', NULL, NULL, 0, 'Ferrari 812 GTS transformada em Stallone by MANSORY. Atelier com kit suave. Conversível esportivo com 830 HP, apenas 1000 km rodados.', '2025-10-31 00:36:12', '2025-10-31 00:36:12'),
(7, 'Ferrari', '12 Cilindri - Equestre', 2024, 920000.00, 'sports', 'assets/12Cilindri.webp', NULL, NULL, 0, 'Ferrari 12 Cilindri convertida em Equestre by MANSORY. Atelier com peças adicionais e kit suave. Coupe esportivo com 855 HP, transmissão automática, 500 km rodados.', '2025-10-31 00:36:12', '2025-10-31 00:36:12'),
(8, 'Rolls-Royce', 'Spectre by MANSORY', 2024, 680000.00, 'luxury', 'assets/RR-Spectre.webp', NULL, NULL, 0, 'Rolls-Royce Spectre transformado por MANSORY. Atelier com kit suave. Coupe elétrico de luxo com 450 HP, apenas 100 km rodados.', '2025-10-31 00:36:12', '2025-10-31 00:36:12'),
(9, 'Lamborghini', 'Urus - Venatus P900', 2022, 380000.00, 'suv', 'assets/Urus-P900.webp', NULL, NULL, 0, 'Lamborghini Urus convertida em Venatus P900 by MANSORY. Kit de corpo largo completo. SUV superesportivo com 900 HP, 27800 km rodados.', '2025-10-31 00:36:12', '2025-10-31 00:36:12'),
(10, 'Mercedes-Benz', 'AMG G63 - Mansory P720', 2022, 350000.00, 'suv', 'assets/G63-P720.webp', NULL, NULL, 0, 'Mercedes-AMG G63 com conversão MANSORY P720. Kit de corpo largo completo. SUV de luxo com 720 HP, 8200 km rodados.', '2025-10-31 00:36:12', '2025-10-31 00:36:12'),
(11, 'Rolls-Royce', 'Cullinan - EMPEROR', 2025, 720000.00, 'luxury', 'assets/RR-Cullinan.webp', NULL, NULL, 0, 'Rolls-Royce Cullinan convertida em EMPEROR by MANSORY. Atelier com kit suave. SUV de luxo extremo com 571 HP, transmissão automática, apenas 250 km rodados.', '2025-10-31 00:36:12', '2025-10-31 00:36:12'),
(12, 'Rolls-Royce', 'Ghost by MANSORY', 2023, 520000.00, 'luxury', 'assets/RR-Ghost.webp', NULL, NULL, 0, 'Rolls-Royce Ghost transformada por MANSORY. Kit suave do Atelier. Sedan de luxo com 571 HP, 4300 km rodados.', '2025-10-31 00:36:12', '2025-10-31 00:36:12'),
(13, 'Tesla', 'Cybertruck', 2024, 420000.00, 'suv', 'https://cdn.prod.website-files.com/661d6e0d2e84ef511db18f17/68f220f7c4e233aa72cf1f1d_main.webp', NULL, NULL, 1, 'Tesla Cybertruck Elétrico', '2025-10-31 15:40:12', '2025-10-31 15:40:12');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `cars`
--
ALTER TABLE `cars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
