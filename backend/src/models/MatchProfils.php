<?php
namespace backend\Models;
use PDO;
use PDOException;

class MatchProfils {

    private $db;

    public function __construct($database)
    {
        $this->db = $database->getConnection();
    }

    public function recupMatch($currentUserId)
    {
        try {
            $stmt = $this->db->prepare("SELECT id FROM users WHERE id != :currentUserId");
            $stmt->bindParam(':currentUserId', $currentUserId, PDO::PARAM_INT);
            $stmt->execute();

            $users = $stmt->fetchAll(PDO::FETCH_COLUMN);

            if (empty($users)) {
                return null;
            }


            $randomId = $users[array_rand($users)];

            $stmt2 = $this->db->prepare("SELECT prenom FROM users WHERE id = :id");
            $stmt2->bindParam(':id', $randomId, PDO::PARAM_INT);
            $stmt2->execute();

            $data = $stmt2->fetch(PDO::FETCH_ASSOC);

            return $data['prenom'] ?? null;
        } catch (PDOException $e) {

            error_log("Erreur dans recupMatch : " . $e->getMessage());
            return null;
        }
    }
}
