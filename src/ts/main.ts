import { loadComponent } from "./utils/loadComponent";
import { setActiveLink } from "./utils/setActiveLink";
import { initMobileMenu } from "./components/mobileMenu";
import { initLoginModal } from "./components/loginModal";
import { initContactForm } from "./contact";
import { initCatalogPage } from "./catalog";

document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    loadComponent("#header", "/components/header.html"),
    loadComponent("#footer", "/components/footer.html"),
    loadComponent("#login-modal-root", "/components/login-modal.html"),
  ]);

  setActiveLink();

  initMobileMenu();

  initLoginModal();

  initContactForm();

  await initCatalogPage();
});
