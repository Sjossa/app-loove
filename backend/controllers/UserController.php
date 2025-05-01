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

  public function create() {
    // Ajouter un nouvel utilisateur
  }

  public function update($id) {
    // Mettre à jour un utilisateur
  }

  public function delete($id) {
    // Supprimer un utilisateur
  }
}
