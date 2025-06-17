import { parseJwt } from "../utils/parse.js";

export class Match_liste {
  constructor(jwt) {
    this.paypal = document.querySelector(".paypal");
    this.token = document.querySelector(".token");
    this.jwt = jwt;

    this.abs = this.jwt ? parseJwt(this.jwt).abonnement : null;
    console.log(this.abs);

    this.abonnement();
  }

 async abonnement() {
  if (this.abs === false) {
    this.paypal.style.display = "block";
    this.jeton();
  } else {
    try {
      // ✅ Récupère l'ID depuis le JWT
      const id = parseJwt(this.jwt).id;

      const response = await fetch(
        "https://back.meetlink.local/match/likeWait",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.jwt}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ id }),
        }
      );

      const data = await response.json();
      console.log(data);
      const container = document.querySelector('.liste-matches');
container.innerHTML = ''; // on vide le conteneur avant d'ajouter du contenu

data.forEach(user => {
  const userCard = document.createElement('div');
  userCard.classList.add('user-card');

  userCard.innerHTML = `
    <p class="user-name">${user.prenom}</p>
  `;

  container.appendChild(userCard);
});

    } catch (error) {
      console.error("Erreur fetch:", error);
    }
  }
}


  jeton() {
    if (this.token) {
      this.token.value = this.jwt;
    } else {
      alert("non");
    }
  }
}
