-- Garantir que o banco e a conexão usem UTF-8 (utf8mb4) para evitar problemas de acentuação
CREATE DATABASE IF NOT EXISTS lojacarros CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lojacarros;
-- Força o cliente a usar UTF-8 ao executar este script
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS cars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INT NULL,
  price DECIMAL(10,2) NULL,
  category ENUM('luxury','sports','suv','limited') NOT NULL DEFAULT 'luxury',
  brand_logo VARCHAR(255) NULL,
  gallery JSON NULL,
  specs JSON NULL,
  featured BOOLEAN DEFAULT FALSE,
  description TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Carros de exemplo com descrições fornecidas pelo usuário
INSERT INTO cars (make, model, year, price, category, featured, description, brand_logo) VALUES
('Rolls-Royce', 'Cullinan - LINEA D`ARABO', 2025, 650000.00, 'limited', TRUE, 'Um SUV que combina luxo absoluto com inspiração oriental em seus detalhes exclusivos.\nInterior artesanal com materiais nobres que elevam o conforto a outro nível.\nUma presença imponente que traduz exclusividade e sofisticação.', 'https://www.mansory.com/media/catalog/product/c/u/cullinan-linea-d-arabo-mansory.jpg'),
('Ferrari', 'Purosangue - Pugnator', 2025, 850000.00, 'sports', TRUE, 'A Purosangue Pugnator une força e elegância em um design que exala esportividade.\nSeu desempenho afiado entrega uma sensação de direção visceral.\nPerfeita para quem busca potência sem abrir mão do luxo.', 'https://www.mansory.com/media/catalog/product/p/u/purosangue-pugnator-mansory.jpg'),
('Lamborghini', 'Urus SE - Venatus', 2025, 420000.00, 'suv', TRUE, 'A versão Venatus transforma o Urus em uma obra agressiva e futurista.\nLinhas marcantes e detalhes aerodinâmicos reforçam sua personalidade ousada.\nDesempenho brutal aliado a uma estética de tirar o fôlego.', 'https://www.mansory.com/media/catalog/product/u/r/urus-venatus-mansory.jpg'),
('Mercedes-Benz', 'AMG G63 - Grande P820', 2025, 580000.00, 'limited', TRUE, 'Um ícone do off-road convertido em luxo extremo com a edição Grande Entrée.\nO conjunto P820 traduz potência pura e presença marcante em qualquer lugar.\nInterior refinado que mistura tradição AMG com exclusividade artesanal.', 'https://www.mansory.com/media/catalog/product/g/6/g63-grande-entree-mansory.jpg'),
('Rolls-Royce', 'Phantom - Linea D`ORO', 2024, 980000.00, 'limited', FALSE, 'A Linea D''ORO adiciona detalhes dourados que elevam o Phantom a outro patamar de elegância.\nConforto absoluto, silenciamento perfeito e presença majestosa.\nCriado para quem exige o mais alto padrão de luxo no mundo automotivo.', 'https://www.mansory.com/media/catalog/product/p/h/phantom-linea-oro-mansory.jpg'),
('Ferrari', '812 GTS - Stallone', 2022, 750000.00, 'sports', FALSE, 'A versão Stallone destaca um visual ainda mais esportivo e musculoso.\nSeu V12 entrega uma experiência sonora e emocional incomparável.\nUm conversível criado para quem busca adrenalina e exclusividade.', 'https://www.mansory.com/media/catalog/product/8/1/812-gts-stallone-mansory.jpg'),
('Ferrari', '12 Cilindri - Equestre', 2024, 920000.00, 'sports', FALSE, 'Uma obra-prima moderna que celebra o lendário motor V12 da Ferrari.\nA edição Equestre traz curvas refinadas e postura elegante.\nMistura de tradição, força e desempenho puro.', 'https://www.mansory.com/media/catalog/product/1/2/12-cilindri-equestre-mansory.jpg'),
('Rolls-Royce', 'Spectre by MANSORY', 2024, 680000.00, 'luxury', FALSE, 'O primeiro super coupé elétrico da Rolls-Royce, elevado pela Mansory a outro nível.\nDesign ousado, materiais premium e personalização extrema.\nSilencioso, poderoso e incrivelmente luxuoso.', 'https://www.mansory.com/media/catalog/product/s/p/spectre-mansory.jpg'),
('Lamborghini', 'Urus - Venatus P900', 2022, 380000.00, 'suv', FALSE, 'A Mansory transforma o Urus em um super-SUV com aerodinâmica agressiva.\nO kit P900 entrega força absurda e visual intimidador.\nUm modelo para quem deseja destaque e performance acima do comum.', 'https://www.mansory.com/media/catalog/product/u/r/urus-venatus-p900-mansory.jpg'),
('Mercedes-Benz', 'AMG G63 - Mansory P720', 2022, 350000.00, 'suv', FALSE, 'A Mansory eleva o G63 a um patamar de luxo esportivo exclusivo.\nO pacote P720 reforça potência e presença visual marcante.\nIdeal para quem busca um SUV forte, imponente e personalizado.', 'https://www.mansory.com/media/catalog/product/g/6/g63-mansory-p720.jpg'),
('Rolls-Royce', 'Cullinan - EMPEROR', 2025, 720000.00, 'luxury', FALSE, 'O Cullinan EMPEROR exala autoridade e requinte em cada detalhe.\nAcabamentos exclusivos criam uma atmosfera de luxo absoluto.\nPara quem deseja o mais imponente SUV de ultraluxo.', 'https://www.mansory.com/media/catalog/product/c/u/cullinan-emperor-mansory.jpg'),
('Rolls-Royce', 'Ghost by MANSORY', 2023, 520000.00, 'luxury', FALSE, 'O Ghost recebe um toque mais esportivo e agressivo com a assinatura Mansory.\nDetalhes artesanais transformam o clássico em uma obra moderna.\nUm sedã luxuoso que combina conforto extremo com presença marcante.', 'https://www.mansory.com/media/catalog/product/g/h/ghost-mansory.jpg');