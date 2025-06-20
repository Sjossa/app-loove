class Chatbot {
  constructor() {
    this.questions = [
      { key: "prenom", text: "Quel est votre prénom ?" },
      { key: "nom", text: "Et ton nom de famille ?" },
      { key: "age", text: "Quel âge as-tu ?" },
      { key: "localisation", text: "Où habites-tu (ville) ?" },
      { key: "email", text: "Quelle est ton adresse mail ?" },
      { key: "password", text: "Choisis un mot de passe sécurisé." },
      { key: "statut", text: "Quel est ton statut sentimental ?" },
      { key: "orientation", text: "Quelle est ton orientation ?" },
      {
        key: "relation_recherchee",
        text: "Quel type de relation cherches-tu ?",
      },
      {
        key: "interets",
        text: "Parle-moi de tes centres d’intérêt ou passions.",
      },
      { key: "bio", text: "Une petite bio pour te présenter ?" },
      { key: "petit_plus", text: "Un petit plus ou fun fact à partager ?" },
      { key: "profile_picture", text: "Choisis une photo de profil sympa !" },
    ];

    this.messages = {
      intro: "Salut, je suis MCLink. Prêt(e) à créer ton profil ?",
      end: "🎉 Merci ! Ton profil est prêt à être sauvegardé.",
      errors: {
        email: "❌ Adresse email invalide.",
        age: "❌ Tu dois avoir au moins 15 ans.",
        upload: "❌ Problème lors de l’envoi de la photo.",
      },
    };

    this.responses = {};
    this.index = 0;

    this.chatZone = document.querySelector("#zone_chat");
    this.input = document.querySelector("#user_input");
    this.btnNext = document.querySelector("#next");
    this.btnPrev = document.querySelector("#previous");

    this.inputPhoto = null;
  }

  init() {
    this.chatZone.innerHTML = "";
    this.displayBubble(this.messages.intro);
    this.input.style.display = "none";

    this.btnNext.addEventListener("click", () => this.nextQuestion());
    this.btnPrev.addEventListener("click", () => this.prevQuestion());

    this.input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.nextQuestion();
      }
    });

    setTimeout(() => this.displayQuestion(), 1000);
  }

  displayBubble(text, isUser = false) {
    const bubble = document.createElement("div");
    bubble.classList.add("message-bubble");
    if (isUser) bubble.classList.add("message-user");
    bubble.textContent = text;
    this.chatZone.appendChild(bubble);
    this.chatZone.scrollTop = this.chatZone.scrollHeight;
  }

  displayTyping() {
    const typing = document.createElement("div");
    typing.classList.add("typing");
    typing.innerHTML = "<span></span><span></span><span></span>";
    this.chatZone.appendChild(typing);
    this.chatZone.scrollTop = this.chatZone.scrollHeight;
    return typing;
  }

 displayQuestion() {
  const current = this.questions[this.index];
  const typing = this.displayTyping();

  setTimeout(() => {
    typing.remove();
    this.displayBubble(current.text);

    if (current.key === "profile_picture") {
      this.input.style.display = "none";
      this.showPhotoInput();
    } else {
      if (this.inputPhoto) this.inputPhoto.style.display = "none";
      this.input.style.display = "block";

      if (current.key === "password") {
        this.input.type = "password";
      } else {
        this.input.type = "text";
      }

      this.input.value = this.responses[current.key] || "";
      this.input.focus();
    }
  }, 600);
}


  questionValide() {
    const { key } = this.questions[this.index];
    const value = this.input.value.trim();

    if (
      (key === "prenom" || key === "nom" || key === "email") &&
      value === ""
    ) {
      this.displayBubble(`❌ Le champ ${key} est obligatoire.`);
      return false;
    }

    if (key === "age" && !/^(?:1[5-9]|[2-9][0-9])$/.test(value)) {
      this.displayBubble(this.messages.errors.age);
      return false;
    }

    if (key === "email" && !/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(value)) {
      this.displayBubble(this.messages.errors.email);
      return false;
    }

    return true;
  }

  nextQuestion() {
    const current = this.questions[this.index];

    if (current.key !== "profile_picture") {
      if (!this.questionValide()) return;
      this.responses[current.key] = this.input.value.trim();
      this.displayBubble(this.input.value.trim(), true);
    }

    this.index++;
    if (this.index < this.questions.length) {
      this.displayQuestion();
    } else {
      this.sendData();
    }
  }

  prevQuestion() {
    if (this.index > 0) {
      this.index--;
      this.displayQuestion();
      this.btnNext.disabled = false;
    }
  }

  showPhotoInput() {
    if (!this.inputPhoto) {
      this.inputPhoto = document.createElement("input");
      this.inputPhoto.type = "file";
      this.inputPhoto.accept = "image/*";
      this.inputPhoto.style.marginTop = "10px";
      this.chatZone.appendChild(this.inputPhoto);

      this.inputPhoto.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
          const res = await fetch("https://back.meetlink.local/upload", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) throw new Error("Échec upload");

          const data = await res.json();
          this.responses["profile_picture"] = data.path;
          this.displayBubble("📸 Image téléchargée avec succès", true);
        } catch {
          this.displayBubble(this.messages.errors.upload);
        }
      });
    } else {
      this.inputPhoto.style.display = "block";
    }
  }

  sendData() {
    this.displayBubble(this.messages.end);
    this.btnNext.disabled = true;

    fetch("https://back.meetlink.local/users/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.responses),
    })
      .then((res) => res.json())
      .then((result) => {
        this.displayBubble("📬 Ton profil a été enregistré avec succès !");

        const loginData = {
          email: this.responses.email,
          password: this.responses.password,
        };

        return fetch("https://back.meetlink.local/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
          credentials: "include",
        });
      })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          window.location.href = "/index";
        } else {
          this.displayBubble(
            result.message || "Identifiants incorrects",
            false
          );
        }
      })
      .catch((err) => {
        console.error("Erreur lors de l'envoi :", err);
        this.displayBubble("⚠️ Une erreur est survenue. Veuillez réessayer.");
      });
  }
}

export { Chatbot };
