<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");


spl_autoload_register(function ($class) {
  $folders = ['../core/', '../config/', '../controllers/'];

  foreach ($folders as $folder) {
    $file = $folder . $class . '.php';
    if (file_exists($file)) {
      require_once $file;
      return;
    }
  }
});

// Instantiation du routeur avec l'URL de la requête
$router = new Router($_SERVER['REQUEST_URI']);

// Définition des routes

$router->group('/users', function ($router) {
  $router->get('/index', [new UserController(), 'index']);
  $router->post('/create', [new UserController(), 'create']);

});

try {
  // Lancer le routeur pour exécuter la route correspondante
  $router->run();
} catch (Exception $e) {
  // Si une erreur survient, afficher le message d'erreur
  echo 'Erreur : ' . $e->getMessage();
}
?>


