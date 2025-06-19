export class admin {
  constructor(jwt) {
    this.jwt = jwt;
    this.tbody = document.querySelector("#users-body");

    this.userload();
  }

  async userload() {
    try {
      const response = await fetch("https://back.meetlink.local/admin/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
        },
        credentials: "include",
      });

      const users = await response.json();

      this.tbody.innerHTML = "";
      console.log("users =", users);

      if (users.success && Array.isArray(users.data)) {
        users.data.forEach((user) => {
          const row = document.createElement("tr");

          row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.prenom}</td>
            <td>${user.nom}</td>
            <td>${user.age ?? ""}</td>
            <td>${user.localisation ?? ""}</td>
            <td>${user.email}</td>
            <td>${user.statut ?? ""}</td>
            <td>${user.orientation ?? ""}</td>
            <td>${user.relation_recherchee ?? ""}</td>
            <td>${user.interets ?? ""}</td>
            <td>${user.bio ?? ""}</td>
            <td>${user.petit_plus ?? ""}</td>
            <td><img src="${
              user.profile_picture ?? "/images/default.jpg"
            }" alt="Photo" width="50"/></td>
            <td>${user.created_at}</td>
            <td>${user.is_online ? "✅" : "❌"}</td>
            <td>${user.last_active}</td>
       <td><button class="suprimer" data-id="${
         user.id
       }">suprimer</button><button class="modifier_user" data-id="${
            user.id
          }">signaler</button></td>

          `;

          this.tbody.appendChild(row);
        });

        this.tbody.querySelectorAll(".suprimer").forEach((button) => {
          button.addEventListener("click", (e) => {
            const userId = e.target.dataset.id;
            this.delete(userId);
          });
        });
      } else {
        this.tbody.innerHTML = `<tr><td colspan="16">Aucun utilisateur trouvé</td></tr>`;
      }
    } catch (err) {
      console.error("Erreur lors du chargement des utilisateurs :", err);
      this.tbody.innerHTML = `<tr><td colspan="16">Erreur de chargement</td></tr>`;
    }
  }

  async delete(userId) {
    try {
      const response = await fetch(
        `https://back.meetlink.local/admin/delete/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${this.jwt}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Erreur suppression");
       window.location.href = "/users";



      if (result.success) {
        console.log("Suppression réussie !");
      } else {
        console.error("Erreur API :", result.message);
      }
    } catch (err) {
      console.error("Erreur lors de la requête DELETE :", err);
    }
  }

  async  signaler(){
    
  }
}
