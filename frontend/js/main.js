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
    const base = "/";
    if (path.startsWith(base)) {
      path = path.slice(base.length);
    }

    let page = path.replace(/^\/+/, "");
    let pageUrl;

    if (page === "" || page === "index") {
      pageUrl = `index.html`;
    } else {
      pageUrl = `pages/${page}.html`;
    }

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
      switch (pageName) {
        case "index":
          const { Carousel } = await import("./component/carrousel.js");
          const carousel = new Carousel(".carrousel_avis");

          const { Modal } = await import("./component/modal.js");
          const modal = new Modal();


          break;

        case "chatbot":
          const { Chatbot } = await import("./pages/chatbot.js");
          const chatbot = new Chatbot();
          chatbot.init();
          break;

        case "profil":
          const { Profil } = await import("./pages/profil.js");
          const profil = new Profil();
          break;

        default:
          console.warn(`Pas de script JS trouvé pour ${pageName}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'importation du script JS :", error);
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


