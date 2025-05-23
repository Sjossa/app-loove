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

  public function group(string $prefix, callable $callback)
  {
    $groupRouter = new class ($this, $prefix) {
      private $router;
      private $prefix;

      public function __construct($router, $prefix)
      {
        $this->router = $router;
        $this->prefix = trim($prefix, '/');
      }

      public function get($path, $callable)
      {
        $fullPath = '/' . $this->prefix . '/' . trim($path, '/');
        return $this->router->get($fullPath, $callable);
      }

      public function post($path, $callable)
      {
        $fullPath = '/' . $this->prefix . '/' . trim($path, '/');
        return $this->router->post($fullPath, $callable);
      }
    };

    $callback($groupRouter);
  }

  // Méthode pour définir une route GET
  public function get($path, $callable)
  {
    $route = new Route($path, $callable);
    $this->routes["GET"][] = $route;
    return $route;
  }
  // Méthode pour définir une route POST
  public function post($path, $callable)
  {
    $route = new Route($path, $callable);
    $this->routes["POST"][] = $route;
    return $route;
  }



  // Méthode pour exécuter la route correspondant à la requête
  public function run()
  {
    $url = $_SERVER['REQUEST_URI'];
    $url = str_replace('/public', '', $url);
    $url = parse_url($url, PHP_URL_PATH);

    if (!isset($this->routes[$_SERVER['REQUEST_METHOD']])) {
      throw new Exception('METHOD does not exist');
    }

    foreach ($this->routes[$_SERVER['REQUEST_METHOD']] as $route) {
      if ($route->match($url)) {
        return $route->call();
      }
    }

    throw new Exception('No matching routes');

  }
}

// Classe Route pour la gestion d'une route spécifique
class Route
{
  private $path;
  private $callable;
  private $matches = [];

  public function __construct($path, $callable)
  {
    $this->path = trim($path, '/');
    $this->callable = $callable;
  }

  public function match($url)
  {
    $url = trim($url, '/');
    $path = preg_replace('#:([\w]+)#', '([^/]+)', $this->path);
    $regex = "#^$path$#i";

    if (!preg_match($regex, $url, $matches)) {
      return false;
    }

    array_shift($matches);
    $this->matches = $matches;
    return true;
  }

  public function call()
  {
    return call_user_func_array($this->callable, $this->matches);
  }

  public function getController()
  {
    if (is_array($this->callable)) {
      return $this->callable[0];
    } elseif (is_object($this->callable) && $this->callable instanceof Closure) {
      return 'Closure';
    }
    return $this->callable;
  }
}
