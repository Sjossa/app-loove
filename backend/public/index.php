<?php

// Autoload des classes
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

$router->get('/users', [new UserController(), 'index']);
$router->get('/create', [new UserController(), 'create']);
$router->get('/users/:id', [new UserController(), 'show']);  // Route avec paramètre dynamique



try {
  // Lancer le routeur pour exécuter la route correspondante
  $router->run();
} catch (Exception $e) {
  // Si une erreur survient, afficher le message d'erreur
  echo 'Erreur : ' . $e->getMessage();
}
?>

