<?php

namespace backend\Controllers;

use backend\models\Tchat;
use backend\Core\VerifToken;
use Exception;

class TchatController{

  private $Tchat;

  public function __construct($database) {
        $this->Tchat = new Tchat($database);
    }


   public function Tchat_List(){
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


}
