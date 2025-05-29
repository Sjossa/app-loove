export class Tchat {
  constructor(jwt) {
     this.jwt = jwt;
    this.list_match = document.querySelector(".list_match");

    this.liste();
  }


  async liste(){

    if(this.list_match){

      try{
       const response = await fetch("https://back.meetlink.local/tchat/list", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

        const data = await response.json();

         if (data.status === "success" && data.user) {
  console.log(data.user);
  this.list_match.innerHTML = "";

    if (data.user && data.user.length > 0) {
        data.user.forEach(user => {
  this.list_match.innerHTML += `<li>${user.prenom}</li>`;
});
    } else {
        this.list_match.innerHTML = "<li>Aucun match trouvé</li>";
    }


  }
 else if (data.status === "empty") {
  console.log("Aucun match trouvé");
} else {
  throw new Error("Erreur inattendue");
}





    }catch(error){
            console.error("Erreur dans le chargement de la liste ", error);

    }




    }else{
      alert("la liste n'exsxite pas");
    }
  }

}
