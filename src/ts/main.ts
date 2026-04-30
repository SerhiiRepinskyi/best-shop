import { loadComponent } from "./utils/loadComponent";
import { setActiveLink } from "./utils/setActiveLink";
import { initMobileMenu } from "./components/mobileMenu";
import { initLoginModal } from "./components/loginModal";
import { initCartCounter } from "./components/cartCounter";
import { initCartPage } from "./cart";
import { initContactForm } from "./contact";
import { initCatalogPage } from "./catalog";
import { initProductPage } from "./product";
import { initHomePage } from "./home";

document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    loadComponent("#header", "/components/header.html"),
    loadComponent("#footer", "/components/footer.html"),
    loadComponent("#login-modal-root", "/components/login-modal.html"),
  ]);

  setActiveLink();
  initMobileMenu();
  initLoginModal();
  initCartCounter();
  initCartPage();
  initContactForm();
  initHomePage();
  await initCatalogPage();
  await initProductPage();
});
