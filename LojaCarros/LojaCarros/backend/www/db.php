<?php
// db.php: tenta conectar usando variáveis de ambiente (para Docker) e
// faz fallback automático para uma conexão local típica do XAMPP (127.0.0.1, root, senha vazia).

$envHost = getenv('DB_HOST');
$envDb   = getenv('DB_NAME');
$envUser = getenv('DB_USER');
$envPass = getenv('DB_PASS');
$charset = 'utf8mb4';

$hostsToTry = [];
// Prioriza as variáveis de ambiente (úteis em Docker)
if ($envHost) {
    $hostsToTry[] = ['host' => $envHost, 'db' => $envDb ?: 'lojacarros', 'user' => $envUser ?: 'user', 'pass' => $envPass ?: 'password'];
} else {
    // Configuração padrão do projeto (container)
    $hostsToTry[] = ['host' => 'db', 'db' => 'lojacarros', 'user' => 'user', 'pass' => 'password'];
}

// Fallback para ambientes XAMPP/localhost (comum em desenvolvimento local)
$hostsToTry[] = ['host' => '127.0.0.1', 'db' => 'lojacarros', 'user' => 'root', 'pass' => ''];
$hostsToTry[] = ['host' => 'localhost', 'db' => 'lojacarros', 'user' => 'root', 'pass' => ''];

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

$lastException = null;
foreach ($hostsToTry as $cfg) {
    $host = $cfg['host'];
    $db   = $cfg['db'];
    $user = $cfg['user'];
    $pass = $cfg['pass'];

    // Primeiro tenta conectar ao servidor (sem especificar database)
    $dsnServer = "mysql:host=$host;charset=$charset";
    try {
        $pdoServer = new PDO($dsnServer, $user, $pass, $options);
    } catch (Throwable $e) {
        $lastException = $e;
        // falha ao conectar ao servidor; tenta próximo host
        continue;
    }

    // Se conectou ao servidor, verifica se o database existe
    try {
        $stmt = $pdoServer->prepare('SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?');
        $stmt->execute([$db]);
        $found = $stmt->fetchColumn();
        if (!$found) {
            // Banco não existe no servidor conectado
            error_log("Database '{$db}' not found on host {$host}");
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'error' => 'Database not found',
                'message' => "O banco '{$db}' não existe no servidor MySQL em '{$host}'. Verifique se importou 'lojacarros.sql'.",
                'host' => $host
            ]);
            exit;
        }

        // Tudo ok: conecta com o database explicitamente e passa o $pdo
        $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
        $pdo = new PDO($dsn, $user, $pass, $options);
        break;
    } catch (Throwable $e) {
        $lastException = $e;
        continue;
    }
}

if (!isset($pdo) || !$pdo) {
    // Não conectou em nenhuma configuração
    $details = $lastException ? $lastException->getMessage() : 'unknown';
    error_log('Database connection error: ' . $details);
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'error' => 'Database connection failed',
        'message' => 'Não foi possível conectar ao servidor MySQL. Verifique se o serviço está rodando e as credenciais (host/user/password).',
        'details' => $details
    ]);
    exit;
}
