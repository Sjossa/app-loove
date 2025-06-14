export class Tchat {
  constructor(jwt) {
    this.jwt = jwt;
    this.socket = new WebSocket("ws://localhost:8080");

    this.socket.onopen = () => {
      console.log("WebSocket connecté");
    };

    this.socket.onerror = (error) => {
      console.error("Erreur WebSocket :", error);
    };

    this.socket.onclose = (event) => {
      console.log("WebSocket fermé", event);
    };

    this.socket.onmessage = (event) => {
      console.log("Message WebSocket reçu :", event.data);
      const data = JSON.parse(event.data);
      this.messag({
        conversation: {
          conversation_id: data.conversationID,
          messages: [data],
        },
      });
    };

    this.messagerie = document.querySelector(".messagerie");
    this.close = document.querySelector(".close");
    this.liste_contenue = document.querySelector(".liste-contenu");
    this.send_button = document.querySelector(".send");

    this.liste_message = document.querySelector(".liste-message");
    this.list_match = document.querySelector(".list-match");

    this.fermeture();
    this.liste();
  }

  // Gestion de l'affichage de la liste des conversations
  fermeture() {
    if (this.liste_contenue && this.close) {
      this.close.addEventListener("click", () => {
        const isHidden = this.liste_contenue.style.display === "none";
        this.liste_contenue.style.display = isHidden ? "" : "none";
        this.messagerie.style.gridTemplateColumns = isHidden
          ? "0.2fr 1fr"
          : "1fr";
      });
    } else {
      console.log("Erreur : .liste_contenue ou .close est null");
    }
  }

  // Chargement de la liste des matches/conversations
  async liste() {
    if (!this.list_match) {
      alert("La liste n'existe pas");
      return;
    }

    try {
      const response = await fetch("https://back.meetlink.local/tchat/list", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (data.status === "success" && data.user) {
        this.list_match.innerHTML = "";

        if (data.user.length > 0) {
          data.user.forEach((user) => {
            const li = document.createElement("li");
            li.textContent = user.prenom;
            li.dataset.id = user.id;
            li.classList.add("match");

            li.addEventListener("click", async () => {
              await this.conversation(user.id);
            });

            this.list_match.appendChild(li);
          });
        } else {
          this.list_match.innerHTML = "<li>Aucun match trouvé</li>";
        }
      } else if (data.status === "empty") {
        console.log("Aucun match trouvé");
      } else {
        throw new Error("Erreur inattendue");
      }
    } catch (error) {
      console.error("Erreur dans le chargement de la liste", error);
    }
  }

  // Récupération et affichage d'une conversation spécifique
  async conversation(matchID) {
    if (!this.liste_message) return;

    this.liste_message.innerHTML = "";

    try {
      const response = await fetch(
        "https://back.meetlink.local/tchat/conversation",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.jwt}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ matchID }),
        }
      );

      const data = await response.json();

      if (data) {
        if (!this.send_button) {
          console.log("Le bouton envoyer n'existe pas");
        } else {
          this.send_button.onclick = () => {
            const inputElement = document.querySelector(".message-input");
            if (!inputElement) return;

            this.message_value = inputElement.value.trim();

            if (this.message_value) {
              this.send(
                this.message_value,
                matchID,
                data.conversation.conversation_id
              );
            }
          };
        }

        this.messag(data);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des conversations :",
        error
      );
    }
  }

  // Envoi d'un message
  async send(message, matchID, conversationID) {
    try {
      const response = await fetch("https://back.meetlink.local/tchat/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ message, matchID, conversationID }),
      });

      const data = await response.json();
      console.log("Message envoyé via REST :", data);

      // Envoi du même message via WebSocket
      const messageData = {
        conversationID: conversationID,
        matchID: matchID,
        content: message,
        timestamp: Date.now(),
      };

      this.socket.send(JSON.stringify(messageData));
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
    }
  }

  // Affichage des messages dans la messagerie
  messag(data) {
    if (!this.liste_message) {
      ("erreur");
    }

    console.log(data);

    if (
      data &&
      data.conversation.conversation_id > 0 &&
      Array.isArray(data.conversation.messages)
    ) {
      data.conversation.messages.forEach((msg) => {
        const msgID = msg.id || msg.timestamp;
        if (!msgID) {
          console.log("erreur");
        }
        const exists = this.liste_message.querySelector(
          `li[data-id="${msg.id}"]`
        );
        if (!exists) {
          const li = document.createElement("li");
          li.textContent = msg.content || "";
          li.dataset.id = msg.id || msg.timestamp;
          li.classList.add("match");
          this.liste_message.appendChild(li);
        }
      });

      this.liste_message.scrollTop = this.liste_message.scrollHeight;
    }
  }
}
