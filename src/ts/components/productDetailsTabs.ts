import {
  createProductReviewsMarkup,
  initProductReviewsForm,
} from "./productReviewsTab";

export function initProductDetailsTabs(): void {
  const root = document.querySelector<HTMLElement>("[data-product-tabs]");

  if (!root) {
    return;
  }

  const tabs = root.querySelectorAll<HTMLButtonElement>("[data-product-tab]");
  const panel = root.querySelector<HTMLElement>(".product-tabs__panel");

  if (tabs.length === 0 || !panel) {
    return;
  }

  const productName =
    document
      .querySelector<HTMLElement>(".product-details__title")
      ?.textContent?.trim() ?? "this product";

  const tabContentMap: Record<string, string> = {
    details: panel.innerHTML,
    reviews: createProductReviewsMarkup(productName),
    shipping: `
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
        dictum, libero non tristique vulputate, lectus dui pulvinar nibh, at
        accumsan lectus augue id nibh. Aliquam erat volutpat. Curabitur sed
        risus non erat scelerisque blandit sed id mauris.
      </p>

      <p>
        Quisque vulputate, justo vitae luctus efficitur, nulla tortor aliquet
        risus, id dapibus arcu nunc vitae velit. Donec porta, risus id
        hendrerit pretium, velit neque egestas tellus, et scelerisque ligula
        nisl non nunc.
      </p>

      <p>
        Sed a sapien non nibh eleifend dictum. Ut feugiat, massa et tincidunt
        malesuada, odio metus condimentum ipsum, ut dignissim urna turpis a
        sem.
      </p>
    `,
  };

  const setActiveTab = (nextTab: HTMLButtonElement): void => {
    tabs.forEach((tab) => {
      const isActive = tab === nextTab;

      tab.classList.toggle("product-tabs__tab--active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });

    const nextContentKey = nextTab.dataset.productTab ?? "details";
    panel.innerHTML = tabContentMap[nextContentKey] ?? tabContentMap.details;
    panel.setAttribute("aria-labelledby", nextTab.id);
    panel.classList.toggle("product-tabs__panel--reviews", nextContentKey === "reviews");

    if (nextContentKey === "reviews") {
      initProductReviewsForm(panel);
    }
  };

  root.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const tab = target.closest<HTMLButtonElement>("[data-product-tab]");

    if (!tab) {
      return;
    }

    setActiveTab(tab);
  });

  root.addEventListener("keydown", (event) => {
    if (!(event.target instanceof HTMLButtonElement)) {
      return;
    }

    const currentIndex = Array.from(tabs).indexOf(event.target);

    if (currentIndex < 0) {
      return;
    }

    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }

    event.preventDefault();

    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
    const nextTab = tabs[nextIndex];

    setActiveTab(nextTab);
    nextTab.focus();
  });
}
