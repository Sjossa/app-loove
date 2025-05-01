<?php

// Classe Router pour la gestion des routes
class Router
{
  private $url;
  private $routes = [];

  // Constructeur qui prend l'URL actuelle pour la gestion de la route
  public function __construct($url)
  {
    $this->url = $url;
  }

  // Méthode pour définir une route GET
  public function get($path, $callable)
  {
    // Crée un objet Route pour enregistrer la route
    $route = new Route($path, $callable);
    $this->routes["GET"][] = $route;  // Ajoute cette route à la liste des routes GET
    return $route; // Permet de chaîner des méthodes sur la route (par exemple, des middlewares)
  }

  // Méthode pour exécuter la route correspondant à la requête
  public function run()
  {
    $url = $_SERVER['REQUEST_URI'];

    // Enlève '/public' de l’URL, si ce dossier existe
    $url = str_replace('/public', '', $url);

    $url = parse_url($url, PHP_URL_PATH); // Enlève les paramètres GET de l'URL (tout ce qui suit '?')

    // Vérifie si des routes sont définies pour la méthode HTTP actuelle
    if (!isset($this->routes[$_SERVER['REQUEST_METHOD']])) {
      throw new Exception('METHOD does not exist');
    }

    // Parcourt toutes les routes définies pour la méthode actuelle et les compare avec l'URL
    foreach ($this->routes[$_SERVER['REQUEST_METHOD']] as $route) {
      if ($route->match($url)) {
        return $route->call(); // Si un match est trouvé, on appelle la fonction associée à la route
      }
    }

    throw new Exception('No matching routes'); // Si aucune route ne correspond, on lance une exception
  }
}

// Classe Route pour la gestion d'une route spécifique
class Route
{
  private $path;
  private $callable;
  private $matches = [];

  // Constructeur qui prend le chemin de la route et l'action à exécuter (fonction ou contrôleur)
  public function __construct($path, $callable)
  {
    $this->path = trim($path, '/'); // Enlève les slashs en début et fin
    $this->callable = $callable; // Enregistre l'action à exécuter pour cette route
  }

  // Méthode pour vérifier si l'URL correspond au chemin de la route
  public function match($url)
  {
    $url = trim($url, '/'); // Enlève les slashs en début et fin de l'URL

    // Remplace :param par une expression régulière qui capture une valeur
    $path = preg_replace('#:([\w]+)#', '([^/]+)', $this->path);
    $regex = "#^$path$#i"; // Crée une regex complète pour comparer l'URL

    if (!preg_match($regex, $url, $matches)) {
      return false; // Si aucune correspondance, retourne false
    }

    array_shift($matches); // On enlève le match complet pour garder uniquement les paramètres capturés
    $this->matches = $matches; // Enregistre les paramètres capturés
    return true; // Si un match est trouvé, retourne true
  }

  // Méthode pour appeler la fonction ou le contrôleur associé à la route
  public function call()
  {
    return call_user_func_array($this->callable, $this->matches); // Appelle la méthode ou la fonction avec ses arguments
  }

  // Méthode pour récupérer le nom du contrôleur (si la route est une méthode de contrôleur)
  public function getController()
  {
    if (is_array($this->callable)) {
      return $this->callable[0]; // Si c'est un tableau (contrôleur, méthode)
    } elseif (is_object($this->callable) && $this->callable instanceof Closure) {
      return 'Closure'; // Si c'est une closure
    }
    return $this->callable; // Sinon, c'est juste une fonction ou un nom de contrôleur
  }
}

?>

