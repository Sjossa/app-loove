<?php

namespace backend\Models;

use PDO;
use PDOException;

class MatchProfils
{

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


      $stmt = $this->db->prepare("SELECT * FROM likes WHERE liker_id = :currentUserId");
      $stmt->bindParam(':currentUserId', $currentUserId, PDO::PARAM_INT);
      $stmt->execute();
      $likes = $stmt->fetchAll(PDO::FETCH_ASSOC);

      $likedIds = array_column($likes, 'liked_id');


      while (in_array($randomId, $likedIds)) {
        $randomId = $users[array_rand($users)];
      }


      $stmt2 = $this->db->prepare("SELECT prenom,nom ,localisation,age,id FROM users WHERE id = :id");
      $stmt2->bindParam(':id', $randomId, PDO::PARAM_INT);
      $stmt2->execute();

      $data = $stmt2->fetch(PDO::FETCH_ASSOC);

      return $data ?: null;
    } catch (PDOException $e) {

      error_log("Erreur dans recupMatch : " . $e->getMessage());
      return null;
    }
  }

  public function likeWait($currentUserId)
  {
    $stmt = $this->db->prepare("SELECT users.*
FROM likes
  LEFT JOIN dislikes ON dislikes.dislike_id = :liked_id AND dislikes.disliked_id = likes.liker_id
  JOIN users ON likes.liker_id = users.id
  WHERE likes.liked_id = :liked_id
  AND dislikes.dislike_id IS NULL
");

    $stmt->bindParam(':liked_id', $currentUserId, PDO::PARAM_INT);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return $result;
  }


  public function like($liker_id, $liked_id)
  {

    try {
      $stmt = $this->db->prepare("INSERT INTO likes (liker_id, liked_id, datetime) VALUES (:liker_id, :liked_id, NOW())");

      $stmt->bindParam(':liker_id', $liker_id, PDO::PARAM_INT);
      $stmt->bindParam(':liked_id', $liked_id, PDO::PARAM_INT);
      $stmt->execute();


      $stmt2 = $this->db->prepare("SELECT COUNT(*) FROM likes WHERE liker_id = :liker_id AND liked_id = :liked_id ");
      $stmt2->bindParam(':liker_id', $liker_id, PDO::PARAM_INT);
      $stmt2->bindParam(':liked_id', $liked_id, PDO::PARAM_INT);
      $stmt2->execute();
      $exist = $stmt2->fetchColumn();

      $stmt3 = $this->db->prepare("SELECT COUNT(*) FROM likes WHERE liker_id = :liked_id AND liked_id = :liker_id ");
      $stmt3->bindParam(':liker_id', $liker_id, PDO::PARAM_INT);
      $stmt3->bindParam(':liked_id', $liked_id, PDO::PARAM_INT);
      $stmt3->execute();
      $exist2 = $stmt3->fetchColumn();

      if ($exist > 0 && $exist2 > 0) {
        $user1 = min($liker_id, $liked_id);
        $user2 = max($liker_id, $liked_id);

        $stmt4 = $this->db->prepare("INSERT INTO matchs (user1_id, user2_id) VALUES (:user1, :user2)");
        $stmt4->bindParam(':user1', $user1, PDO::PARAM_INT);
        $stmt4->bindParam(':user2', $user2, PDO::PARAM_INT);
        $stmt4->execute();

        return "match";
      } else {
        return "like";
      }
    } catch (PDOException $e) {
      error_log("Erreur PDO dans like(): " . $e->getMessage());
      echo json_encode(['success' => false, 'message' => 'Erreur SQL : ' . $e->getMessage()]);
      exit;
    }
  }


  public function dislike($dislike_id, $disliked_id)
  {
    try {
      var_dump($dislike_id, $disliked_id);
      $stmt = $this->db->prepare("INSERT INTO dislikes (dislike_id, disliked_id, datetime) VALUES (:dislike_id, :disliked_id, NOW())");

      $stmt->bindParam(':dislike_id', $dislike_id, PDO::PARAM_INT);
      $stmt->bindParam(':disliked_id', $disliked_id, PDO::PARAM_INT);
      $stmt->execute();
      return true;
    } catch (PDOException $e) {
      error_log("Erreur PDO dans like(): " . $e->getMessage());
      echo json_encode(['success' => false, 'message' => 'Erreur SQL : ' . $e->getMessage()]);
      exit;
    }
  }
}
