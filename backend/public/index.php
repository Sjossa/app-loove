<?php
require_once __DIR__ . '/../vendor/autoload.php';

use backend\config\Database;
use backend\core\Router;
use backend\Controllers\UserController;
use backend\Controllers\UploadController;

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '\..');
$dotenv->load();


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

try {

  $database = new Database();


  $router = new Router($_SERVER['REQUEST_URI'], $database);

  $router->group('/users', function ($router) use ($database) {
    $userController = new UserController($database);

    $router->get('', [$userController, 'index']);
    $router->post('/create', [$userController, 'create']);
    $router->post('/login', [$userController, 'login']);
    $router->post('/profil', [$userController, 'profil']);
  });

  $router -> group('upload', function($router) {
    $UploadController = new UploadController();

    $router->get('', [$UploadController,'photo']);


  });


  $router->run();

} catch (Exception $e) {
  echo 'Erreur : ' . $e->getMessage();
}

