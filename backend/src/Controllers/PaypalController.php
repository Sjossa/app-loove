<?php

namespace backend\Controllers;

use Exception;
use backend\Core\SessionManager;
use backend\models\Paypal;

class PaypalController
{
    private $paypalmodel;

    public function __construct($database)
    {
        $this->paypalmodel = new Paypal($database);
    }

    public function ipn()
    {
        SessionManager::startSession();
        header('Content-Type: application/json');

        $logError = function(string $message) {
            $logDir = __DIR__ . '/../../logs';
            if (!is_dir($logDir)) mkdir($logDir, 0755, true);
            file_put_contents($logDir . '/paypal_ipn_errors.txt', '[' . date('Y-m-d H:i:s') . "] $message\n", FILE_APPEND);
        };

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $logError("Méthode non autorisée: {$_SERVER['REQUEST_METHOD']}");
            http_response_code(405);
            return;
        }

        $postData = $_POST;
        if (empty($postData)) {
            $logError("Aucune donnée POST reçue.");
            http_response_code(400);
            return;
        }

        $logError("Données IPN reçues: " . print_r($postData, true));

        // Validation IPN auprès de PayPal
        $req = 'cmd=_notify-validate';
        foreach ($postData as $key => $value) {
            $req .= '&' . $key . '=' . urlencode(stripslashes($value));
        }

        $ch = curl_init('https://ipnpb.sandbox.paypal.com/cgi-bin/webscr');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => false,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $req,
            CURLOPT_SSL_VERIFYPEER => true
        ]);
        $res = curl_exec($ch);
        if (curl_errno($ch)) {
            $logError("Erreur cURL: " . curl_error($ch));
            curl_close($ch);
            http_response_code(500);
            return;
        }
        curl_close($ch);

        $logError("Réponse PayPal: $res");
        if ($res !== 'VERIFIED') {
            $logError("IPN non vérifié.");
            http_response_code(400);
            return;
        }

        // Gérer seulement les paiements récurrents
        $txnType = $postData['txn_type'] ?? '';
        if ($txnType !== 'subscr_payment') {
            $logError("Type IPN ignoré: $txnType");
            echo json_encode(["status" => "ignored", "message" => "Type IPN non traité"]);
            return;
        }

        // Vérification des champs critiques
        $required = ['payment_status', 'receiver_email', 'mc_gross', 'custom'];
        foreach ($required as $field) {
            if (empty($postData[$field])) {
                $logError("Champ '$field' manquant.");
                http_response_code(400);
                return;
            }
        }

        if ($postData['payment_status'] !== 'Completed') {
            $logError("Statut paiement: {$postData['payment_status']}, attendu: Completed");
            http_response_code(400);
            return;
        }

        if (strtolower($postData['receiver_email']) !== 'meetlink@admin.com') {
            $logError("Email receveur invalide: {$postData['receiver_email']}");
            http_response_code(400);
            return;
        }

        if ($postData['mc_gross'] !== '54.99') {
            $logError("Montant inattendu: {$postData['mc_gross']}");
            http_response_code(400);
            return;
        }

        // Traitement du jeton JWT
        try {
            $jwt = $postData['custom'];
            $payload = json_decode(base64_decode(explode('.', $jwt)[1] ?? ''), true);
            $userId = $payload['id'] ?? null;
            if (!$userId) throw new Exception("ID utilisateur introuvable dans le JWT.");

            $logError("ID utilisateur: $userId");

            if (!$this->paypalmodel->abonement($userId)) {
                throw new Exception("Échec enregistrement abonnement.");
            }

            echo json_encode(["status" => "success"]);
        } catch (Exception $e) {
            $logError("Erreur JWT ou DB: " . $e->getMessage());
            http_response_code(400);
        }
    }
}
