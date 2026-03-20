# Agent Guidelines for Mandeep.dev

This is a personal portfolio website built with React 19, Vite 7, and Tailwind CSS 4.

## Commands

### Installation
```bash
npm install    # or pnpm install
```

### Development
```bash
npm run dev          # Start dev server at http://localhost:5173
npm run dev -- --host # Start on network (for mobile testing)
```

### Build & Deploy
```bash
npm run build    # Build for production (outputs to dist/)
npm run preview  # Preview production build locally
npm run deploy   # Deploy to GitHub Pages (gh-pages -d dist)
```

### Linting
```bash
npm run lint     # Run ESLint on all files
```

### Testing
This project does not currently have a test framework configured. If adding tests, use Vitest for this Vite-based React project.

## Code Style Guidelines

### General
- Use functional components with arrow functions or function declarations
- Use JSX for React templates
- Default export for page/component files, named exports for utilities
- Component files should be PascalCase (e.g., `Button.jsx`, `Hero.jsx`)
- Utility files should be camelCase (e.g., `utils.js`, `helpers.js`)

### Imports
- Order: external libraries → internal components/utilities → assets/styles
- Use absolute imports from `src/` (e.g., `import Button from '@/components/ui/Button'`)
- Group imports with blank lines between groups
- Avoid unnecessary default imports; prefer named imports

```jsx
// Good
import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import CustomCursor from './components/cursor/CustomCursor';
import Footer from './components/common/Footer';
import './index.css';
```

### Formatting
- Use 2 spaces for indentation
- No semicolons at end of statements
- Use single quotes for strings in JSX attributes, double quotes elsewhere optional
- Trailing commas in multiline objects/arrays
- Max line length: 100 characters (soft limit)

### Types
- TypeScript is NOT currently configured (using plain JavaScript)
- If adding TypeScript later, use explicit types for props and function returns
- Use JSDoc comments for complex functions if needed

### Naming Conventions
- **Components**: PascalCase (`Hero`, `ContactForm`, `ProjectCard`)
- **Variables/functions**: camelCase (`isLoading`, `handleSubmit`, `fetchData`)
- **Constants**: UPPER_SNAKE_CASE or camelCase with prefix `k` (e.g., `kApiBaseUrl`)
- **CSS Classes**: Tailwind utility classes (kebab-case in markup)
- **Files**: kebab-case for utilities, PascalCase for components

### React Patterns
- Destructuring props for clarity
- Default prop values in function signature
- Use `className` not `class` for JSX
- Prefer composition over inheritance
- Extract inline styles to Tailwind classes or CSS variables

```jsx
// Good
export default function Button({ 
  children, 
  onClick, 
  variant = "primary", 
  className = "",
  ...props 
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`px-6 py-3 ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
```

### Error Handling
- Use try/catch for async operations
- Display user-friendly error messages in UI
- Log errors to console with context for debugging
- Use error boundaries for component tree failures

### Tailwind CSS
- Use Tailwind utility classes for all styling (v4 syntax)
- Avoid inline styles except for dynamic values
- Use arbitrary values sparingly: `w-[200px]` instead of `w-[19rem]`
- Group related classes logically in templates

### Animation
- Use Framer Motion for animations (already installed)
- Prefer declarative animations over imperative CSS transitions
- Use `whileHover`, `whileTap` for simple interactions
- Consider `AnimatePresence` for enter/exit animations

### File Organization
```
src/
├── components/
│   ├── common/      # Shared components (Footer, Header)
│   ├── sections/    # Page sections (Hero, About, Projects)
│   ├── ui/          # Reusable UI primitives (Button, Card)
│   └── cursor/      # Cursor-related components
├── data/           # Static data (portfolio.js)
├── styles/         # Global CSS
├── assets/         # Images, fonts, etc.
├── App.jsx         # Main app component
└── main.jsx        # Entry point
```

### Git Workflow
- Use conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `style:`
- Create feature branches for new features
- Run `npm run lint` before committing
- Ensure build passes before merging to main

### Accessibility
- Use semantic HTML elements (`<main>`, `<section>`, `<nav>`)
- Include alt text for images
- Ensure keyboard navigation works
- Use proper heading hierarchy (h1 → h2 → h3)
