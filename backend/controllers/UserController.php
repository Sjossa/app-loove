<?php
class UserController


{


  private $db;

  public function __construct()
  {
    $database = new Database();
    $this->db = $database->getConnection();
  }

  public function index()
  {
    $stmt = $this->db->query("SELECT prenom FROM users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($users);
  }

  public function show($id) {
    // Afficher un utilisateur spécifique
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
        INSERT INTO users (email,prenom, nom, age)
        VALUES (:email, :prenom, :nom, :age)
      ");
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':prenom', $prenom);

        $stmt->bindParam(':nom', $nom);
        $stmt->bindParam(':age', $age);
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


  public function update($id) {
    // Mettre à jour un utilisateur
  }

  public function delete($id) {
    // Supprimer un utilisateur
  }
}
