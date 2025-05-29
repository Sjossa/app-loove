

class SimpleRouter {
  constructor() {
    this.mainElement = document.querySelector("main");
    this.jwt = null;

    this.routes = {
      "/": { page: "index", auth: false },
      "/profil": { page: "profil", auth: true },
      "/chatbot": { page: "chatbot", auth: false },
      "/tchat": { page: "tchat", auth: false },
    };

    this.init();
  }

  async init() {
    await this.loadComponent("header", "/components/header.html");

    this.jwt = await this.checkJWT();

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
    const cleanPath = path.replace(/^\/+/, "").split("?")[0];
    const route = this.routes[`/${cleanPath}`] || this.routes["/"];



    if (route.auth && !this.jwt) {
      history.replaceState(null, "", "/");
      return this.handleRoute("/");
    }

    const pageName = this.getPageName(route.page);
    const pageUrl = `pages/${pageName}.html`;

    await this.loadPage(pageUrl, pageName);
  }

  getPageName(page) {
    if (page === "index") {
      return this.jwt ? "match" : "index_off";
    }
    return page;
  }

  async loadPage(url, pageName) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Page non trouvée");

      const html = await response.text();
      this.mainElement.innerHTML = html;

      await this.loadPageScript(pageName);
    } catch (error) {
      this.mainElement.innerHTML = `<p>Erreur : ${error.message}</p>`;
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
      console.error(`Erreur composant ${selector} : ${error.message}`);
    }
  }

  async checkJWT() {
    try {
      const response = await fetch("https://back.meetlink.local/profil", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        return data.jwt || null;
      }

      return null;
    } catch (error) {
      console.error("Erreur JWT :", error);
      return null;
    }
  }

  async loadPageScript(pageName) {
    try {
      switch (pageName) {
        case "index_off": {
          const { Carousel } = await import("./component/carrousel.js");
new Carousel(".carrousel_avis");

          const { Modal } = await import("./component/modal.js");
          new Modal();
          break;
        }

        case "chatbot": {
          const { Chatbot } = await import("./pages/chatbot.js");
          const chatbot = new Chatbot();
          chatbot.init();
          break;
        }

        case "profil": {
          const { Profil } = await import("./pages/profil.js");
          new Profil(this.jwt);
          break;
        }

        case "match": {
        const { Match } = await import("./pages/match.js");
new Match(this.jwt);

          break;

        }

        default:
          console.warn(`Aucun script pour la page : ${pageName}`);
      }
    } catch (error) {
      console.error("Erreur chargement script :", error);
    }
  }
}

new SimpleRouter();
