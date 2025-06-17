<?php

namespace backend\models;

use PDO;
use PDOException;


class paypal
{

  private $db;

  public function __construct($database)
  {

    $this->db = $database->getConnection();
  }


  public function abonement($currentUserId)
  {
    try {
      $type = 'premium';
      $dateDebut = date('Y-m-d');
      $modePaiement = 'paypal';

      $stmt = $this->db->prepare("
      INSERT INTO
abonnement (user_id, type, date_debut, statut, mode_paiement)
      VALUES (:user_id, :type, :date_debut, 'actif', :mode_paiement)
    ");

      $stmt->bindParam(':user_id', $currentUserId, \PDO::PARAM_INT);
      $stmt->bindParam(':type', $type);
      $stmt->bindParam(':date_debut', $dateDebut);
      $stmt->bindParam(':mode_paiement', $modePaiement);

      return $stmt->execute();
    } catch (\Throwable $th) {
      file_put_contents('log_abonnement.txt', $th->getMessage(), FILE_APPEND);
      return false;
    }
  }
}
