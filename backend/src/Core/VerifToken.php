<?php

namespace backend\core;

use backend\Core\SessionManager;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class VerifToken {

    public static function verifyToken() {
    SessionManager::startSession();

    if (empty($_SESSION['jwt'])) {
        throw new Exception("Non authentifié");
    }

    $jwt = $_SESSION['jwt'];
    $key = $_ENV['JWT_SECRET'] ?? '';

    $decoded = JWT::decode($jwt, new Key($key, 'HS256'));

    if ($decoded->exp < time()) {
        throw new Exception("Jeton expiré");
    }


    return $decoded->id;
}

}
