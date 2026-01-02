# macOS Portfolio
**Agunbiade Odunayo** | **22120613109**

A modern, interactive portfolio website inspired by macOS, featuring a desktop-like interface with dock, resizable windows, widgets, and responsive mobile support. Built with Next.js and React, it showcases personal information, projects, skills, and includes fun elements like mini-games and customizable settings.

## Features

- **macOS-Inspired UI**: Dock with app icons, resizable/minimizable windows, notifications, and wallpapers.
- **Responsive Design**: Seamless switch between desktop and mobile views, with iOS-like mobile launcher and apps.
- **Theming**: Light/dark mode support with system preference detection and manual override.
- **Widgets**: Customizable desktop widgets including analog clock, calendar glance, quote generator, search spotlight, and skill meters.
- **Portfolio Apps**: Dedicated windows for About, Contact (with email form via Nodemailer), Projects, Skills, Settings, and Extras.
- **Mini-Games**: Playable games like Snake, Tic-Tac-Toe, and a Terminal simulator.
- **Animations & Effects**: Smooth transitions using Framer Motion, including boot screen, minimize/restore animations, and blur effects.
- **Audio Integration**: Background sounds with volume control, respecting reduced motion preferences.
- **State Management**: Powered by Zustand for efficient desktop, mobile, and widget state handling.
- **Performance Optimizations**: Image optimization, code splitting, and caching via Next.js configurations.

## Tech Stack

- **Framework**: Next.js (v15.5.2) with React (v19.1.0)
- **Language**: TypeScript (v5)
- **Styling**: Tailwind CSS (with custom macOS-inspired colors and animations), PostCSS, and global CSS for themes and effects
- **Animations**: Framer Motion (v12.23.12)
- **State Management**: Zustand (v5.0.7)
- **Icons**: Lucide React (v0.539.0), React Icons (v5.5.0)
- **Email**: Nodemailer (v7.0.6) for contact form submissions
- **Fonts**: Geist Sans and Geist Mono (via next/font/google)
- **Utilities**: Lodash-ES (v4.17.21) for helper functions
- **Dev Tools**: ESLint, TypeScript type checking
- **Other**: Supports AVIF/WebP images, standalone output for deployment, and security headers

## Prerequisites

- Node.js (v18 or later recommended)
- npm (or yarn/pnpm) for package management

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/macos-portfolio.git
   cd macos-portfolio
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables (if using the contact form):
   Create a `.env.local` file in the root directory with your email credentials for Nodemailer:
   ```
   EMAIL_USER=your-email@example.com
   EMAIL_PASS=your-app-password
   ```

## Usage

- **Development Server**:
  ```
  npm run dev
  ```
  Open [http://localhost:3000](http://localhost:3000) in your browser. Supports hot reloading.

- **Turbopack Development** (experimental, faster):
  ```
  npm run dev:turbo
  ```

- **Build for Production**:
  ```
  npm run build
  ```

- **Start Production Server**:
  ```
  npm run start
  ```

- **Lint Code**:
  ```
  npm run lint
  ```

- **Type Check**:
  ```
  npm run type-check
  ```

- **Clean Cache**:
  ```
  npm run clean
  ```

The app automatically detects mobile/desktop views based on screen size (breakpoint: 768px) and handles theme preferences via `prefers-color-scheme`.

## Configuration

- **Next.js Config** (`next.config.ts`): Enables standalone output, image optimization (AVIF/WebP), compression, and webpack chunk splitting for better performance. Custom headers for security and caching.
- **TypeScript Config** (`tsconfig.json`): Strict mode enabled, with paths alias `@/*` for src directory.
- **Tailwind Config** (`tailwind.config.js`): Custom screens (e.g., mobile/desktop), macOS colors, spacing, animations, and font families.
- **Global Styles** (`globals.css`): Defines light/dark themes, animations (e.g., genie minimize, widget pulse), scrollbars, and accessibility features (reduced motion, high contrast).
- **Root Layout** (`layout.tsx`): Sets metadata, fonts, viewport, and wraps the app in an AudioProvider.
- **Home Page** (`page.tsx`): Handles booting animation, device detection, theme application, and renders Desktop or MobileLauncher based on view.

## Project Structure

```
.
├── src/
│   ├── app/                # Next.js pages and API routes
│   │   ├── web             # Router and Componets for the portfolio webscreen 
│   │   ├── api/contact/    # Contact form endpoint
│   │   ├── layout.tsx      # Root layout with metadata and providers
│   │   └── page.tsx        # Main entry point with boot screen and view switching
│   ├── components/         # Reusable UI components
│   │   ├── apps/           # Portfolio apps (About, Contact, Projects, etc.)
│   │   ├── desktop/        # Desktop-specific (Dock, Widgets, Windows, Wallpapers)
│   │   ├── ui/             # Shared UI (AudioProvider, BootScreen)
│   │   └── windows/        # Window management components
│   ├── hooks/              # Custom hooks ( useWindowManager, etc.)
│   ├── store/              # Zustand stores for state
│   ├── types/              # TypeScript types
│   └── utils/              # Utilities (constants, device detection, etc.)
├── public/                 # Static assets (images, favicon)
├── .env.local              # Environment variables (gitignore'd)
├── next.config.ts          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request. Ensure code passes linting and type checks.

## License

This project is open-source and available under the MIT License (add LICENSE file if needed).

## Acknowledgments

- Inspired by macOS UI elements.
- A big thank you to all those who helped test this project.

For questions or issues, open a GitHub issue or contact via the portfolio's Contact app.
