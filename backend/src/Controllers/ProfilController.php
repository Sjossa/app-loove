<?php

namespace backend\Controllers;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use backend\Core\SessionManager;

class ProfilController
{
  public function __construct() {}

  public function VerificationToken()
  {
    SessionManager::startSession();
    header('Content-Type: application/json');

    if (empty($_SESSION['jwt'])) {
      http_response_code(401);
      echo json_encode([
        "success" => false,
        "message" => "Non authentifié"
      ]);
      return;
    }

    try {
      $jwt = $_SESSION['jwt'];
      $key = $_ENV['JWT_SECRET'] ?? '';

      if (empty($key)) {
        throw new \Exception("Clé secrète JWT manquante");
      }

      $decoded = JWT::decode($jwt, new Key($key, 'HS256'));

      if ($decoded->exp < time()) {
        throw new \Exception("Jeton expiré");
      }


      echo json_encode([
        "success" => true,
        "message" => "Jeton valide",
        "jwt" => $jwt
      ]);
    } catch (\Exception $e) {
      http_response_code(401);
      echo json_encode([
        "success" => false,
        "message" => "Jeton invalide ou expiré",
        "error" => $e->getMessage()
      ]);
    }
  }
}
