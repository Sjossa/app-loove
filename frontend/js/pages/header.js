export class headers {
  constructor(jwt) {
    this.jwt = jwt;
    this.nav = document.querySelector(".nav-list");
    this.modal = document.getElementById("login-modal");
    this.closeBtn = this.modal.querySelector(".modal-close");
    this.input_mail = document.querySelector("#login-email");
    this.input_password = document.querySelector("#login-password");
    this.form = this.modal.querySelector("form");
    this.messageBox = document.querySelector("#messageBox");

    this.initEvents();
  }

  contenu() {
    this.nav.innerHTML = "";
    const conteneur_logo = document.createElement("a");
    conteneur_logo.href = "index";
    conteneur_logo.className = "nav-link";

    const logo = document.createElement("img");
    logo.className = "brand-logo";
    logo.src = "/images/logo.png";
    logo.alt = "logo meetlink";

    conteneur_logo.appendChild(logo);

    const logoItem = document.createElement("li");
    logoItem.className = "nav-item";
    logoItem.appendChild(conteneur_logo);
    this.nav.appendChild(logoItem);
    console.log("JWT:", this.jwt);

    if (this.jwt) {
      const links = [
        { text: "Profil", href: "profil" },
        { text: "message", href: "tchat" },
        { text: "notification" },
      ];

      links.forEach((item) => {
        const li = document.createElement("li");
        li.className = "nav-item";

        const link = document.createElement("a");
        link.href = item.href;
        link.className = "nav-link";
        link.textContent = item.text;

        li.appendChild(link);
        this.nav.appendChild(li);
      });

      const notification = document.createElement("button");
      notification.className = "notification";
      notification.appendChild(button);
      this.nav.appendChild(notification);
    } else {
      const li = document.createElement("li");
      li.className = "nav-item nav-cta";

      const button = document.createElement("button");
      button.className = "btn btn-primary login-trigger";
      button.textContent = "Connexion";

      li.appendChild(button);
      this.nav.appendChild(li);
    }
  }

  open() {
    this.modal.classList.remove("hidden");
    this.clearForm();
    this.clearMessage();
  }

  close() {
    this.modal.classList.add("hidden");
  }

  send(event) {
    event.preventDefault();

    const userData = {
      email: this.input_mail.value,
      password: this.input_password.value,
    };

    fetch("https://back.meetlink.local/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          window.location.href = "match";
          this.close();
        } else {
          this.showMessage(
            result.message || "Identifiants incorrects",
            "error"
          );
        }
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi :", error);
        this.showMessage(
          "Une erreur est survenue. Veuillez réessayer.",
          "error"
        );
      });
  }

  showMessage(message, type) {
    if (this.messageBox) {
      this.messageBox.textContent = message;
      this.messageBox.className = `message ${type}`;
    }
  }

  clearMessage() {
    if (this.messageBox) {
      this.messageBox.textContent = "";
      this.messageBox.className = "";
    }
  }

  clearForm() {
    this.input_mail.value = "";
    this.input_password.value = "";
  }

  initEvents() {
    this.contenu();
    this.openBtn = document.querySelector(".login-trigger");

    if (this.openBtn) {
      this.openBtn.addEventListener("click", () => this.open());
    } else {
      console.log("erreur");
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.close());
    }
    if (this.form) {
      this.form.addEventListener("submit", (event) => this.send(event));
    }
  }
}
