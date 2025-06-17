<?php

namespace backend\Models;

use PDO;
use PDOException;

class Profil
{

  private $db;

  public function __construct($database)
  {

    $this->db = $database->getConnection();
  }


  public function only($userId)
  {

    $stmt = $this->db->prepare("SELECT is_online FROM users WHERE id = :user;");
    $stmt->bindParam(':user', $userId, PDO::PARAM_INT);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result['is_online'] == 0) {

      $status = 1;
      $stmt = $this->db->prepare("UPDATE users SET is_online = :status WHERE id = :userId");
      $stmt->bindParam(':status', $status, PDO::PARAM_INT);
      $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
      $stmt->execute();

      
    }else{
      return;
    }
  }




}
