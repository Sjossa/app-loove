<?php

namespace backend\Core;

use backend\Core\SessionManager;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;
use Exception;

class VerifToken {

    public static function verifyToken() {
        SessionManager::startSession();

        if (!isset($_SESSION['jwt'])) {
            throw new Exception("Non authentifié");
        }

        $jwt = $_SESSION['jwt'];
        $key = $_ENV['JWT_SECRET'] ?? '';

        if (empty($key)) {
            throw new Exception("Clé secrète JWT non configurée");
        }

        try {
            $decoded = JWT::decode($jwt, new Key($key, 'HS256'));

            if ($decoded->exp < time()) {
                throw new ExpiredException("Jeton expiré");
            }

            return $decoded;
        } catch (ExpiredException $e) {
            throw new Exception("Jeton expiré : " . $e->getMessage());
        } catch (SignatureInvalidException $e) {
            throw new Exception("Signature du jeton invalide : " . $e->getMessage());
        } catch (Exception $e) {
            throw new Exception("Erreur de vérification du jeton : " . $e->getMessage());
        }
    }
}
