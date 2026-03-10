<?php
// Sempre retornar JSON e capturar erros/fatals como JSON
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', '0');
error_reporting(E_ALL);

set_error_handler(function($severity, $message, $file, $line) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'PHP Error', 'message' => $message]);
    exit;
});

register_shutdown_function(function() {
    $err = error_get_last();
    if ($err && ($err['type'] & (E_ERROR | E_PARSE | E_CORE_ERROR | E_COMPILE_ERROR))) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => 'Fatal error', 'message' => $err['message']]);
        exit;
    }
});

require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Aceita acesso via /api/cars (com .htaccess) ou direto ao api.php
// Não precisa validar a URI, aceita qualquer requisição ao arquivo

$id = isset($_GET['id']) ? intval($_GET['id']) : null;

if ($method === 'GET') {
    try {
        if ($id) {
            $stmt = $pdo->prepare('SELECT * FROM cars WHERE id = ?');
            $stmt->execute([$id]);
            $car = $stmt->fetch();
            if ($car) {
                // Decodificar JSONs
                if (isset($car['gallery'])) $car['gallery'] = json_decode($car['gallery'], true);
                if (isset($car['specs'])) $car['specs'] = json_decode($car['specs'], true);
                // Normaliza brand_logo para indicar ausência de imagem apenas se realmente estiver vazio
                // Preserva valores válidos (incluindo URLs e caminhos)
                if (!isset($car['brand_logo']) || $car['brand_logo'] === null) {
                    $car['brand_logo'] = 'not image';
                } else {
                    $trimmed = trim($car['brand_logo']);
                    if ($trimmed === '') {
                        $car['brand_logo'] = 'not image';
                    }
                    // Caso contrário, mantém o valor original (pode ser URL ou caminho)
                }
                echo json_encode($car);
            } else {
                http_response_code(404); 
                echo json_encode(['error' => 'Not found']);
            }
            exit;
        }

        $stmt = $pdo->query('SELECT * FROM cars ORDER BY id DESC');
        $cars = $stmt->fetchAll();
        // Decodificar JSONs em cada carro
        foreach ($cars as &$car) {
            if (isset($car['gallery'])) $car['gallery'] = json_decode($car['gallery'], true);
            if (isset($car['specs'])) $car['specs'] = json_decode($car['specs'], true);
            // Normaliza brand_logo para indicar ausência de imagem apenas se realmente estiver vazio
            // Preserva valores válidos (incluindo URLs e caminhos)
            if (!isset($car['brand_logo']) || $car['brand_logo'] === null) {
                $car['brand_logo'] = 'not image';
            } else {
                $trimmed = trim($car['brand_logo']);
                if ($trimmed === '') {
                    $car['brand_logo'] = 'not image';
                }
                // Caso contrário, mantém o valor original (pode ser URL ou caminho)
            }
        }
        echo json_encode($cars);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error', 'message' => $e->getMessage()]);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Server error', 'message' => $e->getMessage()]);
        exit;
    }
}

if ($method === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON']);
            exit;
        }

        $make = $data['make'] ?? null;
        $model = $data['model'] ?? null;
        $year = isset($data['year']) && $data['year'] !== '' ? intval($data['year']) : null;
        $price = isset($data['price']) && $data['price'] !== '' ? floatval($data['price']) : null;
        $category = $data['category'] ?? 'luxury';
        // Normaliza brand_logo: trim e, se vazio, usar placeholder 'not image'
        $brand_logo = isset($data['brand_logo']) ? trim($data['brand_logo']) : '';
        if ($brand_logo === '') {
            $brand_logo = 'not image';
        }
        $gallery = isset($data['gallery']) ? json_encode($data['gallery']) : null;
        $specs = isset($data['specs']) ? json_encode($data['specs']) : null;
        // Normaliza featured para 0 ou 1 (aceita boolean, strings 'true'/'false', '1'/'0', inteiros)
        $featuredRaw = $data['featured'] ?? null;
        $featured = 0;
        if ($featuredRaw === true || $featuredRaw === 1 || $featuredRaw === '1' || $featuredRaw === 'true') {
            $featured = 1;
        }
        $description = $data['description'] ?? null;

        // Agora o ano também é obrigatório
        if (!$make || !$model || $year === null) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing fields', 'message' => 'make, model and year are required']);
            exit;
        }

        // Validação simples do ano
        if ($year < 1900 || $year > 2100) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid field', 'message' => 'year must be between 1900 and 2100']);
            exit;
        }

        $stmt = $pdo->prepare('INSERT INTO cars (make, model, year, price, category, brand_logo, gallery, specs, featured, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([$make, $model, $year, $price, $category, $brand_logo, $gallery, $specs, $featured, $description]);
        $newId = $pdo->lastInsertId();
        http_response_code(201);
        echo json_encode(['id' => (int)$newId]);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        error_log('POST /api/cars error: ' . $e->getMessage());
        echo json_encode(['error' => 'Database error', 'message' => $e->getMessage()]);
        exit;
    } catch (Throwable $e) {
        http_response_code(500);
        error_log('POST /api/cars unexpected error: ' . $e->getMessage());
        echo json_encode(['error' => 'Server error', 'message' => $e->getMessage()]);
        exit;
    }
}

