<?php

namespace backend\Controllers;

use backend\Core\SessionManager;
use backend\Core\VerifToken;
use backend\models\AdminModels;
use Exception;

class AdminController
{

  private $admin;


  public function __construct($database)
  {
    $this->admin = new AdminModels($database);
  }


  public function user()
  {
    header('Content-Type: application/json');
    SessionManager::startSession();

    try {
      $decoded = VerifToken::verifyToken();
      $role = $decoded->role ?? null;

      if ($role !== "admin") {
        http_response_code(403);
        echo json_encode([
          "role" => $role,
          "success" => false,
          "message" => "Accès refusé. Rôle non autorisé."
        ]);
        return;
      }

      $users = $this->admin->user();

      echo json_encode([
        "success" => true,
        "data" => $users
      ]);
    } catch (Exception $e) {
      http_response_code(401);
      echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
      ]);
      return;
    }
  }

  public function delete($userId)
  {
    header('Content-Type: application/json');
    SessionManager::startSession();

    try {
      $decoded = VerifToken::verifyToken();
      $role = $decoded->role ?? null;

      if ($role !== "admin") {
        http_response_code(403);
        echo json_encode([
          "role" => $role,
          "success" => false,
          "message" => "Accès refusé. Rôle non autorisé."
        ]);
        return;
      }
      $userId = intval($userId);
      $delete =  $this->admin->delete($userId);

      if ($delete) {
        http_response_code(200);
        echo json_encode(["success" => true]);
      } else {
        http_response_code(404);
        echo json_encode([
          "success" => false,
          "message" => "Utilisateur non trouvé."
        ]);
      }
    } catch (Exception $e) {
      http_response_code(401);
      echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
      ]);
      return;
    }
  }
}
