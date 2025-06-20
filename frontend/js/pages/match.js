export class Match {
  constructor(jwt) {
    this.jwt = jwt;
    this.profil = document.querySelector("#match-profil");
    this.btn_profil = document.querySelector("#btn_profil");
    this.card = document.querySelector(".card");
    this.match = document.querySelector("#match");
    this.btn_choix = document.querySelector("#choix");
    this.matchBtn = document.querySelector(".matchbtn");
    this.skipBtn = document.querySelector(".skip");
    this.info = document.querySelector(".card-info");
    this.btnprofil = document.querySelector(".btnprofil");

    if (this.matchBtn) {
      this.matchBtn.disabled = true;
    }

    this.visibility();
    this.loadProfil();
    this.choix();
  }

  choix() {
    if (this.matchBtn) {
      this.matchBtn.addEventListener("click", async () => {
        try {
          await this.match_love();
          await this.loadProfil();
        } catch (error) {
          console.error("Erreur dans le match ou le chargement :", error);
        }
      });

      if (this.skipBtn) {
        this.skipBtn.addEventListener("click", async () => {
          try {
            await this.dislike();
            await this.loadProfil();
          } catch (error) {
            console.error("Erreur dans le match ou le chargement :", error);
          }
        });
      }
    }
  }

  visibility() {
    if (this.btn_profil) {
      this.btn_profil.addEventListener("click", () => {
        const isHidden = this.profil.hasAttribute("hidden");
        this.profil.toggleAttribute("hidden");
        this.btn_profil.setAttribute("aria-expanded", String(!isHidden));

        if (this.match && this.card) {
          if (isHidden) {
            this.match.classList.add("grid-mode");
            this.card.classList.add("card-grid-mode");
            this.card.classList.remove("card");
            this.info.style.display = "none";
           if (this.btn_choix.id === "choix") {
    this.btn_choix.id = "choix-gride";
  }

          } else {
            // Réinitialisation
            this.match.classList.remove("grid-mode");
            this.card.classList.remove("card-grid-mode");
            this.card.classList.add("card");
          }
        }
      });
    }
  }

  getUserIdFromJwt() {
    try {
      const payload = JSON.parse(atob(this.jwt.split(".")[1]));
      return payload.id || null;
    } catch {
      return null;
    }
  }

  async loadProfil() {
    try {
      const response = await fetch("https://back.meetlink.local/match", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: this.getUserIdFromJwt(),
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!data.user) throw new Error("Données invalides");
      this.profil_show = data.user.id;
      // console.log(this.profil_show);

      this.displayInfo(data.user);

      if (this.matchBtn) {
        this.matchBtn.disabled = false;
      }
    } catch (error) {
      console.error("Erreur chargement profil:", error);
    }
  }

  displayInfo(user) {
    const fields = [
      "prenom",
      "age",
      "localisation",
      "bio",
      "statut",
      "orientation",
      "relation_recherchee",
      "interets",
      "petit_plus",
    ];

    fields.forEach((field) => {
      const elements = document.querySelectorAll(`[data-user="${field}"]`);
      elements.forEach((element) => {
        if (element) {
          element.textContent =
            field === "age"
              ? `${user[field]} ans`
              : user[field] || "Non renseigné";
        }
      });
    });

    const img = document.querySelector(".card__image");
    if (img && user.profile_picture) {
      img.src = `../images/${user.profile_picture}`;
      img.alt = `Photo de profil de ${user.prenom}`;
    }
  }

  async match_love() {
    if (!this.profil_show) {
      console.error("Aucun profil chargé pour liker");
      return;
    }

    try {
      const response = await fetch("https://back.meetlink.local/match/like", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          liker_id: this.getUserIdFromJwt(),
          liked_id: this.profil_show,
        }),
        credentials: "include",
      });
    } catch (error) {
      console.error("Erreur de match :", error);
    }
  }

  async dislike() {
    if (!this.profil_show) {
      console.error("Aucun profil chargé pour liker");
      return;
    }

    try {
      const response = await fetch(
        "https://back.meetlink.local/match/dislike",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.jwt}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dislike_id: this.getUserIdFromJwt(),
            disliked_id: this.profil_show,
          }),
          credentials: "include",
        }
      );
    } catch (error) {
      console.error("Erreur de match :", error);
    }
  }
}
