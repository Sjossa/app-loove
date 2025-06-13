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
      intro:
        "Salut, je suis MCLink. Prêt(e) à créer ton profil ?",
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
  }

  init() {
    this.chatZone.innerHTML = this.messages.intro;
    this.input.style.display = "none";

    this.btnNext.addEventListener("click", () => this.Next_Question());
    this.btnPrev.addEventListener("click", () => this.Prev_Question());

    setTimeout(() => this.displayQuestion(), 1000);
  }

  displayQuestion() {
    const current = this.questions[this.index];
    this.chatZone.innerHTML = current.text;

    if (current.key === "profile_picture") {
      this.input.style.display = "none";
      this.showPhotoInput();
    } else {
      this.input.style.display = "block";
      this.input.value = this.responses[current.key] || "";
    }
  }

  Question_valide() {
    const { key } = this.questions[this.index];
    const value = this.input.value.trim();

    if (key === "age" && !/^(?:1[5-9]|[2-9][0-9]|\d{3,})$/.test(value)) {
      this.chatZone.innerHTML = this.messages.errors.age;
      return false;
    }

    if (key === "email" && !/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(value)) {
      this.chatZone.innerHTML = this.messages.errors.email;
      return false;
    }

    return true;
  }

  Next_Question() {
    const current = this.questions[this.index];

    if (current.key !== "profile_picture") {
      if (!this.Question_valide()) return;
      this.responses[current.key] = this.input.value.trim();
    }

    this.index++;
    if (this.index < this.questions.length) {
      this.displayQuestion();
    } else {
      this.sendData();
    }
  }

  Prev_Question() {
    if (this.index > 0) {
      this.index--;
      this.displayQuestion();
      if (this.btnNext.disabled) this.btnNext.disabled = false;
    }
  }

  showPhotoInput() {
    const inputPhoto = document.createElement("input");
    inputPhoto.type = "file";
    inputPhoto.accept = "image/*";
    inputPhoto.style.marginTop = "10px";
    inputPhoto.style.display = "block";
    this.chatZone.appendChild(inputPhoto);

    inputPhoto.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch("https://back.meetlink.local/upload", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const errorText = await res.text();
            throw new Error("Réponse serveur non JSON : " + errorText);
          }

          const data = await res.json();
          this.responses["profile_picture"] = data.path;
        } catch (error) {
          console.error("Erreur upload image :", error);
          this.chatZone.innerHTML += `<br>${this.messages.errors.upload}`;
        }
      }
    });
  }

  sendData() {
    this.chatZone.innerHTML = this.messages.end;
    this.btnNext.disabled = true;

    console.log("Profil collecté :", this.responses);

    fetch("https://back.meetlink.local/users/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.responses),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("Réponse API :", result);
        this.chatZone.innerHTML +=
          "<br>📬 Ton profil a été enregistré avec succès !";
      })
      .catch((err) => {
        console.error("Erreur finale :", err);
        this.chatZone.innerHTML += "<br>⚠️ Une erreur est survenue à l’envoi.";
      });
  }
}

export { Chatbot };
