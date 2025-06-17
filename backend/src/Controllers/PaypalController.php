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

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
      http_response_code(405);
      echo json_encode(["status" => "error", "message" => "Méthode non autorisée"]);
      return;
    }


    $postData = $_POST;

    $req = 'cmd=_notify-validate';
    foreach ($postData as $key => $value) {
      $value = urlencode(stripslashes($value));
      $req .= "&$key=$value";
    }

    $ch = curl_init('https://ipnpb.sandbox.paypal.com/cgi-bin/webscr');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $req);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    $res = curl_exec($ch);
    curl_close($ch);


    if ($res === "VERIFIED" && isset($postData['payment_status']) && $postData['payment_status'] === 'Completed') {
      try {
        $jwt = $postData['custom'] ?? null;
        if (!$jwt) {
          throw new Exception("Jeton JWT manquant dans le champ 'custom'.");
        }

        $currentUserId = null;
        $parts = explode('.', $jwt);
        if (count($parts) === 3) {
          $payload = json_decode(base64_decode($parts[1]), true);
          $currentUserId = $payload['id'] ?? null;
        }

        if (!$currentUserId) {
          throw new Exception("ID utilisateur introuvable dans le JWT.");
        }

        $abonnement = $this->paypalmodel->abonement($currentUserId);

        if ($abonnement) {
          echo json_encode(["status" => "success"]);
        } else {
          throw new Exception("L'abonnement n'a pas pu être enregistré.");
        }
      } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
      }
    } else {
      http_response_code(400);
      echo json_encode(["status" => "error", "message" => "IPN non vérifié ou paiement incomplet."]);
    }
  }
}
