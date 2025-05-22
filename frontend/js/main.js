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

  const jwt = await this.checkJWT();

  let page;
  let pageUrl;

  if (!jwt) {
    page = cleanPath === "" || cleanPath === "index" ? "index_off" : cleanPath;
    pageUrl = page === "index_off" ? "pages/index_off.html" : `pages/${page}.html`;
  } else {
    page = cleanPath === "" || cleanPath === "index" ? "index_on" : cleanPath;
    pageUrl = page === "index_on" ? "pages/index_on.html" : `pages/${page}.html`;
  }

  // Charger la page correspondante
  await this.loadPage(pageUrl);
}



  async loadPage(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Page non trouvée");

      const html = await response.text();
      this.mainElement.innerHTML = html;

      const pageName = url.split("/").pop().replace(".html", "");
      await this.loadPageScript(pageName);
    } catch (error) {
      this.mainElement.innerHTML = `<p>Erreur de chargement : ${error.message}</p>`;
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

  async checkJWT() {
  try {
    const response = await fetch("https://back.meetlink.local/profil", {
      method: "POST",
      credentials: "include",
    });

        if (response.ok) {
      const data = await response.json();
      return data.jwt;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la vérification du JWT :", error);
    return null;
  }
}


  async loadPageScript(pageName) {
    try {
      switch (pageName) {
        case "index_off":
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
          const jwt = await this.checkJWT();
          if (jwt) {
            const { Profil } = await import("./pages/profil.js");
            new Profil(jwt);
          } else {
            console.warn("JWT non trouvé, redirection ou message à prévoir.");
          }
          break;

        default:
          console.warn(`Aucun script associé à la page : ${pageName}`);
      }
    } catch (error) {
      console.error("Erreur lors du chargement du script :", error);
    }
  }
}

new SimpleRouter();
