<?php
namespace backend\Models;

use PDO;
use PDOException;
class User
{
    private $db;


    public function __construct($database)
    {
        $this->db = $database->getConnection();
    }

    // Créer un utilisateur
    public function create($prenom, $nom, $age, $email, $password,$profile_picture)
    {
        $passwordHash = password_hash($password, PASSWORD_BCRYPT);

        try {
            $stmt = $this->db->prepare("
                INSERT INTO users (prenom, nom, age, email, password,profile_picture)
                VALUES (:prenom, :nom, :age, :email, :password, :profile_picture)
            ");
            $stmt->bindParam(':prenom', $prenom);
            $stmt->bindParam(':nom', $nom);
            $stmt->bindParam(':age', $age);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':password', $passwordHash);
            $stmt->bindParam(':profile_picture', $profile_picture);


            $stmt->execute();

            return $this->db->lastInsertId();
        } catch (PDOException $e) {
            return false;
        }
    }

    // Récupérer un utilisateur par email
    public function getByEmail($email)
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM users WHERE email = :email");
            $stmt->bindParam(':email', $email);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return false;
        }
    }

    public function getByID($user_id)
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM users WHERE user_id = :user_id");
            $stmt->bindParam(':user_id', $user_id);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return false;
        }
    }
}
