export class Profil {
  constructor(jwt) {
    this.jwt = jwt;
    this.button = document.querySelector("#Modifier");
    this.button2 = document.querySelector("#deconnexion");

    this.username = document.querySelector('[data-user="nom"]');
    this.prenom = document.querySelector('[data-user="prenom"]');
    this.age = document.querySelector('[data-user="age"]');
    this.localisation = document.querySelector('[data-user="localisation"]');
    this.profile_picture = document.querySelector(
      '[data-user="profile_picture"]'
    );
    this.status = document.querySelector('[data-user="statut"]');
    this.orientation = document.querySelector('[data-user="orientation"]');
    this.relation_recherchee = document.querySelector(
      '[data-user="relation_recherchee"]'
    );
    this.bio = document.querySelector('[data-user="bio"]');
    this.petit_plus = document.querySelector('[data-user="petit_plus"]');
    this.loadProfile();
    this.modification();
    this.deconexion();
  }

  async loadProfile() {
    try {
      const response = await fetch("https://back.meetlink.local/users/profil", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      if (!data.success || !data.user) throw new Error("Données invalides");

      this.displayUser(data.user);
    } catch (error) {
      console.error("Erreur chargement profil:", error);
    }
  }

  displayUser(user) {
    if (this.prenom) this.prenom.value = user.prenom || "";
    if (this.username) this.username.value = user.nom || "";
    if (this.age) this.age.value = user.age || "";
    if (this.localisation) this.localisation.value = user.localisation || "";
    if (this.profile_picture)
      this.profile_picture.src =
        user.profile_picture || "chemin/par-defaut.jpg";
    if (this.status) this.status.value = user.statut || "";
    if (this.orientation) this.orientation.value = user.orientation || "";
    if (this.relation_recherchee)
      this.relation_recherchee.value = user.relation_recherchee || "";
    if (this.bio) this.bio.value = user.bio || "";
    if (this.petit_plus) this.petit_plus.value = user.petit_plus || "";
  }

  modification() {
    this.button.addEventListener("click", () => {
      this.enableEditing();
    });
  }

  enableEditing() {
    const inputs = document.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.disabled = false;
    });
    this.button.textContent = "Sauvegarder";
    this.button.removeEventListener("click", this.enableEditing);
    this.button.addEventListener("click", () => this.saveProfile());
  }

  async saveProfile() {
    const userData = {
      prenom: this.prenom.value,
      nom: this.username.value,
      age: this.age.value,
      localisation: this.localisation.value,
      statut: this.status.value,
      orientation: this.orientation.value,
      relation_recherchee: this.relation_recherchee.value,
      bio: this.bio.value,
      petit_plus: this.petit_plus.value,
    };

    try {
      const response = await fetch("https://back.meetlink.local/users/update", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!data.success) {
        alert("Erreur lors de la sauvegarde");
        return;
      }

      alert("Profil mis à jour !");
      this.disableEditing();
    } catch (error) {
      console.error("Erreur sauvegarde profil:", error);
      alert("Erreur lors de la sauvegarde");
    }
  }

  disableEditing() {
    const inputs = document.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.disabled = true;
    });
    this.button.textContent = "Modifier";
    this.button.removeEventListener("click", this.saveProfile);
    this.button.addEventListener("click", () => this.enableEditing());
  }

  async deconexion() {
    if (!this.button2) {
      console.log("Le bouton n'existe pas");
      return;
    }

    try {
      this.button2.addEventListener("click", async () => {
        const response = await fetch(
          "https://back.meetlink.local/users/deconnexion",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.jwt}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (response.ok) {
          window.location.href = "/index";
        } else {
          console.error("Erreur de déconnexion", await response.text());
          alert("Erreur de déconnexion, veuillez réessayer.");
        }
      });
    } catch (error) {
      console.error("Une erreur s'est produite:", error);
      alert("Une erreur est survenue, veuillez réessayer.");
    }
  }
}
