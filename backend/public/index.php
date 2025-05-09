<?php
// index.php

require_once __DIR__ . '/../vendor/autoload.php';

use backend\config\Database;
use backend\core\Router;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

$database = new Database();
$router = new Router($_SERVER['REQUEST_URI'], $database);

$router->group('/users', function ($router) use ($database) {
  $userController = new \backend\Controllers\UserController($database);
  $router->get('', [$userController, 'index']);
  $router->post('/create', [$userController, 'create']);
  $router->post('/login', [$userController, 'login']);
});

try {
  $router->run();
} catch (Exception $e) {
  echo 'Erreur : ' . $e->getMessage();
}
