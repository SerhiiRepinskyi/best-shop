export function setActiveLink() {
  const links = document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]");

  let currentPath = window.location.pathname;

  if (currentPath === "/") {
    currentPath = "/index.html";
  }

  links.forEach((link) => {
    let linkPath = link.getAttribute("href");

    if (!linkPath) return;

    if (linkPath === "/") {
      linkPath = "/index.html";
    }

    const isActive = currentPath === linkPath;

    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}
