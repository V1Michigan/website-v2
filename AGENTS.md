## AGENTS.md

### Project Overview
This is the website repository for V1 at Michigan, a serverless frontend built with Next.js, Tailwind CSS, and TypeScript. It uses the App Router, Supabase for backend/database, Stripe for payments, Three.js for 3D graphics, and PostHog for analytics. Deployed on Vercel.

### Project Structure
- **Framework**: Next.js 16 (App Router) with React 19 and TypeScript
- **Routing**: Primarily App Router (`app/` directory), with some Pages Router (`pages/[...slug].tsx`)
- **Styling**: Tailwind CSS with custom design system (neutral base color, CSS variables for light/dark mode)
- **Components**: Shadcn/ui components in `components/ui/`, custom components in `components/`
- **Data**: Static data in `data/` (e.g., projects.ts, merch.ts)
- **Utilities**: `lib/utils.ts` for Tailwind utilities, `hooks/` for custom hooks
- **Assets**: Public assets in `public/` (images, videos, merch, headshots)
- **Package Manager**: pnpm (do not use npm)

### Build Commands
- **Development**: `pnpm dev` - Starts dev server on localhost:3000 with hot reload
- **Build**: `pnpm build` - Builds production bundle
- **Start**: `pnpm start` - Starts production server
- **Lint**: `pnpm lint` - Runs ESLint on .js,.jsx,.ts,.tsx files; use `pnpm lint --fix` to auto-fix issues

### Test Commands
No testing setup currently configured. No test scripts in package.json.

### Code Style and Conventions
- **TypeScript**: Strict mode enabled, JSX transform `react-jsx`, path aliases `@/*` map to root
- **Linting**: ESLint with TypeScript plugin; warns on unused variables and explicit `any` types; allows console logs
- **Formatting**: Prettier not installed/configured, but mentioned in README; use ESLint for formatting
- **Imports**: Use path aliases (e.g., `@/components`, `@/lib/utils`, `@/hooks`)
- **Components**: Shadcn/ui style (default, RSC, TSX, no prefix); use Lucide icons
- **Styling**: Tailwind with custom CSS variables; body font Arial/Helvetica; custom fonts via CSS vars (serif, sans, instrument)
- **Git Workflow**: Pre-commit hooks with Husky and lint-staged enforce linting; create feature branches from main; meaningful commit messages; push with upstream set
- **File Structure**: 
  - `app/` for pages and layouts
  - `components/` for reusable components (ui/, store/, auth/, etc.)
  - `data/` for static data exports
  - `lib/` for utilities
  - `hooks/` for React hooks
  - `styles/` for global CSS
  - `public/` for static assets

### Instructions for Coding Agents
- Use pnpm for all package management (install, add, etc.)
- Follow TypeScript strict typing; avoid `any` or mark as warnings
- Use App Router for new pages; maintain existing Pages Router where present
- Component naming: PascalCase, file naming: kebab-case
- Import order: React/Next, third-party, internal (with aliases)
- Commit messages: Focus on "why" changes (e.g., "Add user authentication flow" not "Add files")
- Lint before committing; use `pnpm lint --fix` to auto-format
- For UI components, use shadcn/ui patterns and Tailwind classes
- Environment variables: Use `.env` files (ignored in git); ask team for latest
- Code reviews: Ensure linting passes, TypeScript compiles, and follows conventions
- Documentation: Update this file if conventions change; no CONTRIBUTING.md yet

### Additional Notes
- No Prettier config; ESLint handles formatting
- CI checks linting but doesn't block builds on style issues
- Use VSCode ESLint extension for real-time linting
- GitHub Actions for CI; non-blocking on linting failures
- No tests; consider adding Jest/Vitest for future development
- Dark mode supported via class strategy in Tailwind