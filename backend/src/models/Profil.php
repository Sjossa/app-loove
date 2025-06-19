<?php

namespace backend\Models;

use PDO;

class Profil
{
  private PDO $db;

  public function __construct($database)
  {
    $this->db = $database->getConnection();
  }

  /**
   * Récupère les notifications en retard (messages, likes, matchs)
   * si l'utilisateur vient de se reconnecter.
   */
  public function only(int $userId, int $jwtTimestamp): array
  {

    // 1. Vérifie l'état actuel de l'utilisateur
    $stmt = $this->db->prepare("SELECT is_online, last_active FROM users WHERE id = :userId");
    $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
      return [];
    }

    // 2. Si l'utilisateur était hors ligne
    if ((int)$user['is_online'] === 0) {
      // a. Le passer en ligne
      $stmt = $this->db->prepare("UPDATE users SET is_online = 1 WHERE id = :userId");
      $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
      $stmt->execute();

      // b. Détermine la date à utiliser pour comparer
      // Utilise last_active s'il est défini, sinon fallback sur le JWT timestamp
      $lastActive = strtotime($user['last_active']) ?: $jwtTimestamp;

      echo "📅 Recherche des événements après : " . date('Y-m-d H:i:s', $lastActive) . "\n";


      // 3. Récupère les événements plus récents que cette date
      $stmt = $this->db->prepare("
        SELECT 'message' AS type, id, created_at AS timestamp
        FROM messages
        WHERE created_at > FROM_UNIXTIME(:lastActive) AND receiver_id = :userId

        UNION ALL

        SELECT 'like' AS type, id, datetime AS timestamp
        FROM likes
        WHERE datetime > FROM_UNIXTIME(:lastActive) AND liked_id = :userId

        UNION ALL

        SELECT 'match' AS type, CONCAT(user1_id, '_', user2_id) AS id, datetime AS timestamp
        FROM matchs
        WHERE datetime > FROM_UNIXTIME(:lastActive) AND (user1_id = :userId OR user2_id = :userId)
      ");

      $stmt->bindParam(':lastActive', $lastActive, PDO::PARAM_INT);
      $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
      $stmt->execute();

      $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
      return $results ?: [];
    }

    // Si l'utilisateur était déjà en ligne => rien à renvoyer
    return [];
  }
}
