export class Profil {
  constructor(jwt) {
    this.jwt = jwt;

    // Sélection des éléments
    this.button = document.querySelector("#modifier");
    this.button2 = document.querySelector("#deconnexion");

    if (!this.button) {
      console.error("Le bouton #modifier est introuvable !");
      return;
    }

    this.username = document.querySelector('[data-user="nom"]');
    this.prenom = document.querySelector('[data-user="prenom"]');
    this.age = document.querySelector('[data-user="age"]');
    this.localisation = document.querySelector('[data-user="localisation"]');
    this.profile_picture = document.querySelector('[data-user="profile_picture"]');
    this.status = document.querySelector('[data-user="statut"]');
    this.orientation = document.querySelector('[data-user="orientation"]');
    this.relation_recherchee = document.querySelector('[data-user="relation_recherchee"]');
    this.bio = document.querySelector('[data-user="bio"]');
    this.petit_plus = document.querySelector('[data-user="petit_plus"]');

    // On désactive tous les champs au départ
    document.querySelectorAll('input, textarea').forEach(el => el.disabled = true);
   document.querySelectorAll('input[type="number"]').forEach(input => {
  // Pour Firefox
  input.style.MozAppearance = 'textfield';

  // Pour Chrome, Safari, Edge, etc.
  input.style.setProperty('-webkit-appearance', 'none');
  input.style.margin = '0';
});

    this.loadProfile();
    this.setupButtonActions();
    this.setupDeconnexion();
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
    this.prenom.value = user.prenom || "";
    this.username.value = user.nom || "";
    this.age.value = user.age || "";
    this.localisation.value = user.localisation || "";
    this.status.value = user.statut || "";
    this.orientation.value = user.orientation || "";
    this.relation_recherchee.value = user.relation_recherchee || "";
    this.bio.value = user.bio || "";
    this.petit_plus.value = user.petit_plus || "";
    this.profile_picture.src = user.profile_picture || "chemin/par-defaut.jpg";
  }

  setupButtonActions() {
    this.button.addEventListener("click", () => {
      const isEditing = this.button.textContent === "Sauvegarder";
      if (isEditing) {
        this.saveProfile();
      } else {
        this.enableEditing();
      }
    });
  }

  enableEditing() {
    document.querySelectorAll('input, textarea').forEach(el => el.disabled = false);
    this.button.textContent = "Sauvegarder";
  }

  disableEditing() {
    document.querySelectorAll('input, textarea').forEach(el => el.disabled = true);
    this.button.textContent = "Modifier";
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

  setupDeconnexion() {
    if (!this.button2) {
      console.warn("Le bouton #deconnexion est introuvable !");
      return;
    }

    this.button2.addEventListener("click", async () => {
      try {
        const response = await fetch("https://back.meetlink.local/users/deconnexion", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.jwt}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          window.location.href = "/index";
        } else {
          console.error("Erreur de déconnexion", await response.text());
          alert("Erreur de déconnexion, veuillez réessayer.");
        }
      } catch (error) {
        console.error("Erreur réseau lors de la déconnexion:", error);
        alert("Une erreur est survenue, veuillez réessayer.");
      }
    });
  }
}
