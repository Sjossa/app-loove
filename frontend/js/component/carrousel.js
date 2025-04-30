
      class Carousel {
        constructor(container_select) {
          this.container = document.querySelector(container_select);
          this.track = this.container.querySelector(".avis");
          this.slide = Array.from(this.track.children);
          this.prevButton = this.container.querySelector("#prev");
          this.nextButton = this.container.querySelector("#next");
          this.currentIndex = 1;

          this.slideWidth = this.slide[0].getBoundingClientRect().width;
          this.setSlidePositions();
          this.addEventListeners();
          this.goToSlide(this.currentIndex);
        }

        setSlidePositions() {
          this.slide.forEach((slide, index) => {
            slide.style.left = this.slideWidth * index + "px";
          });
        }

        goToSlide(index) {
          const targetSlide = this.slide[index];
          const amountToMove = targetSlide.style.left;
          this.track.style.transform = "translateX(-" + amountToMove + ")";

          this.track
            .querySelector(".avis_actuelle")
            ?.classList.remove("avis_actuelle");
          targetSlide.classList.add("avis_actuelle");
          this.currentIndex = index;
        }

        next() {
          if (this.currentIndex < this.slide.length - 1) {
            this.goToSlide(this.currentIndex + 1);
          } else {
            this.goToSlide(0);
          }
        }

        prev() {
          if (this.currentIndex > 0) {
            this.goToSlide(this.currentIndex - 1);
          } else {
            this.goToSlide(this.slide.length - 1);
          }
        }

        addEventListeners() {
          this.nextButton.addEventListener("click", () => this.next());
          this.prevButton.addEventListener("click", () => this.prev());
        }
      }

export { Carousel };


