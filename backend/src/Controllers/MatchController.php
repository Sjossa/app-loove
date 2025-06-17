<?php

namespace backend\Controllers;

use backend\models\MatchProfils;
use backend\Core\SessionManager;


class MatchController
{

  private $matchModel;


  public function __construct($database)
  {
    $this->matchModel = new MatchProfils($database);
  }

  public function profilGenerate()
  {
    SessionManager::startSession();


    header('Content-Type: application/json');


    if ($_SERVER['REQUEST_METHOD'] === 'POST') {


      $data = json_decode(file_get_contents("php://input"), true);


      $currentUserId = $data['id'] ?? null;

      if ($currentUserId) {
        $user = $this->matchModel->recupMatch($currentUserId);

        if ($user) {
          echo json_encode([
            "status" => "success",
            "message" => "profil trouvé",
            "user" => $user

          ]);
        } else {
          echo json_encode([
            "status" => "empty",
            "message" => "Aucun profil trouvé"
          ]);
        }
      } else {
        echo json_encode([
          "status" => "error",
          "message" => "ID utilisateur manquant"
        ]);
      }
    }
  }

  public function like()
  {
    SessionManager::startSession();


    header('Content-Type: application/json');


    if ($_SERVER['REQUEST_METHOD'] === 'POST') {


      $data = json_decode(file_get_contents("php://input"), true);



      $liker_id = $data['liker_id'] ?? null;
      $liked_id = $data['liked_id'] ?? null;

      $result = $this->matchModel->like($liker_id, $liked_id);


      if ($result === "match") {


        $notification = [
          'type' => 'match',
          'to_user_id' => $liked_id,
          'data' => $result,
        ];


        $connexion = fsockopen("localhost", 8080, $errno, $errstr, 2);

        if (!$connexion) {
          echo "Erreur de connexion : $errstr ($errno)\n";
        } else {
          fwrite($connexion, json_encode($notification));
          fclose($connexion);
        }


        echo json_encode(['success' => true, 'message' => 'match enregistré avec succès']);
        exit;
      } elseif ($result === "like") {

        $notification = [
          'type' => 'like',
          'to_user_id' => $liked_id,
          'data' => $result,
        ];


        $connexion = fsockopen("localhost", 8080, $errno, $errstr, 2);

        if (!$connexion) {
          echo "Erreur de connexion : $errstr ($errno)\n";
        } else {
          fwrite($connexion, json_encode($notification));
          fclose($connexion);
        }


        echo json_encode(['success' => true, 'message' => 'profil liker']);



        exit;
      } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'enregistrement du like']);
        exit;
      }
    } else {
      http_response_code(400);
      echo json_encode(['success' => false, 'message' => 'Paramètres manquants']);
      exit;
    }
  }



  public function dislike()
  {
    SessionManager::startSession();


    header('Content-Type: application/json');


    if ($_SERVER['REQUEST_METHOD'] === 'POST') {


      $data = json_decode(file_get_contents("php://input"), true);



      $dislike_id = $data['dislike_id'] ?? null;
      $disliked_id = $data['disliked_id'] ?? null;

      $result = $this->matchModel->dislike($dislike_id, $disliked_id);


      if ($result) {
        echo json_encode(['success' => true, 'message' => 'Like enregistré avec succès']);
        exit;
      } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'enregistrement du dislike']);
        exit;
      }
    } else {
      http_response_code(400);
      echo json_encode(['success' => false, 'message' => 'Paramètres manquants']);
      exit;
    }
  }

  public function likeWait()
  {

    SessionManager::startSession();
    header('Content-Type: application/json');
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      $data = json_decode(file_get_contents("php://input"), true);


      $currentUserId = $data['id'] ?? null;

      $result = $this->matchModel->likeWait($currentUserId);




      echo json_encode(($result));
    }
  }
}
