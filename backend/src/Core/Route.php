<?php

namespace backend\Core;

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
