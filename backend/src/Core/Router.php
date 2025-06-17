<?php

namespace backend\core;

class Router
{
  private $url;
  private $routes = [];
  private $database;

  public function __construct($url, $database)
  {
    $this->url = $url;
    $this->database = $database;
  }

  public function group(string $prefix, callable $callback)
  {
    $groupRouter = new GroupRouter($this, $prefix);
    $callback($groupRouter);
  }

  // Méthodes HTTP
  public function get(string $path, $callable)    { return $this->add('GET', $path, $callable); }
  public function post(string $path, $callable)   { return $this->add('POST', $path, $callable); }
  public function put(string $path, $callable)    { return $this->add('PUT', $path, $callable); }
  public function delete(string $path, $callable) { return $this->add('DELETE', $path, $callable); }
  public function patch(string $path, $callable)  { return $this->add('PATCH', $path, $callable); }

  private function add(string $method, string $path, $callable)
  {
    $route = new Route($path, $callable);
    $this->routes[$method][] = $route;
    return $route;
  }

  public function run()
  {
    $url = $_SERVER['REQUEST_URI'];
    $url = str_replace('/public', '', $url);
    $url = parse_url($url, PHP_URL_PATH);
    $method = $_SERVER['REQUEST_METHOD'];

    if (!isset($this->routes[$method])) {
      throw new \Exception("Méthode HTTP non prise en charge");
    }

    foreach ($this->routes[$method] as $route) {
      if ($route->match($url)) {
        return $route->call();
      }
    }

    throw new \Exception("Aucune route ne correspond à l'URL : $url");
  }
}

class GroupRouter
{
  private $router;
  private $prefix;

  public function __construct($router, $prefix)
  {
    $this->router = $router;
    $this->prefix = trim($prefix, '/');
  }

  private function formatPath(string $path): string
  {
    return '/' . trim($this->prefix . '/' . trim($path, '/'), '/');
  }

  public function get($path, $callable)    { return $this->router->get($this->formatPath($path), $callable); }
  public function post($path, $callable)   { return $this->router->post($this->formatPath($path), $callable); }
  public function put($path, $callable)    { return $this->router->put($this->formatPath($path), $callable); }
  public function delete($path, $callable) { return $this->router->delete($this->formatPath($path), $callable); }
  public function patch($path, $callable)  { return $this->router->patch($this->formatPath($path), $callable); }
}

class Route
{
  private $path;
  private $callable;
  private $matches = [];

  public function __construct(string $path, $callable)
  {
    $this->path = trim($path, '/');
    $this->callable = $callable;
  }

  public function match(string $url): bool
  {
    $url = trim($url, '/');
    $pattern = preg_replace('#:([\w]+)#', '([^/]+)', $this->path);
    $regex = "#^$pattern$#i";

    if (!preg_match($regex, $url, $matches)) {
      return false;
    }

    array_shift($matches);
    $this->matches = $matches;
    return true;
  }

  public function call()
  {
    if (!is_callable($this->callable)) {
      throw new \Exception("Le callback de la route n'est pas appelable.");
    }
    return call_user_func_array($this->callable, $this->matches);
  }

  public function getController()
  {
    if (is_array($this->callable)) {
      return $this->callable[0];
    } elseif (is_object($this->callable) && $this->callable instanceof \Closure) {
      return 'Closure';
    }
    return $this->callable;
  }
}
