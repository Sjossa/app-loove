class Chatbot {
  constructor() {
    this.questions = [
      { key: "prenom", text: "Quelle est votre prénom ?" },
      { key: "nom", text: "Quel est votre nom de famille ?" },
      { key: "age", text: "Quel âge avez-vous ?" },
      { key: "email", text: "Quelle est votre adresse mail ?" },
      { key: "password", text: "Quel sera votre mot de passe ?" },
      { key: "role", text: "Pourquoi êtes-vous ici ?" },
      {
        key: "profile_picture",
        text: "Veuillez choisir une photo de profil (de préférence vous).",
      },
    ];

    this.messages = {
      intro: "Bonjour, je suis MCLink, votre compagnon pour l'inscription.",
      end: "Merci pour vos réponses !",
      errors: {
        email: "Erreur : veuillez entrer une adresse mail valide.",
        age: "Erreur : vous devez avoir au moins 15 ans.",
        upload: "Erreur lors de l'upload de l'image.",
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

    this.btnNext.addEventListener("click", () => this.Next_Question());
    this.btnPrev.addEventListener("click", () => this.Prev_Question());

    setTimeout(() => {
      this.displayQuestion();
    }, 1000);
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

      if (this.btnNext.disabled) {
        this.btnNext.disabled = false;
      }
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

          console.log("Image uploadée :", data.path);
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

    console.log("Réponses collectées :", this.responses);

    fetch("https://back.meetlink.local/users/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.responses),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("Réponse API :", result);
        this.chatZone.innerHTML +=
          "<br>Vos informations ont été envoyées avec succès.";
      })
      .catch((err) => {
        console.error("Erreur envoi final :", err);
        this.chatZone.innerHTML +=
          "<br>Une erreur est survenue lors de l'envoi.";
      });
  }
}

export { Chatbot };
