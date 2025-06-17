<?php
require __DIR__ . '/../vendor/autoload.php';

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use backend\config\Database;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Dotenv\Dotenv;
use backend\models\Profil;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();



class Chat implements MessageComponentInterface
{
  protected $clients;
  protected $users;
  private $websocket;


  public function __construct()
  {
    $this->clients = new \SplObjectStorage;
    $this->users = [];
    $database = new Database();
    $this->websocket = new Profil($database);
  }

  public function onOpen(ConnectionInterface $conn)
  {
    $this->clients->attach($conn);
    echo "Nouvelle connexion : ({$conn->resourceId})\n";
  }

  public function onMessage(ConnectionInterface $from, $msg)
  {
    
    $data = json_decode($msg, true);
     var_dump($data);
    if ($data === null) {
      return;
    }



    if (!isset($data['type'])) {
      var_dump($data);


      echo "Message reçu sans type\n";
      return;
    }

    switch ($data['type']) {
      case 'auth':
        $token = $data['token'] ?? null;
        if (!$token) {
          $from->send(json_encode(['type' => 'auth', 'success' => false, 'message' => 'Token manquant']));
          return;
        }

        try {
          $secretKey = $_ENV['JWT_SECRET'] ?? '';
          $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));


          $userId = $decoded->id ?? null;
          if (!$userId) {
            throw new Exception("Token invalide: userId manquant");
          }


          $this->users[$from->resourceId] = $userId;


          $result = $this->websocket->only($userId);



          $from->send(json_encode(['type' => 'auth', 'success' => true, 'message' => 'Authentification réussie']));

          echo "Connexion {$from->resourceId} authentifiée pour user {$userId}\n";
        } catch (\Exception $e) {
          $from->send(json_encode(['type' => 'auth', 'success' => false, 'message' => 'Token invalide']));
          echo "Erreur auth: " . $e->getMessage() . "\n";
        }
        break;

      case 'message':
        // Diffuser le message à tous les clients
        $jsonsend = json_encode($data);
        foreach ($this->clients as $client) {
          $client->send($jsonsend);
        }
        break;

      case 'like':
      case 'match':
        $fromUserId = $data['from_user_id'] ?? null;
        $toUserId = $data['to_user_id'] ?? null;
        $payload = $data['data'] ?? [];

        if (!$toUserId) {
          echo "User cible manquant pour notification $data[type]\n";
          return;
        }

        echo "User $fromUserId a liké user $toUserId\n";

        foreach ($this->clients as $client) {
          $clientId = $client->resourceId;

          if (isset($this->users[$clientId]) && $this->users[$clientId] == $toUserId) {
            $client->send(json_encode([
              'type' => $data['type'],
              'data' => $payload
            ]));
            echo "Notification envoyée à l'utilisateur $toUserId\n";
          }
        }
        break;


      default:
        echo "Type de message inconnu: {$data['type']}\n";
        break;
    }
  }

  public function onClose(ConnectionInterface $conn)
  {
    $this->clients->detach($conn);
    echo "Connexion fermée : ({$conn->resourceId})\n";
  }

  public function onError(ConnectionInterface $conn, \Exception $e)
  {
    echo "Erreur : {$e->getMessage()}\n";
    $conn->close();
  }
}

$server = IoServer::factory(
  new HttpServer(
    new WsServer(
      new Chat()
    )
  ),
  8080
);

echo "Serveur WebSocket démarré sur le port 8080\n";
$server->run();
