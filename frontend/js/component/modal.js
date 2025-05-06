export class Modal {
  constructor() {
    this.modal = document.getElementById("modalConnexion");
    this.openBtn = document.querySelector(".connexion");
    this.closeBtn = this.modal.querySelector(".close-btn");

    this.initEvents();
  }

  open() {
    this.modal.classList.remove("hidden");
  }

  close() {
    this.modal.classList.add("hidden");
  }

  initEvents() {
    if (this.openBtn) {
      this.openBtn.addEventListener("click", () => this.open());
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.close());
    }
  }
}
