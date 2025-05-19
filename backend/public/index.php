<?php
require_once __DIR__ . '/../vendor/autoload.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use backend\config\Database;
use backend\core\Router;
use backend\Controllers\UserController;
use backend\Controllers\UploadController;
use backend\core\jwt;

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '\..');
$dotenv->load();


$allowed_origin = 'https://app-loove.local';

header("Access-Control-Allow-Origin: $allowed_origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

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

  $router -> group('/upload', function($router) {
    $UploadController = new UploadController();

    $router->post('', [$UploadController,'photo']);
  });

  $router -> group('/jwt', function($router) {

    $jwt = new jwt();

    $router->get('', [$jwt,'jwt']);
  });




  $router->run();

} catch (Exception $e) {
  echo 'Erreur : ' . $e->getMessage();
}

