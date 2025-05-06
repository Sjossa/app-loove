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
    $stmt = $this->db->query("SELECT * FROM users WHERE user_id = 1");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($users);
  }

  public function show($id) {

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
      // $profile_picture = $donnees["profile_picture"] ?? null;
      $bio = $donnees["bio"] ?? null;
      $role = $donnees["role"] ?? null;

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
        INSERT INTO users (prenom, nom, age, email, password, bio, role)
        VALUES (:prenom, :nom, :age, :email, :password, :bio, :role)
      ");
        $stmt->bindParam(':prenom', $prenom);
        $stmt->bindParam(':nom', $nom);
        $stmt->bindParam(':age', $age);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $passwordHash);
        // $stmt->bindParam(':profile_picture', $profile_picture);
        $stmt->bindParam(':bio', $bio);
        $stmt->bindParam(':role', $role);

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
