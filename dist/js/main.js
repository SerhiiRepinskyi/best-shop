"use strict";
/*------------ Mobile menu + Overlay ------------*/
const openBtn = document.querySelector(".burger-btn");
const closeBtn = document.querySelector(".mobile-menu__close");
const menu = document.querySelector(".mobile-menu");
const overlay = document.querySelector(".mobile-overlay");
// 🔥 handler for ESC
const handleEsc = (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
};
const openMenu = () => {
    if (menu === null || menu === void 0 ? void 0 : menu.classList.contains("mobile-menu--open"))
        return;
    menu === null || menu === void 0 ? void 0 : menu.classList.add("mobile-menu--open");
    overlay === null || overlay === void 0 ? void 0 : overlay.classList.add("mobile-overlay--active");
    document.body.classList.add("no-scroll");
    // ✅ add listeners
    overlay === null || overlay === void 0 ? void 0 : overlay.addEventListener("click", closeMenu);
    document.addEventListener("keydown", handleEsc);
};
const closeMenu = () => {
    if (!(menu === null || menu === void 0 ? void 0 : menu.classList.contains("mobile-menu--open")))
        return;
    menu === null || menu === void 0 ? void 0 : menu.classList.remove("mobile-menu--open");
    overlay === null || overlay === void 0 ? void 0 : overlay.classList.remove("mobile-overlay--active");
    document.body.classList.remove("no-scroll");
    // ✅ remove listeners
    overlay === null || overlay === void 0 ? void 0 : overlay.removeEventListener("click", closeMenu);
    document.removeEventListener("keydown", handleEsc);
};
// 🔥 permanent listeners
openBtn === null || openBtn === void 0 ? void 0 : openBtn.addEventListener("click", openMenu);
closeBtn === null || closeBtn === void 0 ? void 0 : closeBtn.addEventListener("click", closeMenu);
