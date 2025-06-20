// ./pages/admin.js
import Glide from "/node_modules/@glidejs/glide/dist/glide.esm.js";

export class Carousel {
  constructor() {
    const glideEl = document.querySelector(".glide");
    if (glideEl) {
      new Glide(".glide", {
        type: "carousel",
        perView: 1, // 1 slide centrale visible complètement
        focusAt: "center",
        peek: { before: 100, after: 100 }
      }).mount();
    } else {
      console.warn("[Carousel] Élément .glide introuvable");
    }
  }
}
