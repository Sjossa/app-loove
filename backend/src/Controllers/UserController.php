<?php
namespace backend\Controllers;

use backend\Models\User;
use Firebase\JWT\JWT;



class UserController
{
    private $userModel;


    public function __construct($database)
    {
        $this->userModel = new User($database);
    }


    public function create()
    {
        $donnees_brutes = file_get_contents("php://input");
        $donnees = json_decode($donnees_brutes, true);

        if (!empty($donnees)) {
            $prenom = $donnees["prenom"] ?? null;
            $nom = $donnees["nom"] ?? null;
            $age = $donnees["age"] ?? null;
            $email = $donnees["email"] ?? null;
            $password = $donnees["password"] ?? null;
            $bio = $donnees["bio"] ?? null;

            if (!$prenom || !$nom || !$email || !$password) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Champs obligatoires manquants (prenom, nom, email, password)"]);
                return;
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Adresse email invalide"]);
                return;
            }

            $userId = $this->userModel->create($prenom, $nom, $age, $email, $password, $bio);

            if ($userId) {
                echo json_encode(["success" => true, "message" => "Utilisateur enregistré avec succès", "id" => $userId]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Erreur lors de l'insertion"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Données JSON manquantes ou mal formées"]);
        }
    }


    public function login()
    {
        $key = "key";

        $donnees_brutes = file_get_contents("php://input");
        $donnees = json_decode($donnees_brutes, true);

        if (!empty($donnees)) {
            $email = $donnees["email"];
            $password = $donnees["password"];

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Adresse email invalide"]);
                return;
            }

            $user = $this->userModel->getByEmail($email);

            if ($user && password_verify($password, $user['password'])) {
                $date = time();
                $expiration = $date + 3600;

                $payload = [
                    "date" => $date,
                    "exp" => $expiration,
                    "id" => $user['user_id'],
                    "email" => $email
                ];

                $jwt = JWT::encode($payload, $key, 'HS256');

                echo json_encode([
                  "success" => true,
                  "message" => "Connexion réussie",
                  "jwt" => $jwt
              ]);
            } else {
                http_response_code(401);
                echo json_encode(["success" => false, "message" => "Email ou mot de passe incorrect"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Données d'entrée invalides"]);
        }
    }
}
