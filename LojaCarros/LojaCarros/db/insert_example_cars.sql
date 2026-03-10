-- Script para inserir carros de exemplo no phpMyAdmin
-- Use este script se a tabela já existe e você quer apenas adicionar os dados

USE lojacarros;

-- Limpar dados existentes (opcional - descomente se quiser limpar antes de inserir)
-- TRUNCATE TABLE cars;

-- Inserir carros de exemplo inspirados na Mansory
INSERT INTO cars (make, model, year, price, category, featured, description, brand_logo) VALUES
('Rolls-Royce', 'Cullinan - LINEA D`ARABO', 2025, 650000.00, 'limited', TRUE, 'Rolls-Royce Cullinan com edição especial MANSORY LINEA D`ARABO. Atelier completo com kit de corpo largo (Full body kit), edição limitada e única (One of one). SUV de alto luxo com 571 HP, transmissão automática.', 'assets/RR-Cullinan.webp'),
('Ferrari', 'Purosangue - Pugnator', 2025, 850000.00, 'sports', TRUE, 'Ferrari Purosangue transformada em Pugnator by MANSORY. Atelier com kit de corpo largo completo, SUV esportivo com 755 HP. Uma obra-prima única de engenharia automotiva.', 'assets/Purosangue.webp'),
('Lamborghini', 'Urus SE - Venatus', 2025, 420000.00, 'suv', TRUE, 'Lamborghini Urus SE convertida em Venatus by MANSORY. Kit de corpo largo completo do Atelier. SUV superesportivo com 1100 HP, transmissão automática.', 'assets/UrusSE.webp'),
('Mercedes-Benz', 'AMG G63 - Grande Entrée P820', 2025, 580000.00, 'limited', TRUE, 'Mercedes-AMG G63 MANSORY Grande Entrée P820 - Edição limitada 1 de 8. Atelier completo com kit de corpo largo. SUV de luxo extremo com 820 HP, transmissão automática.', 'assets/AMG-G63.webp'),
('Rolls-Royce', 'Phantom - Linea D`ORO', 2024, 980000.00, 'limited', FALSE, 'Rolls-Royce Phantom com edição especial MANSORY Linea D`ORO. Atelier com kit suave e edição limitada. Sedan de luxo máximo com 571 HP, transmissão automática, apenas 100 km rodados.', 'assets/RR-Phantom.webp'),
('Ferrari', '812 GTS - Stallone', 2022, 750000.00, 'sports', FALSE, 'Ferrari 812 GTS transformada em Stallone by MANSORY. Atelier com kit suave. Conversível esportivo com 830 HP, apenas 1000 km rodados.', 'assets/812GTS.webp'),
('Ferrari', '12 Cilindri - Equestre', 2024, 920000.00, 'sports', FALSE, 'Ferrari 12 Cilindri convertida em Equestre by MANSORY. Atelier com peças adicionais e kit suave. Coupe esportivo com 855 HP, transmissão automática, 500 km rodados.', 'assets/12Cilindri.webp'),
('Rolls-Royce', 'Spectre by MANSORY', 2024, 680000.00, 'luxury', FALSE, 'Rolls-Royce Spectre transformado por MANSORY. Atelier com kit suave. Coupe elétrico de luxo com 450 HP, apenas 100 km rodados.', 'assets/RR-Spectre.webp'),
('Lamborghini', 'Urus - Venatus P900', 2022, 380000.00, 'suv', FALSE, 'Lamborghini Urus convertida em Venatus P900 by MANSORY. Kit de corpo largo completo. SUV superesportivo com 900 HP, 27800 km rodados.', 'assets/Urus-P900.webp'),
('Mercedes-Benz', 'AMG G63 - Mansory P720', 2022, 350000.00, 'suv', FALSE, 'Mercedes-AMG G63 com conversão MANSORY P720. Kit de corpo largo completo. SUV de luxo com 720 HP, 8200 km rodados.', 'assets/G63-P720.webp'),
('Rolls-Royce', 'Cullinan - EMPEROR', 2025, 720000.00, 'luxury', FALSE, 'Rolls-Royce Cullinan convertida em EMPEROR by MANSORY. Atelier com kit suave. SUV de luxo extremo com 571 HP, transmissão automática, apenas 250 km rodados.', 'assets/RR-Cullinan.webp'),
('Rolls-Royce', 'Ghost by MANSORY', 2023, 520000.00, 'luxury', FALSE, 'Rolls-Royce Ghost transformada por MANSORY. Kit suave do Atelier. Sedan de luxo com 571 HP, 4300 km rodados.', 'assets/RR-Ghost.webp');

