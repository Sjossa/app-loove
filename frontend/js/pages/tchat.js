export class Tchat {
  constructor(jwt) {
    this.jwt = jwt;

    this.messagerie = document.querySelector(".messagerie");
    this.close = document.querySelector(".close");
    this.liste_contenue = document.querySelector(".liste_contenue");
    this.send_button = document.querySelector(".send");

    this.liste_message = document.querySelector(".liste_message");
    this.list_match = document.querySelector(".list_match");

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
      console.log("Erreur : .liste_contenue ou .close est null");
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
      console.log(data);

      console.log("Conversation reçue :", data.conversation.conversation_id);



      if (!this.send_button) {
        console.log("Le button envoyer n'existe pas");
      } else {
        this.send_button.addEventListener("click", () => {
          this.message_value = document.querySelector(".message2").value;
          this.send(this.message_value,matchID,data.conversation.conversation_id);
        });
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des conversations :",
        error
      );
    }
  }

  async send(message,matchID,conversationID) {
    try {
      const response = await fetch("https://back.meetlink.local/tchat/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ message , matchID , conversationID }),
      });

      const data = await response.json();
      console.log("Message envoyé :", data);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
    }
  }
}
