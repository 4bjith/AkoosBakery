# Akoos Bakery Showcase Website

A premium, artisanal bakery storefront application built with React and Vite. This project showcases traditional flavors and authentic baked goods in a modern, highly responsive design inspired by high-end artisan bakeries.

## 🌟 Features

- **Modern Bento Grid Hero:** Fresh, staggered grid layouts for high-impact visual landing.
- **Product Tab Filtering:** Seamlessly filter the Artisan Collection between the full menu, cakes, pastries, and snacks.
- **Responsive Design:** Fully fluid CSS grid and flexbox architecture ensuring perfect rendering on Desktop, Tablet, and Mobile devices.
- **Premium Aesthetics:** Warm caramel color palettes, highly legible typography, soft shadows, and CSS-driven micro-interactions.

## 🚀 Tech Stack

- **Framework:** React 19 + Vite
- **Styling:** Vanilla CSS with comprehensive CSS variable design tokens (`App.css`, `index.css`)
- **Typography:** Inter (via Google Fonts)
- **Icons:** `lucide-react` and standard inline SVGs for optimized loads.

## 📁 Project Structure

- `src/App.jsx` - The main application file containing the single-page layout structure, state management for filters, and all the static product array data.
- `src/App.css` - Advanced CSS Grid setups, complex layout classes, responsive media queries, and component-specific styling.
- `src/index.css` - Global CSS styles and design tokens (colors, font families, base styling resets).
- `src/assets/` - Raw image files utilized to showcase the bakery products.

## 🛠️ Setup and Installation

1. **Install required dependencies:**
   Ensure you have Node.js installed, then run from the root directory:
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Navigate to `localhost` on the port provided by Vite (typically `http://localhost:5173`) to view the application locally.

3. **Building for Production:**
   ```bash
   npm run build
   ```
   This command bundles your React code and CSS into optimal static files in a `dist` directory, ready to be hosted by any static provider.

## 🎨 Design Tokens Checkout
*   Primary Accent: Caramel (`#c79261`)
*   Primary Background: Clean Off-White (`#fdfbf9`)
*   Text Base Color: Charcoal (`#2c2a29`)
*   Footer Background: Dark Brown (`#2a2825`)
