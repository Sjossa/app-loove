<?php
namespace backend\Core;


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

  public function get($path, $callable)
  {
    return $this->router->get($this->formatPath($path), $callable);
  }
  public function post($path, $callable)
  {
    return $this->router->post($this->formatPath($path), $callable);
  }
  public function put($path, $callable)
  {
    return $this->router->put($this->formatPath($path), $callable);
  }
  public function delete($path, $callable)
  {
    return $this->router->delete($this->formatPath($path), $callable);
  }
  public function patch($path, $callable)
  {
    return $this->router->patch($this->formatPath($path), $callable);
  }
}
