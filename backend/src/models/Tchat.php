<?php
namespace backend\models;

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
      $sql = "
        SELECT utilisateur_matche.*
        FROM matchs
        INNER JOIN users AS utilisateur_matche
          ON utilisateur_matche.id = CASE
            WHEN matchs.user1_id = :currentUserId THEN matchs.user2_id
            ELSE matchs.user1_id
          END
        WHERE matchs.user1_id = :currentUserId OR matchs.user2_id = :currentUserId
      ";

      $statement = $this->db->prepare($sql);
      $statement->bindParam(':currentUserId', $currentUserId, PDO::PARAM_INT);
      $statement->execute();

      $utilisateursMatches = $statement->fetchAll(PDO::FETCH_ASSOC);

      return $utilisateursMatches;
    } catch (PDOException $exception) {
      error_log("Erreur dans Tchat_liste : " . $exception->getMessage());
      return null;
    }
  }

  public function conversation($currentUserId, $matchID)
  {
    try {
      $statement = $this->db->prepare('
        SELECT * FROM conversation
        WHERE (user1_id = :currentUserID AND user2_id = :matchID)
           OR (user1_id = :matchID AND user2_id = :currentUserID)
      ');
      $statement->bindParam(':currentUserID', $currentUserId, PDO::PARAM_INT);
      $statement->bindParam(':matchID', $matchID, PDO::PARAM_INT);
      $statement->execute();
      $conversations = $statement->fetchAll(PDO::FETCH_ASSOC);

      if (empty($conversations)) {
        $insertStatement = $this->db->prepare('
          INSERT INTO conversation (user1_id, user2_id)
          VALUES (:currentUserID, :matchID)
        ');
        $insertStatement->bindParam(':currentUserID', $currentUserId, PDO::PARAM_INT);
        $insertStatement->bindParam(':matchID', $matchID, PDO::PARAM_INT);
        $insertStatement->execute();

        $conversationID = $this->db->lastInsertId();
      } else {
        $conversationID = $conversations[0]['id'];
      }

      $messagesStatement = $this->db->prepare("
        SELECT * FROM messages
        WHERE conversation_id = :conversationID
        ORDER BY created_at ASC
      ");
      $messagesStatement->bindParam(':conversationID', $conversationID, PDO::PARAM_INT);
      $messagesStatement->execute();
      $messages = $messagesStatement->fetchAll(PDO::FETCH_ASSOC);

      return [
        "conversation_id" => $conversationID,
        "messages" => $messages,
        "participants" => [
          "user1_id" => $currentUserId,
          "user2_id" => $matchID
        ],
        "message_count" => count($messages),
        "last_message" => end($messages) ?: null,
      ];
    } catch (PDOException $exception) {
      error_log("Erreur dans conversation : " . $exception->getMessage());
      return null;
    }
  }

  public function message($currentUserId, $matchID, $messageContent, $conversationID)
  {
    try {
      $insertMessageStatement = $this->db->prepare("
        INSERT INTO messages (sender_id, receiver_id, content, conversation_id)
        VALUES (:currentUserID, :matchID, :messageContent, :conversationID)
      ");

      $insertMessageStatement->bindParam(':currentUserID', $currentUserId, PDO::PARAM_INT);
      $insertMessageStatement->bindParam(':matchID', $matchID, PDO::PARAM_INT);
      $insertMessageStatement->bindParam(':messageContent', $messageContent, PDO::PARAM_STR);
      $insertMessageStatement->bindParam(':conversationID', $conversationID, PDO::PARAM_INT);

      return $insertMessageStatement->execute();
    } catch (\Throwable $exception) {
      error_log("Erreur d'insertion message : " . $exception->getMessage());
      return false;
    }
  }
}
