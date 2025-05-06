class Profil {
  constructor(parameters) {
    this.username = document.querySelector('[name="prenom_nom"]');
    this.role = document.querySelector('[name="role"]');
    this.github = document.querySelector('[name="github"]');
  }

  async recupDonnée(){
    fetch("http://api.app-loove.local/users/profil");
  }
}




