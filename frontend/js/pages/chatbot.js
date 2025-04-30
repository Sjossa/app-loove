class Chatbot {
  constructor() {
    this.question = [
      "qu'elle est votre adresse mail ?",
      "Quel est votre prénom et nom de famille ?",
      "Quel âge avez-vous ?",
      "Quel est votre métier/spécialisation ?",
      "Souhaitez-vous ajouter une photo de profil ?",
      "Souhaitez-vous rédiger une bio ?",
    ];

    this.talk = [
      "Bonjour, je suis MCLink, votre compagnon pour l'inscription.",
      "Wow, vous avez un magnifique prénom.",
      "Voici un récapitulatif de vos données.",
    ];

    this.erreur = [
      "erreur veuillez entrez une adresse mail valide",
      "erreur vous devrez avoir au-dessus de l'age l'egal",
    ]

    this.reponse = {};
    this.index_question = 0;
    this.chat_zone = document.querySelector("#zone_chat");
    this.next = document.querySelector("#next");
    this.previous = document.querySelector("#previous");
    this.input = document.querySelector("#user_input");
  }

  // Validation personnalisée selon la question
  verif_question() {
    const currentQuestion = this.question[this.index_question];
    const value = this.input.value.trim();

    if (this.index_question === 2) {
      const ageRegex = /^(?:1[5-9]|[2-9][0-9]|\d{3,})$/;

      if (!ageRegex.test(value)) {
        this.chat_zone.innerHTML = this.erreur[1];;
        return false;
      }
    }

    if (this.index_question === 0) {
      const mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!mailRegex.test(value)) {
        this.chat_zone.innerHTML = this.erreur[0];
        return false;
      }
    }

    return true;
  }

  next_question() {
    if (this.input && this.index_question < this.question.length) {
      if (!this.verif_question()) return;

      const currentQuestion = this.question[this.index_question];
      this.reponse[currentQuestion] = this.input.value;
    }

    this.index_question++;

    if (this.index_question < this.question.length) {
      this.chat_zone.innerHTML = this.question[this.index_question];
      const currentQuestion = this.question[this.index_question];
      this.input.value = this.reponse[currentQuestion] || "";
    } else {
      this.chat_zone.innerHTML = this.talk[3];
      console.log("Réponses collectées :", this.reponse);
    }
  }

  previous_questions() {
    if (this.index_question > 0) {
      this.index_question--;
      const previousQuestion = this.question[this.index_question];
      this.chat_zone.innerHTML = previousQuestion;
      this.input.value = this.reponse[previousQuestion] || "";
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
      this.chat_zone.innerHTML = this.question[this.index_question];
    }, 5000);
  }
}

export { Chatbot };