if ($method === 'PUT') {
    try {
        if (!$id) { http_response_code(400); echo json_encode(['error'=>'Missing id']); exit; }
        $data = json_decode(file_get_contents('php://input'), true);
        if (!is_array($data)) { http_response_code(400); echo json_encode(['error'=>'Invalid JSON']); exit; }

        // Busca o carro atual para preservar valores não fornecidos
        $stmtCurrent = $pdo->prepare('SELECT brand_logo FROM cars WHERE id = ?');
        $stmtCurrent->execute([intval($id)]);
        $currentCar = $stmtCurrent->fetch();
        $currentBrandLogo = $currentCar ? ($currentCar['brand_logo'] ?? null) : null;

        $make = $data['make'] ?? null;
        $model = $data['model'] ?? null;
        $year = isset($data['year']) ? intval($data['year']) : null;
        $price = isset($data['price']) ? floatval($data['price']) : null;
        $category = $data['category'] ?? 'luxury';
        
        // Preserva brand_logo original se não foi fornecido
        // Se o campo não foi enviado no JSON, mantém o valor original do banco
        if (isset($data['brand_logo'])) {
            $brand_logo = trim($data['brand_logo']);
            // Se foi enviado vazio explicitamente, preserva o valor original
            if ($brand_logo === '') {
                $brand_logo = $currentBrandLogo;
            }
            // Se ainda estiver vazio após preservar, usa placeholder
            if ($brand_logo === null || $brand_logo === '') {
                $brand_logo = 'not image';
            }
        } else {
            // Se não foi enviado no JSON, preserva o valor original do banco
            $brand_logo = $currentBrandLogo;
            // Se o valor original também for vazio, usa placeholder
            if ($brand_logo === null || $brand_logo === '') {
                $brand_logo = 'not image';
            }
        }
        
        $gallery = isset($data['gallery']) ? json_encode($data['gallery']) : null;
        $specs = isset($data['specs']) ? json_encode($data['specs']) : null;
        $featured = isset($data['featured']) ? (bool)$data['featured'] : false;
        $description = $data['description'] ?? null;

        // validações mínimas: agora o ano também é obrigatório
        if (!$make || !$model || $year === null) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing fields', 'message' => 'make, model and year are required']);
            exit;
        }

        if ($year < 1900 || $year > 2100) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid field', 'message' => 'year must be between 1900 and 2100']);
            exit;
        }

        $stmt = $pdo->prepare('UPDATE cars SET make = ?, model = ?, year = ?, price = ?, category = ?, brand_logo = ?, gallery = ?, specs = ?, featured = ?, description = ? WHERE id = ?');
        $stmt->execute([$make, $model, $year, $price, $category, $brand_logo, $gallery, $specs, $featured ? 1 : 0, $description, intval($id)]);
        echo json_encode(['ok' => true]);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        error_log('PUT /api/cars error: ' . $e->getMessage());
        echo json_encode(['error' => 'Database error', 'message' => $e->getMessage()]);
        exit;
    } catch (Throwable $e) {
        http_response_code(500);
        error_log('PUT /api/cars unexpected error: ' . $e->getMessage());
        echo json_encode(['error' => 'Server error', 'message' => $e->getMessage()]);
        exit;
    }
}

if ($method === 'DELETE') {
    if (!$id) { http_response_code(400); echo json_encode(['error'=>'Missing id']); exit; }
    $stmt = $pdo->prepare('DELETE FROM cars WHERE id = ?');
    $stmt->execute([$id]);
    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
