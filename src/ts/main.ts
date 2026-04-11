/*------------ Mobile menu + Overlay ------------*/
const openBtn = document.querySelector(".burger-btn");
const closeBtn = document.querySelector(".mobile-menu__close");
const menu = document.querySelector(".mobile-menu");
const overlay = document.querySelector(".mobile-overlay");

// 🔥 handler for ESC
const handleEsc = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closeMenu();
  }
};

const openMenu = () => {
  if (menu?.classList.contains("mobile-menu--open")) return;

  menu?.classList.add("mobile-menu--open");
  overlay?.classList.add("mobile-overlay--active");
  document.body.classList.add("no-scroll");

  // ✅ add listeners
  overlay?.addEventListener("click", closeMenu);
  document.addEventListener("keydown", handleEsc);
};

const closeMenu = () => {
  if (!menu?.classList.contains("mobile-menu--open")) return;

  menu?.classList.remove("mobile-menu--open");
  overlay?.classList.remove("mobile-overlay--active");
  document.body.classList.remove("no-scroll");

  // ✅ remove listeners
  overlay?.removeEventListener("click", closeMenu);
  document.removeEventListener("keydown", handleEsc);
};

// 🔥 permanent listeners
openBtn?.addEventListener("click", openMenu);
closeBtn?.addEventListener("click", closeMenu);
