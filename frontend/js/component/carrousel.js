export class Carousel {
  constructor(containerSelector) {
    this.container = document.querySelector(".carrousel_container");
    this.track = this.container.querySelector(".avis");
    this.slides = Array.from(this.track.children);
    this.prevButton = this.container.querySelector("#prev");
    this.nextButton = this.container.querySelector("#next");

    this.totalSlides = this.slides.length;
    this.centerIndex = 0

    this.updateClasses();
    this.addEventListeners();
  }

  updateClasses() {
    this.slides.forEach(slide => {
      slide.classList.remove("slide-current", "slide-previous", "slide-next");
    });

    const prevIndex = (this.centerIndex - 1 + this.totalSlides) % this.totalSlides;
    const nextIndex = (this.centerIndex + 1) % this.totalSlides;

    this.slides[this.centerIndex].classList.add("slide-current");
    this.slides[prevIndex].classList.add("slide-previous");
    this.slides[nextIndex].classList.add("slide-next");
  }

  next() {
    this.centerIndex = (this.centerIndex + 1) % this.totalSlides;
    this.updateClasses();
  }

  prev() {
    this.centerIndex = (this.centerIndex - 1 + this.totalSlides) % this.totalSlides;
    this.updateClasses();
  }

  addEventListeners() {
    this.nextButton.addEventListener("click", () => this.next());
    this.prevButton.addEventListener("click", () => this.prev());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Carousel(".carrousel_container");
});
