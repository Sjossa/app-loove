import { wsClient } from "../utils/WebSocket.js";

export class Header {
  constructor(jwt) {
    this.jwt = jwt;

    // Sélecteurs DOM principaux
    this.nav = document.querySelector(".header-nav-list");
    this.burger = document.querySelector(".burger");
    this.modal = document.getElementById("login-modal");
    this.closeBtn = this.modal?.querySelector(".modal-close");
    this.input_mail = document.querySelector("#login-email");
    this.input_password = document.querySelector("#login-password");
    this.form = this.modal?.querySelector("form");
    this.messageBox = document.querySelector("#messageBox");

    this.notificationbtn = null;

    // Initialisation contenu et événements
    this.contenu();
    this.initEvents();

    // Connexion WebSocket et gestion messages entrants
    wsClient.connect(this.jwt);
    wsClient.onMessage((data) => this.handleWsMessage(data));
  }

  contenu() {
    if (!this.nav) return;
    this.nav.innerHTML = "";

    // Logo
    const logoLink = document.createElement("a");
    logoLink.href = "index";
    logoLink.className = "header-nav-link";

    const logoImg = document.createElement("img");
    logoImg.className = "header-logo";
    logoImg.src = "/images/logo.png";
    logoImg.alt = "logo meetlink";

    logoLink.appendChild(logoImg);

    const logoItem = document.createElement("li");
    logoItem.className = "header-nav-item";
    logoItem.appendChild(logoLink);
    this.nav.appendChild(logoItem);

    // Liens en fonction du rôle
    if (this.jwt) {
      const payload = JSON.parse(atob(this.jwt.split(".")[1]));
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

      links.forEach(({ text, href }) => {
        const li = document.createElement("li");
        li.className = "header-nav-item";

        const link = document.createElement("a");
        link.href = href;
        link.className = "header-nav-link";
        link.textContent = text;

        li.appendChild(link);
        this.nav.appendChild(li);
      });

      // Bouton notification
      const notificationBtn = document.createElement("button");
      notificationBtn.className = "notification";
      notificationBtn.textContent = "🔔";
      this.nav.appendChild(notificationBtn);
      this.notificationbtn = notificationBtn;
    } else {
      // Bouton connexion
      const li = document.createElement("li");
      li.className = "header-nav-item nav-cta";

      const button = document.createElement("button");
      button.className = "header-login";
      button.textContent = "Connexion";

      li.appendChild(button);
      this.nav.appendChild(li);
    }
  }

  initEvents() {
    // Burger toggle menu
    if (this.burger && this.nav) {
      this.burger.addEventListener("click", () => {
        this.burger.classList.toggle("active");
        this.nav.classList.toggle("active");
      });
    }

    // Ouvrir modal connexion
    this.openBtn = document.querySelector(".header-login");
    if (this.openBtn) {
      this.openBtn.addEventListener("click", () => this.open());
    }

    // Fermer modal
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.close());
    }

    // Envoi formulaire connexion
    if (this.form) {
      this.form.addEventListener("submit", (event) => this.send(event));
    }

    // Fermer menu quand on clique sur un lien (UX mobile)
    const links = this.nav.querySelectorAll(".header-nav-link");
    links.forEach((link) => {
      link.addEventListener("click", () => {
        if (this.burger.classList.contains("active")) {
          this.burger.classList.remove("active");
          this.nav.classList.remove("active");
        }
      });
    });

    // Clic sur notification
    if (this.notificationbtn) {
      this.notificationbtn.addEventListener("click", () => {
        this.clearNotif();
        this.open();
      });
    }
  }

  handleWsMessage(data) {
    if (!data?.type) return;

    switch (data.type) {
      case "message":
        this.newNotif("Nouveau message");
        break;

      case "match":
        this.newNotif("Nouveau match");
        break;

      case "like":
        this.newNotif("Nouveau like");
        break;

      default:
        break;
    }
  }

  newNotif(text) {
    if (!this.notificationbtn) return;

    this.notificationbtn.classList.add("activee");
    this.notificationbtn.title = text;

    let badge = this.notificationbtn.querySelector(".notif-badge");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "notif-badge";
      this.notificationbtn.appendChild(badge);
    }

    let count = parseInt(badge.textContent) || 0;
    badge.textContent = count + 1;
  }

  clearNotif() {
    if (!this.notificationbtn) return;
    this.notificationbtn.classList.remove("activee");
    const badge = this.notificationbtn.querySelector(".notif-badge");
    if (badge) badge.remove();
  }

  open() {
    this.modal?.classList.remove("hidden");
    this.clearForm();
    this.clearMessage();
  }

  close() {
    this.modal?.classList.add("hidden");
  }

  send(event) {
    event.preventDefault();

    const userData = {
      email: this.input_mail.value,
      password: this.input_password.value,
    };

    fetch("https://back.meetlink.local/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          this.close();
          window.location.href = "/index";
        } else {
          this.showMessage(result.message || "Identifiants incorrects", "error");
        }
      })
      .catch((err) => {
        console.error("Erreur lors de l'envoi :", err);
        this.showMessage("Une erreur est survenue. Veuillez réessayer.", "error");
      });
  }

  showMessage(message, type) {
    if (!this.messageBox) return;
    this.messageBox.textContent = message;
    this.messageBox.className = `message ${type}`;
  }

  clearMessage() {
    if (!this.messageBox) return;
    this.messageBox.textContent = "";
    this.messageBox.className = "";
  }

  clearForm() {
    if (this.input_mail) this.input_mail.value = "";
    if (this.input_password) this.input_password.value = "";
  }
}
