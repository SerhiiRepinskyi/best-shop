export const initMobileMenu = () => {
  const header = document.querySelector("#header");

  if (!header) return;

  const openBtn = header.querySelector(".burger-btn");
  const closeBtn = header.querySelector(".mobile-menu__close");
  const menu = header.querySelector(".mobile-menu");
  const overlay = header.querySelector(".mobile-overlay");

  if (!openBtn || !closeBtn || !menu || !overlay) return;

  const handleEsc = (event: KeyboardEvent) => {
    if (event.key === "Escape") closeMenu();
  };

  const openMenu = () => {
    menu.classList.add("mobile-menu--open");
    overlay.classList.add("mobile-overlay--active");
    document.body.classList.add("no-scroll");

    overlay.addEventListener("click", closeMenu);
    document.addEventListener("keydown", handleEsc);
  };

  const closeMenu = () => {
    menu.classList.remove("mobile-menu--open");
    overlay.classList.remove("mobile-overlay--active");
    document.body.classList.remove("no-scroll");

    overlay.removeEventListener("click", closeMenu);
    document.removeEventListener("keydown", handleEsc);
  };

  openBtn.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);
};
