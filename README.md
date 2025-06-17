# phygen_web

## Project Overview
This is a Next.js project designed to interact with external APIs. The application provides a structured way to fetch, manage, and display data from various server APIs.

## Project Structure

```
├── public/                  # Static files (images, fonts, etc.)
│   ├── file.svg             # SVG icons
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/                     # Source code
│   ├── app/                 # Next.js 13+ App Router
│   │   ├── favicon.ico      # Browser favicon
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout component
│   │   └── page.tsx         # Homepage component
│   ├── Assets/              # Project assets (images, fonts, etc.)
│   ├── Components/          # Reusable UI components
│   ├── Layouts/             # Layout components (headers, footers, etc.)
│   ├── Lib/                 # Library code and third-party integrations
│   └── Utils/               # Utility functions and helpers
├── .gitignore               # Git ignore file
├── eslint.config.mjs        # ESLint configuration
├── next.config.ts           # Next.js configuration
├── next-env.d.ts            # Next.js TypeScript definitions
├── package.json             # Project dependencies and scripts
├── postcss.config.mjs       # PostCSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Folder Structure Explanation

### `public/`
Contains static files that are served directly by the web server. This includes images, fonts, and other assets that don't need to be processed by the build system.

### `src/`
Contains all source code of the application.

#### `src/app/`
Uses Next.js 13+ App Router pattern. This folder contains route components that define the UI for a specific route.
- `layout.tsx`: Root layout that wraps all pages
- `page.tsx`: The main page component
- `globals.css`: Global CSS styles
- `favicon.ico`: Browser favicon

#### `src/Assets/`
Contains project-specific assets that need to be imported into components.

#### `src/Components/`
Contains reusable UI components used throughout the application.

#### `src/Layouts/`
Contains layout components such as headers, footers, sidebars, and navigation components.

#### `src/Lib/`
Contains library code, API clients, and third-party service integrations.

#### `src/Utils/`
Contains utility functions, helpers, and common functionalities used across the application.

## API Client Structure
For API interactions, we're using a structured approach:

1. API service layers in `src/Lib/api/` 
2. Type definitions in `src/types/`
3. Custom hooks for data fetching in `src/Lib/hooks/`

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Integration

To add new API integrations:

1. Create appropriate TypeScript interfaces in `src/types/`
2. Add API service functions in `src/Lib/api/`
3. Create custom hooks in `src/Lib/hooks/` if needed
4. Use the hooks in your components to fetch and display data

## Git Workflow

1. Clone the repository
2. Create a feature branch from `main`
3. Make your changes
4. Run tests and linting
5. Submit a pull request for review

## Coding Standards

- Follow TypeScript best practices
- Use functional components and React hooks
- Keep components small and focused
- Write clear and descriptive comments
- Use absolute imports when possible