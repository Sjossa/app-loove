class SimpleRouter {
  constructor() {
    this.mainElement = document.querySelector("main");

    this.loadComponent("header", "/components/header.html");
    this.handleRoute(location.pathname);
    this.attachLinkListeners();

    window.addEventListener("popstate", () => {
      this.handleRoute(location.pathname);
    });
  }

  attachLinkListeners() {
    document.body.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      const button = event.target.closest("button");

      if (link && link.href.startsWith(location.origin)) {
        event.preventDefault();
        const path = link.getAttribute("href");
        history.pushState(null, "", path);
        this.handleRoute(path);
      }

      if (button && button.dataset.path) {
        event.preventDefault();
        const path = button.dataset.path;
        history.pushState(null, "", path);
        this.handleRoute(path);
      }
    });
  }

  async handleRoute(path) {
    const cleanPath = path.replace(/^\/+/, "");
    const page =
      cleanPath === "" || cleanPath === "index" ? "index" : cleanPath;
    const pageUrl = page === "index" ? "index.html" : `pages/${page}.html`;

    this.loadPage(pageUrl);
  }

  async loadPage(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Page non trouvée");

      const html = await response.text();
      this.mainElement.innerHTML = html;

      const pageName = url.split("/").pop().replace(".html", "");
      this.loadPageScript(pageName);
    } catch (error) {
      this.mainElement.innerHTML = `<p>Erreur de chargement : ${error.message}</p>`;
    }
  }

  async loadPageScript(pageName) {
    try {
      // Vérifie si l'utilisateur est authentifié avant de charger une page protégée
      if (this.requiresAuth(pageName) && !this.isAuthenticated()) {
        history.pushState(null, "", "/index");
        this.handleRoute("/index");
        return;
      }

      switch (pageName) {
        case "index":
          const { Carousel } = await import("./component/carrousel.js");
          new Carousel(".carrousel_avis");

          const { Modal } = await import("./component/modal.js");
          new Modal();
          break;

        case "chatbot":
          const { Chatbot } = await import("./pages/chatbot.js");
          const chatbot = new Chatbot();
          chatbot.init();
          break;

        case "profil":
          const jwt = this.getJwtToken();
          if (jwt) {
            const { Profil } = await import("./pages/profil.js");
            new Profil(jwt);
          } else {
            console.warn("Token JWT manquant.");
            history.pushState(null, "", "/index");
            this.handleRoute("/index");
          }
          break;

        default:
          console.warn(`Aucun script associé à la page : ${pageName}`);
      }
    } catch (error) {
      console.error("Erreur lors du chargement du script :", error);
    }
  }

  requiresAuth(pageName) {
    const protectedPages = ["profil"];
    return protectedPages.includes(pageName);
  }

  isAuthenticated() {
    return document.cookie.split("; ").some((c) => c.startsWith("jwt="));
  }

  getJwtToken() {
    return (
      document.cookie
        .split("; ")
        .find((c) => c.startsWith("jwt="))
        ?.split("=")[1] || null
    );
  }

  getUserFromToken() {
    const token = this.getJwtToken();
    if (!token) return null;

    try {
      const payloadBase64 = token.split(".")[1];
      return JSON.parse(atob(payloadBase64));
    } catch (error) {
      console.error("Erreur lors du décodage du token :", error);
      return null;
    }
  }

  async loadComponent(selector, url) {
    try {
      const element = document.querySelector(selector);
      if (!element) return;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Composant non trouvé");

      const html = await response.text();
      element.innerHTML = html;
    } catch (error) {
      console.error(
        `Erreur lors du chargement du composant ${selector} : ${error.message}`
      );
    }
  }
}

new SimpleRouter();
