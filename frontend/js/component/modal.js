export class Modal {
  constructor() {
    this.modal = document.getElementById("modalConnexion");
    this.openBtn = document.querySelector(".connexion");
    this.closeBtn = this.modal.querySelector(".close-btn");
    this.input_mail = document.querySelector("#email_input");
    this.input_password = document.querySelector("#email_password");
    this.btn_connexion = document.querySelector(".button_connexion");
    this.messageBox = document.querySelector("#messageBox");

    this.initEvents();
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

    fetch("https://api.app-loove.local/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          document.cookie = "jwt=" + result.jwt + "; SameSite=Strict; path=/";
          window.location.href = "profil?id=" + result.id;
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
      this.messageBox.className =
        type === "success" ? "message success" : "message error";
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
    if (this.openBtn) {
      this.openBtn.addEventListener("click", () => this.open());
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.close());
    }

    const form = document.querySelector("form");
    if (form) {
      form.addEventListener("submit", (event) => this.send(event));
    }
  }
}
