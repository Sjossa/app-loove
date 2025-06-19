<?php


namespace backend\Models;

use PDO;
use PDOException;

class AdminModels
{

  private $db;

  public function __construct($database)
  {

    $this->db = $database->getConnection();


  }

  public function user(){

    $stmt = $this->db->prepare("SELECT * FROM users");
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return $result;
  }

  public function delete($id){

    $stmt = $this->db->prepare("DELETE FROM users WHERE id = :id
");
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $result = $stmt->execute();


    return $result;
  }
}
