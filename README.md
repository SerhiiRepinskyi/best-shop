# <img src="./public/favicon.svg" width="25"/> Best Shop — Front-End Capstone Project (EPAM Fundamentals 2026)

This project is a front-end implementation of an e-commerce website built with HTML, SCSS, and TypeScript.

It includes dynamic rendering of components, product catalog, product details page, and basic client-side state management (cart and user session via LocalStorage).


![Preview](public/preview.webp)

---

## 🔗 Live Demo

👉 [View live demo on Vercel](https://....vercel.app)

---

## ✨ Features

- Dynamic header and footer loading
- Responsive layout (desktop, tablet, mobile)
- Product catalog from JSON data
- Product details page
- Reusable product collections (random / filtered)
- Cart functionality (LocalStorage)
- Login modal (client-side session)
- Accessible UI components (tabs, modals, navigation)

---

## 🛠 Tech Stack

- **HTML5**
- **SCSS (SASS)**
- **TypeScript**
- **Vite (dev server & build tool)**

---

## ⚙️ Setup & Run

Clone the repository and run the project locally:

```bash
npm install
npm run dev
```

The app will be available at:

```
http://localhost:5173/
```

---

## 📁 Project Structure (simplified)

```text
src/
├── scss/           → styles (SCSS)
├── ts/             → TypeScript logic

public/
├── assets/         → images, icons, data.json
├── components/     → HTML partials (header, footer, modal)

html/
├── *.html          → pages (catalog, cart, product, etc.)

index.html          → main entry point
package.json        → project dependencies and scripts
tsconfig.json       → TypeScript configuration
vite.config.ts      → Vite build and dev server config
...
.stylelintrc.cjs    → configures Stylelint for Sass/CSS files
eslint.config.mjs   → configures ESLint for TypeScript files

```

## 📌 Notes

- The project uses dynamic component loading via fetch.
- SCSS is compiled automatically via the dev script.
- All interactive logic is implemented in TypeScript modules.
- No backend — user and cart state are stored in LocalStorage.

---

## 📊 Project Evaluation (Checklist)

This project was validated against the official Final Project Implementation Checklist provided for the course.

- 📄 Checklist file: Final_Project_Implementation_Checklist.docx
- ✅ Final score: **?? / 64**

---

## 👨‍💻 Author

**Serhii Repinskyi**

Front-End Capstone Project (EPAM Fundamentals 2026)
