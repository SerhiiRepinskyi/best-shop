import { loadComponent } from "./utils/loadComponent";
import { initMobileMenu } from "./components/mobileMenu";
import { setActiveLink } from "./utils/setActiveLink";

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("#header", "/components/header.html");
  await loadComponent("#footer", "/components/footer.html");

  setActiveLink();
  initMobileMenu();
});
