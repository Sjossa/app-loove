import { parseJwt } from "./utils/parse.js";
import { wsClient } from "./utils/WebSocket.js";

class SimpleRouter {
  constructor() {
    this.mainElement = document.querySelector("main");
    this.jwt = null;
    this.cachepage = {};

    this.routes = {
      "/": { page: "index", auth: false },
      "/profil": { page: "profil", auth: true },
      "/chatbot": { page: "chatbot", auth: false },

      "/tchat": { page: "tchat", auth: true },
      "/match_liste": { page: "match_liste", auth: true },

      "/admin": { page: "users", auth: true, roles: ["admin"] },
    };

    this.init();
  }

  async init() {
    await this.loadComponent("header", "/components/header.html");

    this.jwt = await this.checkJWT();

    if (this.jwt !== null) {
      this.role = this.jwt ? parseJwt(this.jwt).role : null;
      wsClient.connect(this.jwt);
    } else {
      this.role = null;
    }

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

    if (route.roles && (!this.role || !route.roles.includes(this.role))) {
      history.replaceState(null, "", "/");
      return this.handleRoute("/");
    }

    const pageName = this.getPageName(route.page);
    const pageUrl = `pages/${pageName}.html`;

    await this.loadPage(pageUrl, pageName);
  }

  getPageName(page) {
    if (page === "index") {
      if (!this.jwt) return "index_off";
      return this.role === "admin" ? "users" : "match";
    }

    return page;
  }

  async loadPage(url, pageName) {
    try {
      const cache = this.cachepage?.[pageName];
      const temps = Date.now();
      const minuterie = 5 * 60 * 1000;

      if (cache && temps - cache.timestamp < minuterie) {
        this.mainElement.innerHTML = cache.content;
      } else {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Page non trouvée");

        const html = await response.text();
        this.cachepage[pageName] = {
          content: html,
          timestamp: temps,
        };

        this.mainElement.innerHTML = html;
      }

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

      if (response.status === 401) {
        return null;
      }
      if (!response.ok) {
        return null;
      }
      const data = await response.json();

      return data.jwt || null;
    } catch (error) {
      console.error("Erreur chargement script :", error);
      return null;
    }
  }

  async loadPageScript(pageName) {
    this.loadHeaderOnce();
    try {
      switch (pageName) {
        case "index_off": {
          const module = await import("./pages/index.js");
          const { Carousel } = module;
          new Carousel(); 
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

        case "tchat": {
          const { Tchat } = await import("./pages/tchat.js");
          new Tchat(this.jwt);
          break;
        }

        case "match_liste": {
          const { Match_liste } = await import("./pages/match_liste.js");
          new Match_liste(this.jwt);
          break;
        }

        case "users": {
          const { admin } = await import("./pages/admin.js");
          new admin(this.jwt);
          break;
        }

        default:
          console.warn(`Aucun script pour la page : ${pageName}`);
      }
    } catch (error) {
      console.error("Erreur chargement script :", error);
    }
  }

  async loadHeaderOnce() {
    if (!this.headerInstance) {
      const { headers: Headers } = await import("./pages/header.js");
      this.headerInstance = new Headers(this.jwt);
    }
  }
}

new SimpleRouter();
