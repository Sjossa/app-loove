<?php
namespace backend\Controllers;

use backend\Models\User;
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

    public function create()
    {
        $donnees = json_decode(file_get_contents("php://input"), true);

        if (!$donnees) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Données JSON manquantes ou mal formées"]);
            return;
        }

        $prenom = $donnees["prenom"] ?? null;
        $nom = $donnees["nom"] ?? null;
        $age = $donnees["age"] ?? null;
        $email = $donnees["email"] ?? null;
        $password = $donnees["password"] ?? null;
        $profile_picture = $donnees["profile_picture"] ?? null;

        if (!$prenom || !$nom || !$email || !$password || !$profile_picture) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Champs obligatoires manquants"]);
            return;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Adresse email invalide"]);
            return;
        }

        $userId = $this->userModel->create($prenom, $nom, $age, $email, $password, $profile_picture);

        if ($userId) {
            echo json_encode(["success" => true, "message" => "Utilisateur enregistré avec succès", "id" => $userId]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Erreur lors de l'insertion"]);
        }
    }

    public function login()
    {
        session_start();
        $key = $_ENV['JWT_SECRET'] ?? '';
        $donnees = json_decode(file_get_contents("php://input"), true);

        if (!$donnees) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Données d'entrée invalides"]);
            return;
        }

        $email = $donnees["email"] ?? '';
        $password = $donnees["password"] ?? '';

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Adresse email invalide"]);
            return;
        }

        $user = $this->userModel->getByEmail($email);

        if ($user && password_verify($password, $user['password'])) {
            $payload = [
                "date" => time(),
                "exp" => time() + 3600,
                "user_id" => $user['user_id'],
                "email" => $email
            ];

            $jwt = JWT::encode($payload, $key, 'HS256');
            $_SESSION['jwt'] = $jwt;

            echo json_encode(["success" => true, "message" => "Connexion réussie", "id" => $user['user_id']]);
        } else {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Email ou mot de passe incorrect"]);
        }
    }

    public function profil()
    {
        session_start();
        $headers = getallheaders();
        $authorization = $headers['Authorization'] ?? '';

        if (!preg_match('/Bearer\s(\S+)/', $authorization, $matches)) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Jeton manquant"]);
            return;
        }

        $jwt = $matches[1];
        $key = $_ENV['JWT_SECRET'] ?? '';

        if (!$key) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Clé secrète manquante"]);
            return;
        }

        try {
            $decode = JWT::decode($jwt, new Key($key, 'HS256'));
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Jeton invalide ou expiré", "error" => $e->getMessage()]);
            return;
        }

        $user = $this->userModel->getByID($decode->user_id);

        if ($user) {
            if (!empty($user['profile_picture'])) {
                $user['profile_picture'] = 'https://api.app-loove.local/' . $user['profile_picture'];
            }
            echo json_encode(["success" => true, "user" => $user]);
        } else {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Utilisateur non trouvé"]);
        }
    }
}
