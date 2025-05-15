export class Profil {
  constructor(jwt) {
    this.jwt = jwt;

    this.username = document.querySelector('[data-user="nom"]');
    this.age = document.querySelector('[data-user="age"]');
    this.profil_picture = document.querySelector('[data-user="profil_picture"]');




    this.loadProfile();
  }

  async loadProfile() {
    try {
      const response = await fetch("https://api.app-loove.local/users/profil", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
        },
      });

      const data = await response.json();

      if (!data.success || !data.user) {
        throw new Error("Données invalides");
      }

      this.displayUser(data.user);
    } catch (error) {
      console.error(error);
    }
  }

  displayUser(user) {
    if (this.username) {
      this.username.textContent = `${user.prenom} ${user.Nom}`;
    }

    if (this.age) {
      this.age.textContent = user.age ? `${user.age} ans` : "";
    }

    if(this.profil_picture){
      this.profil_picture.textContent = user.profil_picture ? `${user.profil_picture}` : "error";
    }
  }

  static getCookie(name) {
    const cookies = `; ${document.cookie}`;
    const parts = cookies.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }
}
