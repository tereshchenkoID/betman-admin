# 🚀 Admin Betman

Modern admin dashboard interface built with **React 18** and **Vite 8**.

---

## 🛠 Tech Stack

| Category | Technologies |
|---|---|
| **Core** | React 18, React Router v7, Zustand |
| **Build Tool** | Vite 8 (Modern Sass compiler API) |
| **Styling** | SCSS, Clsx |
| **UI & Icons** | FontAwesome, React Select, React Toastify, React Tooltip |
| **Data & Charts** | Axios, Chart.js, React-ChartJS-2 |
| **Localization** | i18next (with browser detector & HTTP backend) |
| **Utilities** | Anime.js, File-saver, React Barcode, TinyMCE |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have **Node.js** (v18+) and **npm** installed on your machine.

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
```

Runs the app in development mode at [http://localhost:3000](http://localhost:3000) with instant HMR (Hot Module Replacement).

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm start` | Starts the Vite development server on port 3000 |
| `npm run build` | Bundles and optimizes the application for production |
| `npm run preview` | Serves the production build locally for verification |

---

## 📁 Import Aliases

Configured path aliases allow importing without relative paths (`../../`):

| Alias | Resolves to |
|---|---|
| `components` | `./src/components` |
| `modules` | `./src/modules` |
| `pages` | `./src/pages` |
| `stores` | `./src/stores` |
| `constant` | `./src/constant` |
| `context` | `./src/context` |
| `App` | `./src/App` |
| `src` | `./src` |
| `scss` | `./src/scss` |

**Example:**

```js
import Button from 'components/Button'
import { useAuthStore } from 'stores/useAuthStore'
```

---

## ⚡ Build & Code Splitting

Production builds use dynamic vendor chunking (`manualChunks`) to optimize caching and asset load times:

- **`vendor-react`** — Core React libraries (`react`, `react-dom`, `react-router-dom`)
- **`vendor-fa-*`** — Granular FontAwesome icon bundles (solid, brands, regular, core)
- **`vendor-i18n`** — Localization runtime modules
- **`vendor-others`** — Additional third-party dependencies
