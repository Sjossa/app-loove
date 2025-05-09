<?php
namespace Backend\Controllers;
use backend\config\Database;
use PDO;
use PDOException;

class UserController
{
  private $db;

  // Constructeur qui utilise l'instance de Database passée en argument
  public function __construct(Database $database)
  {
    $this->db = $database->getConnection(); // Utilisation correcte de l'instance passée
  }

  public function index()
  {
    echo "lol";
  }

  public function show($id)
  {
    // Logique pour afficher un utilisateur par ID
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
        echo json_encode([
          "success" => false,
          "message" => "Champs obligatoires manquants (prenom, nom, email, password)"
        ]);
        return;
      }

      if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
          "success" => false,
          "message" => "Adresse email invalide"
        ]);
        return;
      }

      // Hachage du mot de passe
      $passwordHash = password_hash($password, PASSWORD_DEFAULT);

      try {
        $stmt = $this->db->prepare("
        INSERT INTO users (prenom, nom, age, email, password, bio)
        VALUES (:prenom, :nom, :age, :email, :password, :bio)
      ");
        $stmt->bindParam(':prenom', $prenom);
        $stmt->bindParam(':nom', $nom);
        $stmt->bindParam(':age', $age);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $passwordHash);
        $stmt->bindParam(':bio', $bio);

        $stmt->execute();

        echo json_encode([
          "success" => true,
          "message" => "Utilisateur enregistré avec succès",
          "id" => $this->db->lastInsertId()
        ]);
      } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
          "success" => false,
          "message" => "Erreur lors de l'insertion : " . $e->getMessage()
        ]);
      }
    } else {
      http_response_code(400);
      echo json_encode([
        "success" => false,
        "message" => "Données JSON manquantes ou mal formées"
      ]);
    }
  }

  public function login()
  {
    $donnees_brutes = file_get_contents("php://input");
    $donnees = json_decode($donnees_brutes, true);

    if (!empty($donnees)) {
      $email = $donnees["email"];
      $password = $donnees["password"];

      if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
          "success" => false,
          "message" => "Adresse email invalide"
        ]);
        return;
      }

      try {
        $stmt = $this->db->prepare("
                SELECT * FROM users
                WHERE email = :email
            ");
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
          echo json_encode([
            "success" => true,
            "message" => "Connexion réussie",
            "user" => $user
          ]);
        } else {
          http_response_code(401);
          echo json_encode([
            "success" => false,
            "message" => "Email ou mot de passe incorrect"
          ]);
        }
      } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
          "success" => false,
          "message" => "Erreur lors de la connexion : " . $e->getMessage()
        ]);
      }
    } else {
      http_response_code(400);
      echo json_encode([
        "success" => false,
        "message" => "Données d'entrée invalides"
      ]);
    }
  }

  public function delete($id)
  {
    // Logique pour supprimer un utilisateur
  }
}
