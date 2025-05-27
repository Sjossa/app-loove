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


    public function create(
    $prenom,
    $nom,
    $age,
    $localisation,
    $email,
    $password,
    $statut,
    $orientation,
    $relation_recherchee,
    $interets,
    $bio,
    $petit_plus,
    $profile_picture
) {
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    try {
        $stmt = $this->db->prepare("
            INSERT INTO users (
                prenom, nom, age, localisation, email, password, statut, orientation,
                relation_recherchee, interets, bio, petit_plus, profile_picture
            ) VALUES (
                :prenom, :nom, :age, :localisation, :email, :password, :statut, :orientation,
                :relation_recherchee, :interets, :bio, :petit_plus, :profile_picture
            )
        ");

        $stmt->bindParam(':prenom', $prenom);
        $stmt->bindParam(':nom', $nom);
        $stmt->bindParam(':age', $age);
        $stmt->bindParam(':localisation', $localisation);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $passwordHash);
        $stmt->bindParam(':statut', $statut);
        $stmt->bindParam(':orientation', $orientation);
        $stmt->bindParam(':relation_recherchee', $relation_recherchee);
        $stmt->bindParam(':interets', $interets);
        $stmt->bindParam(':bio', $bio);
        $stmt->bindParam(':petit_plus', $petit_plus);
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

    public function getByID($id)
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM users WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return false;
        }
    }


  public function update(
    $id,
    $prenom,
    $nom,
    $age,
    $localisation,
    $statut,
    $orientation,
    $relation_recherchee,
    $interets,
    $bio,
    $petit_plus,
    $profile_picture
) {
    try {
        // Requête de mise à jour
        $stmt = $this->db->prepare("
            UPDATE users
            SET
                prenom = :prenom,
                nom = :nom,
                age = :age,
                localisation = :localisation,
                statut = :statut,
                orientation = :orientation,
                relation_recherchee = :relation_recherchee,
                interets = :interets,
                bio = :bio,
                petit_plus = :petit_plus,
                profile_picture = :profile_picture
            WHERE id = :id
        ");

        // Lier les paramètres
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':prenom', $prenom);
        $stmt->bindParam(':nom', $nom);
        $stmt->bindParam(':age', $age);
        $stmt->bindParam(':localisation', $localisation);
        $stmt->bindParam(':statut', $statut);
        $stmt->bindParam(':orientation', $orientation);
        $stmt->bindParam(':relation_recherchee', $relation_recherchee);
        $stmt->bindParam(':interets', $interets);
        $stmt->bindParam(':bio', $bio);
        $stmt->bindParam(':petit_plus', $petit_plus);
        $stmt->bindParam(':profile_picture', $profile_picture);

        $stmt->execute();

        return true;

    } catch (PDOException $e) {
        return false;
    }}


}
