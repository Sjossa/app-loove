<?php


require_once __DIR__ . '/../vendor/autoload.php';


use backend\config\Database;
use backend\Core\Router;
use backend\Controllers\UserController;
use backend\Controllers\UploadController;
use backend\Controllers\ProfilController;
use backend\Controllers\MatchController;
use backend\Controllers\TchatController;


use backend\Core\Jeton;
use Dotenv\Dotenv;

// -----------------------------
// Configuration des erreurs PHP
// -----------------------------

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ----------------------
// Chargement du .env
// ----------------------

$dotenv = Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();

// --------------------------------------------
// Configuration CORS pour autoriser le frontend
// --------------------------------------------


$allowed_origin = 'https://meetlink.local'; // domaine frontend

if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === $allowed_origin) {
  header("Access-Control-Allow-Origin: $allowed_origin");
  header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type, Authorization");
  header("Access-Control-Allow-Credentials: true");
}

// Réponse directe aux requêtes OPTIONS (prévols CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

// ----------------------
// Lancement de l'application
// ----------------------

try {
  $database = new Database();
  $router = new Router($_SERVER['REQUEST_URI'], $database);

  // Groupe : /users
  $router->group('/users', function ($router) use ($database) {
    $userController = new UserController($database);

    $router->post('/create', [$userController, 'create']);
    $router->post('/login', [$userController, 'login']);
    $router->post('/profil', [$userController, 'profil']);
    $router->post('/update', [$userController, 'update']);
  });

  // Groupe : /upload
  $router->group('/upload', function ($router) {
    $uploadController = new UploadController();
    $router->post('', [$uploadController, 'photo']);
  });

  // Groupe : /profil
  $router->group('/profil', function ($router) {
    $profil = new ProfilController();
    $router->post('', [$profil, 'VerificationToken']);
  });


  //Froupe : /Match
  $router->group('/match', function ($router) use ($database) {
    $matchController = new MatchController($database);
    $router->post('', [$matchController, 'profilGenerate']);
    $router->post('like', [$matchController, 'like']);
    $router->post('dislike', [$matchController, 'dislike']);
  });

  //groupe : /tchat
  $router->group('/tchat', function ($router) use ($database) {
    $tchat = new TchatController($database);
    $router->post('list', [$tchat, 'Tchat_List']);
    $router->post('conversation', [$tchat, 'conversation']);
    $router->post("send", [$tchat, "send"]);
  });


  $router->run();
} catch (Exception $e) {
  echo 'Erreur : ' . $e->getMessage();
}
