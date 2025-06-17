class WSClient {
  constructor() {
    this.socket = null;
    this.onMessageCallback = null;
  }

connect(jwt) {
  this.jwt = jwt;
  // console.log(this.jwt);

  if (
    this.socket &&
    (this.socket.readyState === WebSocket.OPEN ||
      this.socket.readyState === WebSocket.CONNECTING)
  ) {
    console.log("⚠️ Une connexion WebSocket est déjà en cours.");
    return;
  }

  this.socket = new WebSocket("ws://localhost:8080");

  this.socket.onopen = () => {
    // console.log("✅ WebSocket connectée !");

    this.socket.send(JSON.stringify({ type: "auth", token: this.jwt }));
  };

  this.socket.onmessage = (event) => {
    // console.log("📨 Message reçu :", event.data);
    if (this.onMessageCallback) {
      this.onMessageCallback(JSON.parse(event.data));
    }
  };

  this.socket.onclose = () => {
    // // console.log("❌ Connexion WebSocket fermée.");
    this.socket = null;
  };

  this.socket.onerror = (error) => {
    console.error("🚨 Erreur WebSocket :", error);
  };
}


  onMessage(callback) {
    this.onMessageCallback = callback;
  }

  send(data) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      // console.log("WebSocket non connecté");
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const wsClient = new WSClient();
