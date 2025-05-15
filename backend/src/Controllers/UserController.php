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
        $donnees_brutes = file_get_contents("php://input");
        $donnees = json_decode($donnees_brutes, true);

        if (!empty($donnees)) {
            $prenom = $donnees["prenom"] ?? null;
            $nom = $donnees["nom"] ?? null;
            $age = $donnees["age"] ?? null;
            $email = $donnees["email"] ?? null;
            $password = $donnees["password"] ?? null;
            $profile_picture = $donnees["profile_picture"] ?? null;



            if (!$prenom || !$nom || !$email || !$password || !$profile_picture) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Champs obligatoires manquants (prenom, nom, email, password)"]);
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
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Données JSON manquantes ou mal formées"]);
        }
    }


    public function login()
    {
        $key = $_ENV['JWT_SECRET'];


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
                    "user_id" => $user['user_id'],
                    "email" => $email
                ];

                $jwt = JWT::encode($payload, $key, 'HS256');

                echo json_encode([
                    "success" => true,
                    "message" => "Connexion réussie",
                    "jwt" => $jwt,
                    "user_id" => $user['user_id']
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

    public function profil()
    {
        $headers = getallheaders();
        $authorization = $headers['Authorization'] ?? '';

        if (preg_match('/Bearer\s(\S+)/', $authorization, $matches)) {
            $jwt = $matches[1];
        } else {
            http_response_code(401);
            echo json_encode(["succes" => false, "message" => "jeton manquantes"]);
            return;
        }

        $key = $_ENV['JWT_SECRET'] ?? '';

        if (empty($key)) {
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

        if (!empty($decode)) {

            $user_id = $decode->user_id;


            $user = $this->userModel->getByID($user_id);

            if ($user) {
                echo json_encode(["success" => true, "user" => $user]);
            } else {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Utilisateur non trouvé"]);
            }

        }

    }





}

