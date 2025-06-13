<?php

namespace backend\Models;

use PDO;
use PDOException;

class Tchat
{

  private $db;

  public function __construct($database)
  {
    $this->db = $database->getConnection();
  }

  public function Tchat_liste($currentUserId)
  {
    try {
      $stmt = $this->db->prepare("SELECT * FROM matchs WHERE user1_id = :currentUserId OR user2_id = :currentUserId");
      $stmt->bindParam(':currentUserId', $currentUserId, PDO::PARAM_INT);
      $stmt->execute();

      $content = $stmt->fetchAll(PDO::FETCH_ASSOC);

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



  public function conversation($currentUserId, $matchID)
  {
    try {
      $stmt = $this->db->prepare('SELECT * FROM conversation WHERE(user1_id = :currentUserID AND user2_id = :matchID)
          OR (user1_id = :matchID AND user2_id = :currentUserID)');
      $stmt->bindParam(':currentUserID', $currentUserId, PDO::PARAM_INT);
      $stmt->bindParam(':matchID', $matchID, PDO::PARAM_INT);
      $stmt->execute();
      $conversations = $stmt->fetchAll(PDO::FETCH_ASSOC);


      if (empty($conversations)) {

        $stmt2 = $this->db->prepare('INSERT INTO conversation (user1_id, user2_id) VALUES (:currentUserID,:matchID)');
        $stmt2->bindParam(':currentUserID', $currentUserId, PDO::PARAM_INT);
        $stmt2->bindParam(':matchID', $matchID, PDO::PARAM_INT);
        $stmt2->execute();

        $conversationID = $this->db->lastInsertId();
      } else {

        $conversationID = $conversations[0]['id'];
      }

      $stmt3 = $this->db->prepare("SELECT * FROM messages WHERE conversation_id = :conversationID ORDER BY created_at ASC");
      $stmt3->bindParam(':conversationID', $conversationID, PDO::PARAM_INT);
      $stmt3->execute();
      $message = $stmt3->fetchAll(PDO::FETCH_ASSOC);

      return [
        "conversation_id" => $conversationID,
        "messages" => $message,
        "participants" => [
          "user1_id" => $currentUserId,
          "user2_id" => $matchID
        ],
        "message_count" => count($message),
        "last_message" => end($message) ?: null,
      ];
    } catch (PDOException $e) {
      error_log("Erreur dans l'envoie du message : " . $e->getMessage());
      return null;
    }
  }

  public function message($currentUserId, $matchID, $message, $conversationID)
  {

    try {

      $stmt = $this->db->prepare("INSERT INTO messages (sender_id,receiver_id,content,conversation_id) VALUES (:currentUserID,:matchID,:message,:conversationID)");

      $stmt->bindParam(':currentUserID', $currentUserId, PDO::PARAM_INT);
      $stmt->bindParam(':matchID', $matchID, PDO::PARAM_INT);
      $stmt->bindParam(':message', $message, PDO::PARAM_STR);
      $stmt->bindParam(':conversationID', $conversationID, PDO::PARAM_INT);




      return $stmt->execute();
    } catch (\Throwable $th) {
      error_log("Erreur d'insertion message : " . $th->getMessage());
      return false;
    }
  }
}
