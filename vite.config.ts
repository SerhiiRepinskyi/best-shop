import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        catalog: "html/catalog.html",
        about: "html/about.html",
        contact: "html/contact.html",
        cart: "html/cart.html",
      },
    },
  },
});
