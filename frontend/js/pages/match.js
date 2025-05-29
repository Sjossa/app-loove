export class Match {
  constructor(jwt) {
    this.jwt = jwt;
    this.profil = document.querySelector("#match_profil");
    this.btn_profil = document.querySelector("#btn_profil");
    this.match_ok = document.querySelector("#match");
    this.btn_choix = document.querySelector('#choix')
    this.matchBtn = document.querySelector(".matchbtn");
    this.skipBtn = document.querySelector(".skip");

     if (this.matchBtn) {
    this.matchBtn.disabled = true;
  }

    this.visibility();
    this.loadProfil();
    this.choix();
  }

  choix(){

    if(this.matchBtn){
      this.matchBtn.addEventListener("click", async () => {
  try {
     console.log("liked_id envoyé:", this.profil_show);
    await this.match_love();
    await this.loadProfil();
  } catch (error) {
    console.error("Erreur dans le match ou le chargement :", error);
  }
});

if(this.skipBtn){
      this.skipBtn.addEventListener("click", async () => {
  try {
     console.log("disliked_id envoyé:", this.profil_show);
    await this.dislike();
    await this.loadProfil();
  } catch (error) {
    console.error("Erreur dans le match ou le chargement :", error);
  }
});



  }}}

  visibility() {
    if (this.btn_profil) {
      this.btn_profil.addEventListener("click", () => {
        const isVisible = this.profil.style.visibility === "visible";
        this.profil.style.visibility = isVisible ? "hidden" : "visible";
      });
    } else {
      console.warn("Élément 'btn_profil' introuvable !");
    }
  }

  getUserIdFromJwt() {
    try {
      const payload = JSON.parse(atob(this.jwt.split('.')[1]));
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
      console.log(this.profil_show);

      this.displayInfo(data.user);

      if (this.matchBtn) {
      this.matchBtn.disabled = false;
    }
    } catch (error) {
      console.error("Erreur chargement profil:", error);
    }
  }

  displayInfo(user) {
    const fields = ["prenom", "age", "localisation", "bio"];

    fields.forEach((field) => {
      const element = document.querySelector(`[data-user="${field}"]`);
      if (element) {
        element.textContent = field === "age" ? `${user[field]} ans` : user[field] || '';
      }
    });

    const img = document.querySelector("#card img");
    if (img && user.profile_picture) {
      img.src = `../images/${user.profile_picture}`;
      img.alt = `Photo de profil de ${user.prenom}`;
    }
  }


  async match_love(){
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
          liked_id: this.profil_show
        }),
        credentials: "include",
      });


      



    } catch (error) {
      console.error("Erreur de match :", error);
    }

  }

    async dislike(){
    if (!this.profil_show) {
    console.error("Aucun profil chargé pour liker");
    return;
  }



     try {
      const response = await fetch("https://back.meetlink.local/match/dislike", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dislike_id: this.getUserIdFromJwt(),
          disliked_id: this.profil_show
        }),
        credentials: "include",
      });




    } catch (error) {
      console.error("Erreur de match :", error);
    }

  }



};
