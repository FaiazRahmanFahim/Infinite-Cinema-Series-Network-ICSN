# ICSN — Infinite Cinema & Series Network

**ICSN** is a modern, high-performance web application designed for discovering, exploring, and managing popular movies, TV series, and trending entertainment content.

Built with **React 19**, **Vite**, **Tailwind CSS**, **DaisyUI**, **Framer Motion**, and **Swiper**.

---

## 🎬 Key Features

- **Hero Slider Carousel**: Swiper-powered hero banner featuring featured movie releases, cross-fade slide transitions, live trailer preview modal popups, and watchlist bookmark toggles.
- **Dynamic Content Discovery**: Dedicated features and routes for **Popular Movies**, **Popular Series**, and **Trending Content** utilizing React 19 `use()` promise resolution and React Router data loaders.
- **Glassmorphism Navigation**: Floating backdrop-blur navbar with glowing logo mark, active route pills, search input UI, theme toggle, and animated mobile menu drawer.
- **Minimal Streaming Footer**: Netflix/Apple TV+-style quiet footer layout with streaming utility links, language selection, and social media links.
- **Dark & Light Mode Support**: Instant theme switching powered by `ThemeContext` with local storage persistence and system preference detection.
- **Interactive Media Cards**: Elevated poster cards featuring spring hover scale micro-animations, high-resolution TMDB artwork, gold star rating badges, genre tags, and bookmark state management.
- **Responsive & Accessible**: Fully responsive across mobile, tablet, and desktop screens with automatic smooth scrolling on route changes (`SmoothScrollToTop`).

---

## 🛠️ Tech Stack

- **Core Framework**: React 19, Vite 8
- **Routing**: React Router 7 (`createBrowserRouter`, `RouterProvider`, `useLoaderData`, `NavLink`)
- **Styling**: Tailwind CSS v4, DaisyUI v5
- **Animations**: Framer Motion 13
- **Carousel & Sliders**: Swiper 14
- **Icons**: React Icons (`fi`)
- **State Management**: React Context API (`ThemeContext`, `AuthContext`)

---

## 📁 Project Structure

```text
client/src/
├── components/
│   ├── Banner/             # Hero slider carousel & trailer modal
│   ├── Navbar/             # Glassmorphism header with mobile drawer
│   ├── Footer/             # Minimal streaming platform footer
│   ├── features/           # Feature components
│   │   ├── popular-movies/ # Popular Movies feature component & service
│   │   ├── popular-series/ # Popular Series feature component & service
│   │   └── trending-content/# Trending Content feature component & service
│   └── ui/                 # Reusable UI (MediaCard, SectionHeader, LoadingGrid, EmptyState, ErrorState, ThemeToggle, SmoothScrollToTop)
├── context/
│   ├── ThemeContext.jsx    # Dark/Light theme provider & local storage hook
│   └── AuthProvider.jsx    # Authentication context provider
├── layout/
│   └── MainLayout.jsx      # Home layout composing Banner & content sections
├── pages/
│   └── Root.jsx            # Top-level application shell (Navbar, Outlet, Footer)
├── Routes/
│   └── Routes.jsx          # App router configuration and data loaders
└── Data/                   # Movie, series, and trending JSON datasets
```

---

## 🚀 Getting Started

### 1. Installation
Navigate into the `client` directory and install project dependencies:
```bash
cd client
npm install
```

### 2. Run Development Server
Start the Vite local development server:
```bash
npm run dev
```

### 3. Production Build
Compile and bundle the application for production:
```bash
npm run build
```

---

## 📜 License
Developed for the **ICSN — Infinite Cinema & Series Network** project.
