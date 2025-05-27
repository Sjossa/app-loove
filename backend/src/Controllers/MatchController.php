<?php

namespace backend\Controllers;

use backend\models\MatchProfils;
use backend\Core\SessionManager;
use Exception;


class MatchController {

       private $matchModel;


    public function __construct($database) {
        $this->matchModel = new MatchProfils($database);
    }

    public function profilGenerate() {
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
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Méthode non autorisée"
            ]);
        }
    }
}
