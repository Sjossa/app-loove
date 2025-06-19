import { wsClient } from "../utils/WebSocket.js";

export class headers {
  constructor(jwt) {
    this.jwt = jwt;

    wsClient.connect(this.jwt);
    wsClient.onMessage((data) => {
      if (!data?.type) return;

      switch (data.type) {
        case "message":
          this.newNotif("nouveau message");

          break;

        case "match":
          this.newNotif("match");
          break;

        case "like":
          this.newNotif("like");
          break;

        default:
          break;
      }
    });

    this.nav = document.querySelector(".header-nav-list");
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
  conteneur_logo.className = "header-nav-link";

  const logo = document.createElement("img");
  logo.className = "header-logo";
  logo.src = "/images/logo.png";
  logo.alt = "logo meetlink";

  conteneur_logo.appendChild(logo);

  const logoItem = document.createElement("li");
  logoItem.className = "header-nav-item";
  logoItem.appendChild(conteneur_logo);
  this.nav.appendChild(logoItem);

  if (this.jwt) {
    const payload = JSON.parse(atob(this.jwt.split('.')[1]));
    const role = payload.role;

    let links = [];

    if (role === "admin") {
      links = [
        { text: "Admin", href: "/admin" },
        { text: "Utilisateurs", href: "admin_users" },
      ];
    } else {
      links = [
        { text: "Profil", href: "profil" },
        { text: "Message", href: "tchat" },
        { text: "Matchs", href: "match_liste" },
      ];
    }

    links.forEach((item) => {
      const li = document.createElement("li");
      li.className = "header-nav-item";

      const link = document.createElement("a");
      link.href = item.href;
      link.className = "header-nav-link";
      link.textContent = item.text;

      li.appendChild(link);
      this.nav.appendChild(li);
    });

    const notification = document.createElement("button");
    notification.className = "notification";
    notification.textContent = "🔔";
    this.nav.appendChild(notification);
    this.notificationbtn = notification;

  } else {
    const li = document.createElement("li");
    li.className = "header-nav-item nav-cta";

    const button = document.createElement("button");
    button.className = "header-login";
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
          window.location.href = "/index";

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
    this.openBtn = document.querySelector(".header-login");

    if (this.openBtn) {
      this.openBtn.addEventListener("click", () => this.open());
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.close());
    }
    if (this.form) {
      this.form.addEventListener("submit", (event) => this.send(event));
    }
  }

  newNotif(texte) {
    if (!this.notificationbtn) return;
    const notifSave = (localStorage.getItem("notifications")) || [];

    notifSave
    this.notificationbtn.classList.add("active");
    this.notificationbtn.title = texte;

    let badge = this.notificationbtn.querySelector(".notif-badge");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "notif-badge";
      this.notificationbtn.appendChild(badge);
    }

    let count = parseInt(badge.textContent) || 0;
    badge.textContent = count + 1;

    this.notificationbtn.addEventListener("click", () => {
      this.notificationbtn.classList.remove("active");
      if (badge) {
    badge.remove();
    this.open()
  }

    });
  }
}
