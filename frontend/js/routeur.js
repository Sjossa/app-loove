class SimpleRouter {
  constructor() {
    this.mainElement = document.querySelector("main");

    this.loadComponent("header", "frontend/components/header.html");

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
    const base = "/app-loove";
    if (path.startsWith(base)) {
      path = path.slice(base.length);
    }

    let page = path.replace(/^\/+/, "");
    let pageUrl;

    if (page === "" || page === "index") {
      pageUrl = `frontend/index.html`;
    } else {
      pageUrl = `frontend/pages/${page}.html`;
    }

    this.loadPage(pageUrl);
  }

  async loadPage(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Page non trouvée");

      const html = await response.text();
      this.mainElement.innerHTML = html;
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
}

new SimpleRouter();
