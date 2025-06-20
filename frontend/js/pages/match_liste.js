import { parseJwt } from "../utils/parse.js";

export class Match_liste {
  constructor(jwt) {
    this.paypalForm = document.querySelector(".paypal");
    this.tokenInput = document.querySelector(".token");
    this.jwt = jwt;
    this.modal = document.querySelector("#paypal");
    this.closeBtn = this.modal.querySelector(".modal-close");
    this.matchContainer = document.querySelector(".liste-matches");

    this.abs = this.jwt ? parseJwt(this.jwt).abonnement : null;
    console.log("Abonnement:", this.abs);

    this.abonnement();

    // Event pour fermer la modale
    this.closeBtn.addEventListener("click", () => {
      this.modal.setAttribute("hidden", "");
    });
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
      console.log(data);

      this.matchContainer.innerHTML = "";

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

      if (this.abs === false) {
        this.matchContainer.style.filter = "none";
        this.modal.setAttribute("hidden", "");

      } else {
        this.matchContainer.style.filter = "blur(5px)";
        this.modal.setAttribute("hidden", "");
        


        this.matchContainer.addEventListener("click", () => {
          this.modal.removeAttribute("hidden");
        }, { once: true });

        this.jeton();
      }
    } catch (error) {
      console.error("Erreur fetch:", error);
    }
  }

  jeton() {
    if (this.tokenInput) {
      this.tokenInput.value = this.jwt;
    } else {
      alert("Token manquant");
    }
  }
}
