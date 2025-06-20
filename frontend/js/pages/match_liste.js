import { parseJwt } from "../utils/parse.js";

export class Match_liste {
  constructor(jwt) {
    this.jwt = jwt;
    this.paypalForm = document.querySelector("#paypal");
    this.tokenInput = document.querySelector(".token");
    this.modal = document.querySelector("#paypal");
    this.matchContainer = document.querySelector(".liste-matches");

    this.abs = this.jwt ? parseJwt(this.jwt).abonnement : false;
    console.log("Abonnement:", this.abs);

    this.abonnement();
    this.jeton();
  }

  async abonnement() {
    try {
      const id = parseJwt(this.jwt).id;

      const response = await fetch("https://back.meetlink.local/match/likeWait", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      console.log("Utilisateurs récupérés :", data);

      this.matchContainer.innerHTML = "";

      if (this.abs === true) {
        this.paypalForm.style.display = "none";

        if (data.length === 0) {
          const noMatch = document.createElement("p");
          noMatch.textContent = "😔 Désolé, vous n'avez pas encore de match.";
          noMatch.style.textAlign = "center";
          noMatch.style.fontSize = "1.2rem";
          noMatch.style.marginTop = "2rem";
          noMatch.style.color = "#555";
          this.matchContainer.appendChild(noMatch);
          return;
        }

        data.forEach((user) => {
          const userCard = document.createElement("div");
          userCard.classList.add("user-card");

          userCard.innerHTML = `
            <div class="user-card-content" style="background-image: url('https://back.meetlink.local/${user.profile_picture}');">
              <div class="user-info">
                <h3>${user.prenom} ${user.nom}</h3>
                <p>Âge : ${user.age ?? "Non renseigné"}</p>
                <p>Localisation : ${user.localisation ?? "Non renseignée"}</p>
              </div>
            </div>
          `;
          this.matchContainer.appendChild(userCard);
        });

      } else {
        for (let i = 0; i < 12; i++) {
          const fakeCard = document.createElement("div");
          fakeCard.classList.add("user-card", "fake-card");
          fakeCard.innerHTML = `
            <div class="user-card-content">
              <div class="user-info">
                <h3>Utilisateur Premium</h3>
                <p>Âge : --</p>
                <p>Localisation : --</p>
              </div>
            </div>
          `;
          this.matchContainer.appendChild(fakeCard);
        }

        this.matchContainer.addEventListener(
          "click",
          () => {
            this.modal.removeAttribute("hidden");
          },
          { once: true }
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'appel fetch:", error);
    }
  }

  jeton() {
    if (this.tokenInput) {
      this.tokenInput.value = this.jwt;
    } else {
      console.warn("Token manquant pour PayPal.");
    }
  }
}
