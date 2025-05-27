<?php
namespace backend\Controllers;

use backend\models\User;
use backend\Core\SessionManager;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class UserController
{
    private $userModel;

    public function __construct($database)
    {
        $this->userModel = new User($database);
    }

    public function create(): void
{
      header('Content-Type: application/json');
      $data = json_decode(file_get_contents("php://input"), true);

      if (!$data) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Données JSON invalides"]);
        return;
      }

      $required = ["prenom", "nom", "email", "password"];
      foreach ($required as $field) {
        if (empty($data[$field])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Le champ '$field' est obligatoire"]);
            return;
        }
    }

    if (!filter_var($data["email"], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Email invalide"]);
        return;
    }


    $userId = $this->userModel->create(
        $data["prenom"],
        $data["nom"],
        $data["age"] ?? null,
        $data["localisation"] ?? null,
        $data["email"],
        $data["password"],
        $data["statut"] ?? null,
        $data["orientation"] ?? null,
        $data["relation_recherchee"] ?? null,
        $data["interets"] ?? null,
        $data["bio"] ?? null,
        $data["petit_plus"] ?? null,
        $data["profile_picture"] ?? null
    );

    if ($userId) {
        echo json_encode(["success" => true, "message" => "Utilisateur enregistré", "id" => $userId]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erreur serveur"]);
    }
}


    public function login(): void
{
        header('Content-Type: application/json');
        SessionManager::startSession();

        $key = $_ENV['JWT_SECRET'] ?? '';
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data || !isset($data['email'], $data['password'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Email et mot de passe requis"]);
            return;
        }

        $email = $data['email'];
        $password = $data['password'];

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Email invalide"]);
            return;
        }

        $user = $this->userModel->getByEmail($email);

        if ($user && password_verify($password, $user['password'])) {
            $payload = [
                "iat" => time(),
                "exp" => time() + 3600,
                "id" => $user['id'],
                "email" => $email
            ];

            $jwt = JWT::encode($payload, $key, 'HS256');
            $_SESSION['jwt'] = $jwt;

            echo json_encode([
                "success" => true,
                "message" => "Connexion réussie",
                "id" => $user['id'],
                "session_id" => session_id()
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Identifiants incorrects"]);
        }
}

public function profil(): void
{
        header('Content-Type: application/json');
        SessionManager::startSession();

        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';

        if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Jeton absent"]);
            return;
        }

        $jwt = $matches[1];
        $key = $_ENV['JWT_SECRET'] ?? '';

        try {
            $decoded = JWT::decode($jwt, new Key($key, 'HS256'));
            $user = $this->userModel->getByID($decoded->id);

            if ($user) {
                if (!empty($user['profile_picture'])) {
                    $user['profile_picture'] = 'https://back.meetlink.local//' . $user['profile_picture'];
                }

                echo json_encode(["success" => true, "user" => $user]);
            } else {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Utilisateur non trouvé"]);
            }
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "message" => "Jeton invalide ou expiré",
                "error" => $e->getMessage()
            ]);
        }
}

  public function update() {
SessionManager::startSession();

    $data = json_decode(file_get_contents("php://input"), true);
    $jwt = $_SESSION['jwt'];
    $key = $_ENV['JWT_SECRET'] ?? '';
    $decoded = JWT::decode($jwt, new Key($key, 'HS256'));

    $id = $decoded->id;

    $userupdate = $this->userModel->update(
        $id,
        $data["prenom"],
        $data["nom"],
        $data["age"] ?? null,
        $data["localisation"] ?? null,
        $data["statut"] ?? null,
        $data["orientation"] ?? null,
        $data["relation_recherchee"] ?? null,
        $data["interets"] ?? null,
        $data["bio"] ?? null,
        $data["petit_plus"] ?? null,
        $data["profile_picture"] ?? null
    );

    if ($userupdate) {
        echo json_encode(["success" => true, "message" => "Profil mis à jour"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erreur lors de la mise à jour"]);
    }
}
}
