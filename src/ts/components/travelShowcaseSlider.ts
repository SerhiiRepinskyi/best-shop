type TravelShowcaseSlide = {
  alt: string;
  imageUrl: string;
  title: string;
  text: string;
};

const TRAVEL_SHOWCASE_IMAGES = [
  {
    alt: "Travel suitcase on a city road",
    imageUrl: "/assets/images/suitcase-real-live-1.webp",
  },
  {
    alt: "Travel suitcase in an airport terminal",
    imageUrl: "/assets/images/suitcase-real-live-2.webp",
  },
  {
    alt: "Travel suitcase in a bright terminal lounge",
    imageUrl: "/assets/images/suitcase-real-live-3.webp",
  },
  {
    alt: "Travel suitcase in a hotel lobby",
    imageUrl: "/assets/images/suitcase-real-live-4.webp",
  },
  {
    alt: "Travel suitcase beside a window seat",
    imageUrl: "/assets/images/suitcase-real-live-5.webp",
  },
  {
    alt: "Travel suitcase in a station concourse",
    imageUrl: "/assets/images/suitcase-real-live-6.webp",
  },
  {
    alt: "Travel suitcase near a departure gate",
    imageUrl: "/assets/images/suitcase-real-live-7.webp",
  },
  {
    alt: "Travel suitcase in a premium lounge",
    imageUrl: "/assets/images/suitcase-real-live-8.webp",
  },
];

const TRAVEL_SHOWCASE_COPY = [
  {
    title: "Morning departures start with organized comfort.",
    text: "Built for calm check-ins, quiet terminals, and quick transfers that still feel considered.",
  },
  {
    title: "Every route feels lighter with thoughtful details.",
    text: "Smart compartments and clean silhouettes keep essentials close from boarding gate to hotel room.",
  },
  {
    title: "City breaks deserve luggage with easy confidence.",
    text: "Refined textures, steady wheels, and practical storage support every short escape beautifully.",
  },
  {
    title: "Arrive polished whether plans are busy or relaxed.",
    text: "A dependable travel case turns crowded terminals and long corridors into smoother moments.",
  },
  {
    title: "Weekend plans shine brighter with ready essentials.",
    text: "Balanced storage and durable finishes help every outfit, gadget, and keepsake travel neatly.",
  },
  {
    title: "Comfort on the move starts before takeoff begins.",
    text: "Designed to roll effortlessly through stations, lobbies, and concourses with elegant ease.",
  },
  {
    title: "Well-packed journeys leave more room for adventure.",
    text: "Reliable structure and spacious interiors keep spontaneous trips feeling simple and refined.",
  },
  {
    title: "Travel days feel smoother with a stronger first choice.",
    text: "From quick layovers to long arrivals, each piece supports motion with stylish practicality.",
  },
];

function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
}

function getSlidesPerView(): number {
  if (window.matchMedia("(max-width: 767px)").matches) {
    return 1;
  }

  if (window.matchMedia("(max-width: 1023px)").matches) {
    return 2;
  }

  return 4;
}

function createTravelShowcaseSlides(): TravelShowcaseSlide[] {
  const shuffledCopy = shuffleArray(TRAVEL_SHOWCASE_COPY);

  return TRAVEL_SHOWCASE_IMAGES.map((image, index) => ({
    ...image,
    ...shuffledCopy[index % shuffledCopy.length],
  }));
}

function createSlideMarkup(slide: TravelShowcaseSlide): string {
  return `
    <li class="travel-showcase-slider__slide">
      <article class="travel-showcase-card">
        <img
          class="travel-showcase-card__image"
          src="${slide.imageUrl}"
          alt="${slide.alt}"
          width="296"
          height="600"
        />
        <div class="travel-showcase-card__overlay"></div>
        <div class="travel-showcase-card__content">
          <h3 class="travel-showcase-card__title">${slide.title}</h3>
          <p class="travel-showcase-card__text">${slide.text}</p>
        </div>
      </article>
    </li>
  `;
}

function createDotsMarkup(pageCount: number): string {
  return Array.from({ length: pageCount }, (_, pageIndex) => {
    return `
      <button
        class="travel-showcase-slider__dot${pageIndex === 0 ? " is-active" : ""}"
        type="button"
        aria-label="Go to travel showcase page ${pageIndex + 1}"
        data-travel-showcase-dot="${pageIndex}"
      ></button>
    `;
  }).join("");
}

export function initTravelShowcaseSlider(): void {
  const root = document.querySelector<HTMLElement>("[data-travel-showcase]");
  const track = root?.querySelector<HTMLElement>("[data-travel-showcase-track]");
  const dotsRoot = root?.querySelector<HTMLElement>("[data-travel-showcase-dots]");
  const prevButton = root?.querySelector<HTMLButtonElement>("[data-travel-showcase-prev]");
  const nextButton = root?.querySelector<HTMLButtonElement>("[data-travel-showcase-next]");

  if (!root || !track || !dotsRoot || !prevButton || !nextButton) {
    return;
  }

  const slides = createTravelShowcaseSlides();
  let currentPage = 0;
  let pageCount = 0;
  let resizeFrame = 0;

  track.innerHTML = slides.map(createSlideMarkup).join("");

  const slideElements = Array.from(
    track.querySelectorAll<HTMLElement>(".travel-showcase-slider__slide"),
  );

  const updateSlider = () => {
    const slidesPerView = getSlidesPerView();
    const maxStartIndex = Math.max(0, slideElements.length - slidesPerView);
    pageCount = Math.max(1, Math.ceil(slideElements.length / slidesPerView));
    currentPage = Math.min(currentPage, pageCount - 1);

    const startIndex = Math.min(currentPage * slidesPerView, maxStartIndex);
    const activeSlide = slideElements[startIndex];
    const offset = activeSlide ? activeSlide.offsetLeft : 0;

    track.style.transform = `translateX(-${offset}px)`;

    dotsRoot.innerHTML = createDotsMarkup(pageCount);

    const dots = Array.from(
      dotsRoot.querySelectorAll<HTMLButtonElement>("[data-travel-showcase-dot]"),
    );

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === currentPage);
    });

    prevButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage >= pageCount - 1;
  };

  prevButton.addEventListener("click", () => {
    if (currentPage === 0) {
      return;
    }

    currentPage -= 1;
    updateSlider();
  });

  nextButton.addEventListener("click", () => {
    if (currentPage >= pageCount - 1) {
      return;
    }

    currentPage += 1;
    updateSlider();
  });

  dotsRoot.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const dot = target.closest<HTMLElement>("[data-travel-showcase-dot]");
    const pageIndex = dot?.dataset.travelShowcaseDot;

    if (!dot || pageIndex === undefined) {
      return;
    }

    currentPage = Number(pageIndex);
    updateSlider();
  });

  window.addEventListener("resize", () => {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(updateSlider);
  });

  updateSlider();
}
