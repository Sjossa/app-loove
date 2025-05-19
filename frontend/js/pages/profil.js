export class Profil {
  constructor(jwt) {
    this.jwt = jwt;
    this.username = document.querySelector('[data-user="nom"]');
    this.age = document.querySelector('[data-user="age"]');
    this.localisation = document.querySelector('[data-user="localisation"]');
    this.profile_picture = document.querySelector(
      '[data-user="profile_picture"]'
    );

    this.loadProfile();
  }

  async loadProfile() {
    try {
      const response = await fetch("https://api.app-loove.local/users/profil", {
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
    if (this.username) this.username.textContent = `${user.prenom} ${user.nom}`;
    if (this.age) this.age.textContent = user.age ? `${user.age} ans` : "";
    if (this.localisation)
      this.localisation.textContent = user.localisation || "Non renseignée";
    if (this.profile_picture)
      this.profile_picture.src =
        user.profile_picture || "chemin/par-defaut.jpg";
  }
}
