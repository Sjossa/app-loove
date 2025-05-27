export class Modal {
  constructor() {
    this.modal = document.getElementById("login-modal");
    this.openBtn = document.querySelector(".login-trigger");
    this.closeBtn = this.modal.querySelector(".modal-close");
    this.input_mail = document.querySelector("#login-email");
    this.input_password = document.querySelector("#login-password");
    this.form = this.modal.querySelector("form");
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

    fetch("https://back.meetlink.local/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include"
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          window.location.href = "profil?id=" + result.id;
          this.close();
        } else {
          this.showMessage(result.message || "Identifiants incorrects", "error");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi :", error);
        this.showMessage("Une erreur est survenue. Veuillez réessayer.", "error");
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
}
