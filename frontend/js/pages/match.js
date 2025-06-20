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

    this.initVisibility();
    this.loadProfil();
    this.initChoix();
  }

  initChoix() {
    if (!this.matchBtn) return;

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

  initVisibility() {
    if (!this.btn_profil) return;

    this.btn_profil.addEventListener("click", () => {
      const isHidden = this.profil.hasAttribute("hidden");
      this.profil.toggleAttribute("hidden");
      this.btn_profil.setAttribute("aria-expanded", String(!isHidden));

      if (this.match && this.card) {
        if (isHidden) {
          this.match.classList.add("grid-mode");
          this.card.classList.add("card-grid-mode");
          this.card.classList.remove("card");

          // Cache tout sauf le bouton
          this.info.classList.add("hide-infos");

          if (this.btn_choix?.id === "choix") {
            this.btn_choix.id = "choix-gride";
          }
        } else {
          if (this.btn_choix?.id === "choix-gride") {
            this.btn_choix.id = "choix";
          }
          this.match.classList.remove("grid-mode");
          this.card.classList.remove("card-grid-mode");
          this.card.classList.add("card");

          // Affiche tout
          this.info.classList.remove("hide-infos");
        }
      }
    });
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
        body: JSON.stringify({ id: this.getUserIdFromJwt() }),
        credentials: "include",
      });

      const data = await response.json();

      if (!data.user) throw new Error("Données invalides");

      this.profil_show = data.user.id;
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
    console.log("Image récupérée :", user.profile_picture);

    fields.forEach((field) => {
      document.querySelectorAll(`[data-user="${field}"]`).forEach((element) => {
        if (element) {
          element.textContent =
            field === "age"
              ? `${user[field]} ans`
              : user[field] || "Non renseigné";
        }
      });
    });
    const img = document.querySelector(".card__image");
    if (img) {
      if (user.profile_picture) {
        img.src = `https://back.meetlink.local/${user.profile_picture}`;
      } else {
        img.src = "../../images/amadou.jpg";
      }
      img.alt = `Photo de profil de ${user.prenom}`;
    }
  }

  async match_love() {
    if (!this.profil_show) {
      console.error("Aucun profil chargé pour liker");
      return;
    }

    try {
      await fetch("https://back.meetlink.local/match/like", {
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
      console.error("Aucun profil chargé pour disliker");
      return;
    }

    try {
      await fetch("https://back.meetlink.local/match/dislike", {
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
      });
    } catch (error) {
      console.error("Erreur de dislike :", error);
    }
  }
}
