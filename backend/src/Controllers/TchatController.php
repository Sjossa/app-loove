<?php

namespace backend\Controllers;

use backend\models\Tchat;
use backend\Core\VerifToken;
use Exception;

class TchatController
{

  private $Tchat;

  public function __construct($database)
  {
    $this->Tchat = new Tchat($database);
  }


  public function Tchat_List()
  {
    header('Content-Type: application/json');

    try {
      $currentUserId = VerifToken::verifyToken();

      $user = $this->Tchat->Tchat_liste($currentUserId);

      if ($user) {
        echo json_encode([
          "status" => "success",
          "message" => "match trouvé",
          "user" => $user
        ]);
      } else {
        echo json_encode([
          "status" => "empty",
          "message" => "Aucun match trouvé"
        ]);
      }
    } catch (Exception $e) {
      http_response_code(401);
      echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
      ]);
    }
  }

  public function conversation()
  {

    header('Content-Type: application/json');

    try {

      $currentUserId = VerifToken::verifyToken();
      $verif = json_decode(file_get_contents('php://input'), true);

      if (!isset($verif['matchID'])) {
        echo json_encode([
          "status" => "error",
          "message" => "matchedId manquant"
        ]);
        return;
      }
      $matchId = intval($verif['matchID']);


      $conversation = $this->Tchat->conversation($currentUserId, $matchId);

      if ($conversation) {
        echo json_encode([

          "conversation" => $conversation
        ]);
      } else {
        echo json_encode([
          "status" => "empty",
          "message" => "Aucune conversation trouvé"
        ]);
      }
    } catch (\Throwable $th) {
      echo json_encode([
        "status" => "error",
        "message" => "Erreur serveur : " . $th->getMessage()
      ]);
    }
  }

  public function send()
  {


    header('Content-Type: application/json');

    try {

      $currentUserId = VerifToken::verifyToken();
      $verif = json_decode(file_get_contents('php://input'), true);

      if (!isset($verif['message'], $verif['matchID'], $verif['conversationID'])) {
        echo json_encode([
          "status" => "erreur",
          "message" => "Données manquantes"
        ]);
        return;
      }

      $message = htmlspecialchars(trim($verif['message']));
      $matchID = intval($verif['matchID']);
      $conversationID = intval($verif['conversationID']);




      $send = $this->Tchat->message($currentUserId, $matchID, $message, $conversationID);

      if ($send) {

        



        echo json_encode(["send" => "message envoyé"]);
      } else {
        echo json_encode([
          "status" => "empty",
          "message" => "erreur de l'envoie"
        ]);
      }
    } catch (\Throwable $th) {
      echo json_encode([
        "status" => "error",
        "message" => "Erreur serveur : " . $th->getMessage()
      ]);
    }
  }
}
