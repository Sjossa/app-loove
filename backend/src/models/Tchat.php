<?php

namespace backend\Models;
use PDO;
use PDOException;

class Tchat{

  private $db;

    public function __construct($database){

        $this->db = $database->getConnection();


    }

    public function Tchat_liste($currentUserId){
    try {
        $stmt = $this->db->prepare("SELECT * FROM matchs WHERE user1_id = :currentUserId OR user2_id = :currentUserId");
        $stmt->bindParam(':currentUserId', $currentUserId, PDO::PARAM_INT);
        $stmt->execute();

        $content= $stmt->fetchAll(PDO::FETCH_ASSOC);

        $matchedUserIds = [];

        foreach ($content as $row) {
    $matchedUserId = ($row['user1_id'] == $currentUserId) ? $row['user2_id'] : $row['user1_id'];

    $stmt2 = $this->db->prepare("SELECT * FROM users WHERE id = :matchedUserId");
    $stmt2->bindParam(':matchedUserId', $matchedUserId, PDO::PARAM_INT);
    $stmt2->execute();

    $userData = $stmt2->fetch(PDO::FETCH_ASSOC);

    if ($userData) {
        $matchedUserIds[] = $userData;
    }
}


        return $matchedUserIds;

    } catch (PDOException $e) {
        error_log("Erreur dans list_match : " . $e->getMessage());
        return null;
    }
}

}
