<?php

namespace backend\config;

use PDO;
use PDOException;

class Database
{
  private $host = 'localhost';
  private $dbname = 'meetlink';
  private $username = 'root';
  private $password = '';
  private $conn = null;

  public function getConnection()
  {
    if ($this->conn === null) {
      try {
        $this->conn = new PDO(
          "mysql:host={$this->host};dbname={$this->dbname};charset=utf8",
          $this->username,
          $this->password
        );
        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      } catch (PDOException $e) {
        die("Erreur de connexion : " . $e->getMessage());
      }
    }

    return $this->conn;
  }
}
