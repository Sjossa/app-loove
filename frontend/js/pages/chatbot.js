class Chatbot {
  constructor() {
    this.questions = [
      { key: "prenom", text: "Quelle est votre prenom ?" },
      { key: "nom", text: "Quel est votre  nom de famille ?" },
      { key: "age", text: "Quel âge avez-vous ?" },
      { key: "email", text: "Quelle est votre adresse mail ?" },
      { key: "password", text: "Quelle sera votre mot de passe" },
      { key: "photo", text: "Souhaitez-vous ajouter une photo de profil ?" },
      { key: "bio", text: "Souhaitez-vous rédiger une bio ?" },
      { key: "role", text: "Quel est votre métier/spécialisation ?" },
    ];

    this.talk = [
      "Bonjour, je suis MCLink, votre compagnon pour l'inscription.",
      "Wow, vous avez un magnifique prénom.",
      "Voici un récapitulatif de vos données.",
      "Merci pour vos réponses !",
    ];

    this.erreur = [
      "Erreur : veuillez entrer une adresse mail valide.",
      "Erreur : vous devez avoir au moins 15 ans.",
    ];

    this.reponse = {};
    this.index_question = 0;
    this.chat_zone = document.querySelector("#zone_chat");
    this.next = document.querySelector("#next");
    this.previous = document.querySelector("#previous");
    this.input = document.querySelector("#user_input");
  }

  verif_question() {
    const { key } = this.questions[this.index_question];
    const value = this.input.value.trim();

    if (key === "age") {
      const ageRegex = /^(?:1[5-9]|[2-9][0-9]|\d{3,})$/;
      if (!ageRegex.test(value)) {
        this.chat_zone.innerHTML = this.erreur[1];
        return false;
      }
    }

    if (key === "email") {
      const mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!mailRegex.test(value)) {
        this.chat_zone.innerHTML = this.erreur[0];
        return false;
      }
    }

    return true;
  }

  next_question() {
    if (this.input && this.index_question < this.questions.length) {
      if (!this.verif_question()) return;

      const current = this.questions[this.index_question];
      this.reponse[current.key] = this.input.value;
    }

    this.index_question++;

    if (this.index_question < this.questions.length) {
      const current = this.questions[this.index_question];
      this.chat_zone.innerHTML = current.text;
      this.input.value = this.reponse[current.key] || "";
    } else {
      this.chat_zone.innerHTML = this.talk[3];
      this.next.disabled = true;

      console.log("Réponses collectées :", this.reponse);

      fetch("http://api.app-loove.local/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.reponse),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("Réponse de l'API :", result);
          this.chat_zone.innerHTML +=
            "<br>Vos informations ont été envoyées avec succès.";
        })
        .catch((error) => {
          console.error("Erreur lors de l'envoi :", error);
          this.chat_zone.innerHTML +=
            "<br>Une erreur est survenue lors de l'envoi.";
        });
    }
  }

  previous_questions() {
    if (this.index_question > 0) {
      this.index_question--;
      const current = this.questions[this.index_question];
      this.chat_zone.innerHTML = current.text;
      this.input.value = this.reponse[current.key] || "";

      if (this.next.disabled) {
        this.next.disabled = false;
      }
    }
  }

  start_chat() {
    this.chat_zone.innerHTML = this.talk[0];
  }

  init() {
    this.start_chat();
    this.next.addEventListener("click", () => this.next_question());
    this.previous.addEventListener("click", () => this.previous_questions());
    setTimeout(() => {
      this.chat_zone.innerHTML = this.questions[this.index_question].text;
    }, 5000);
  }
}

export { Chatbot };
