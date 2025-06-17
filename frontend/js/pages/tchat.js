import { wsClient } from "../utils/WebSocket.js";

export class Tchat {
  constructor(jwt) {
    this.jwt = jwt;

    wsClient.connect(this.jwt);

    wsClient.onMessage((data) => {

      const currentConvID = this.liste_message.dataset.conversationId;
      if (data.conversationID == currentConvID) {
        this.afficherMessages({
          conversation: {
            conversation_id: data.conversationID,
            messages: [data],
          },
        });
      }
    });

    this.messagerie = document.querySelector(".messagerie");
    this.close = document.querySelector(".close");
    this.liste_contenue = document.querySelector(".liste-contenu");
    this.send_button = document.querySelector(".send");
    this.liste_message = document.querySelector(".liste-message");
    this.list_match = document.querySelector(".list-match");

    this.fermeture();
    this.liste();
  }

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
      console.error("Erreur : .liste_contenue ou .close est null");
    }
  }

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
          console.error("Le bouton envoyer n'existe pas");
        } else {
          this.send_button.onclick = () => {
            const inputElement = document.querySelector(".message-input");
            if (!inputElement) return;

            const message_value = inputElement.value.trim();

            if (message_value) {
              this.send(
                message_value,
                matchID,
                data.conversation.conversation_id
              );
              inputElement.value = ""; // Vide l'input après envoi
            }
          };
        }

        this.afficherMessages(data);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des conversations :",
        error
      );
    }
  }

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

      if (data.status === "succes") {
        const messageData = {
          type : "message",
          conversationID: conversationID,
          matchID: matchID,
          content: message,
          timestamp: Date.now(),
        };
        wsClient.send(messageData)
      } else {
        console.warn("WebSocket n'est pas connecté.");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
    }
  }

  afficherMessages(data) {
    if (!this.liste_message) {
      console.error("Liste des messages introuvable");
      return;
    }

    this.liste_message.dataset.conversationId = data.conversation?.conversation_id;
    console.log(data);

    if (
      data &&
      data.conversation?.conversation_id > 0 &&
      Array.isArray(data.conversation.messages)
    ) {
      data.conversation.messages.forEach((msg) => {
        const msgID = msg.id || msg.timestamp;
        if (!msgID) {
          console.warn("Message sans ID");
          return;
        }
        const exists = this.liste_message.querySelector(
          `li[data-id="${msgID}"]`
        );
        if (!exists) {
          const li = document.createElement("li");
          li.textContent = msg.content || "";
          li.dataset.id = msgID;
          li.classList.add("message-item");
          this.liste_message.appendChild(li);
        }
      });

      this.liste_message.scrollTop = this.liste_message.scrollHeight;
    }
  }
}
