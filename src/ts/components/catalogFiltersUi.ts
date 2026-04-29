import type { CatalogFilters, CatalogItem } from "../types/catalog";

const DEFAULT_FILTER_LABEL = "Choose option";
const FILTER_KEYS = ["size", "color", "category"] as const;

type FilterKey = (typeof FILTER_KEYS)[number];

type FilterConfig = {
  allLabel: string;
  key: FilterKey;
  values: string[];
};

function getUniqueFilterValues(items: CatalogItem[], key: FilterKey): string[] {
  return [...new Set(items.map((item) => item[key]))].sort((first, second) =>
    first.localeCompare(second),
  );
}

function buildFilterConfigs(items: CatalogItem[]): FilterConfig[] {
  return [
    {
      key: "size",
      allLabel: "All sizes",
      values: getUniqueFilterValues(items, "size"),
    },
    {
      key: "color",
      allLabel: "All colors",
      values: getUniqueFilterValues(items, "color"),
    },
    {
      key: "category",
      allLabel: "All categories",
      values: getUniqueFilterValues(items, "category"),
    },
  ];
}

function createFilterOptionsMarkup(config: FilterConfig): string {
  const allOptionMarkup = `
    <li>
      <button
        class="catalog-filters__option catalog-filters__option--active"
        type="button"
        data-filter-option
        data-filter-key="${config.key}"
        data-filter-value=""
      >
        ${config.allLabel}
      </button>
    </li>
  `;

  const valuesMarkup = config.values
    .map(
      (value) => `
        <li>
          <button
            class="catalog-filters__option"
            type="button"
            data-filter-option
            data-filter-key="${config.key}"
            data-filter-value="${value}"
          >
            ${value}
          </button>
        </li>
      `,
    )
    .join("");

  return allOptionMarkup + valuesMarkup;
}

function updateFilterFieldState(field: HTMLElement, value: string): void {
  const triggerLabel = field.querySelector<HTMLElement>("[data-filter-trigger-label]");
  const trigger = field.querySelector<HTMLElement>("[data-filter-trigger]");
  const optionButtons = field.querySelectorAll<HTMLButtonElement>("[data-filter-option]");

  if (triggerLabel) {
    triggerLabel.textContent = value || DEFAULT_FILTER_LABEL;
  }

  field.classList.toggle("catalog-filters__field--active", value !== "");

  optionButtons.forEach((optionButton) => {
    optionButton.classList.toggle(
      "catalog-filters__option--active",
      optionButton.dataset.filterValue === value,
    );
  });

  trigger?.setAttribute("aria-expanded", "false");
  field.classList.remove("catalog-filters__field--open");
}

function updateSalesFieldState(input: HTMLInputElement): void {
  const field = input.closest<HTMLElement>(".catalog-filters__field--sales");

  field?.classList.toggle("catalog-filters__field--active", input.checked);
}

function initializeFilterOptions(
  items: CatalogItem[],
  filters: CatalogFilters,
): void {
  const filterConfigs = buildFilterConfigs(items);

  filterConfigs.forEach((config) => {
    const field = document.querySelector<HTMLElement>(
      `[data-filter-field="${config.key}"]`,
    );
    const menu = field?.querySelector<HTMLElement>(".catalog-filters__menu");

    if (!field || !menu) {
      return;
    }

    menu.innerHTML = createFilterOptionsMarkup(config);
    updateFilterFieldState(field, filters[config.key]);
  });
}

export {
  FILTER_KEYS,
  type FilterKey,
  initializeFilterOptions,
  updateFilterFieldState,
  updateSalesFieldState,
};
