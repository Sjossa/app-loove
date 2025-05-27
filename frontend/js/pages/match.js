
   export class match {
        constructor(jwt) {
          this.jwt = jwt;
          this.profil = document.querySelector("#match_profil");
          this.btn_profil = document.querySelector("#btn_profil");

          this.match = document.querySelector("#match");
          this.skip = document.querySelector("#skip");

          this.visibility();
          this.loadprofil();
        }


        async loadprofil(){


          try {
      const response = await fetch("https://back.meetlink.local/match", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "Content-Type": "application/json",
        },

body: JSON.stringify({
        id: this.getUserIdFromJwt()
      }),
        credentials: "include",
      });

      const data = await response.json();
      if (!data.success || !data.user) throw new Error("Données invalides");

      this.displayUser(data.user);
    } catch (error) {
      console.error("Erreur chargement profil:", error);
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



        visibility() {
    if (this.btn_profil) {
      this.btn_profil.addEventListener("click", () => {
  if (this.profil.style.visibility === "hidden" || !this.profil.style.visibility) {
    this.profil.style.visibility = "visible";
  } else {
    this.profil.style.visibility = "hidden";
  }
});

    } else {
      console.log("Élément 'btn_profil' introuvable !");
    }
  }


    }

