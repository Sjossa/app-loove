<?php
namespace backend\core;

class jwt
{
    public function __construct() {}

    public function jwt()
    {
        session_start();
        header('Content-type: application/json');

        if (isset($_SESSION['jwt'])) {
            echo json_encode(["success" => true, "jwt" => $_SESSION['jwt']]);
        } else {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Non authentifié"]);
        }
    }
}
