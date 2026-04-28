export function showCatalogPopup(popup: HTMLElement): void {
  popup.hidden = false;
  document.body.classList.add("no-scroll");
}

export function hideCatalogPopup(popup: HTMLElement): void {
  popup.hidden = true;
  document.body.classList.remove("no-scroll");
}
