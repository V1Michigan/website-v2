# V1 at Michigan

This is the code repository for the website. Serverless frontend built with Next.js + Tailwind CSS. Hosted on Netlify.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend/Database**: Supabase
- **Payments**: Stripe
- **3D Graphics**: Three.js, React Three Fiber
- **Analytics**: PostHog
- **Deployment**: Vercel
- **Package Manager**: pnpm

## How to work on this Project

1. First clone the repository: `https://github.com/V1Michigan/website-v2.git`.
2. Make sure you enter the repository through terminal `cd <FilePath>/website-v2`.
3. Install dependencies: `pnpm install`. **We DO NOT use npm for this.**
4. Begin Devving: `pnpm dev` or `pnpm run dev`, whatever pleases you. This will allow you to access a dev version of the site @ `localhost:3000` that will update automatically as you save files.
5. Create a new branch for your NEW feature: `git checkout -b [FEATURE_NAME]`. If you want to go to an existing feature: `git checkout [FEATURE_NAME]`.
6. Ask another team member for the latest `.env` file.
7. When you finish a part of your feature and wish to push the changes to the remote repository:
8. `git add [changed_files]` (replace `changed_files` with the actual file names you changed)
9. `git commit -m "meaningful commit message goes here"`
10. `git push --set-upstream origin [FEATURE_NAME]` (the next time you push to this branch you can just say `git push`).

## Linting and Code Quality

We use ESLint + Prettier to lint our code and enforce consistent style. To make this process smoother, we've set up:

1. **Pre-commit hooks**: Automatically lint and format your code when you commit changes. This uses Husky and lint-staged to ensure code quality without disrupting your workflow.

2. **Non-blocking CI**: Our GitHub Actions workflow checks for linting issues but won't block builds due to formatting problems.

For manual linting:

- Use `pnpm lint` to check for linting/style errors
- Use `pnpm lint --fix` to automatically fix (some) linting issues

We recommend using an [ESLint plugin for your editor](https://eslint.org/docs/user-guide/integrations) to lint and format your code as you write it.

- VSCode: [extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), [tutorial](https://www.digitalocean.com/community/tutorials/linting-and-formatting-with-eslint-in-vs-code)

## Project Data Structure

Projects are stored in [Notion](https://notion.so) and built into static JSON data at build time.

### Data Flow

```
Notion DataSource → build script → projects-data.json → API → Components
```

1. **Data Source**: Project information is stored as a Notion DataSource (configured via `NOTION_DATA_SOURCE_ID`)
2. **Build Process**: The build script fetches data from Notion, downloads images, and generates static JSON
3. **Serving**: An API route serves the pre-built JSON data
4. **Consumption**: Components use React Query to fetch and display project data

### Building Project Data

To build or update project data:

```bash
# Build only project data (for development/testing)
pnpm build:projects

# Build project data as part of full production build
pnpm build
```

### Required Environment Variables

These must be set in your `.env.local` file:
- `NOTION_API_KEY` - Your Notion integration API key
- `NOTION_DATA_SOURCE_ID` - The ID of the Notion DataSource containing project information

### Key Files

- `scripts/build-projects-data.ts` - Build script that fetches from Notion and generates JSON
- `lib/notion.ts` - Data transformation, filtering, and sorting logic
- `public/projects-data.json` - Generated project data (do not edit manually)
- `app/api/projects/route.ts` - API route serving project data
- `hooks/useProjects.ts` - React hook for fetching projects
- `types/project.ts` - TypeScript interfaces for Project type
- `app/projects/` - Project directory page and components

### Asset Management

The build process automatically downloads and optimizes:
- **Company logos**: Stored in `public/projects/[company-name].jpg`
- **Founder profile pictures**: Stored in `public/founders/[company-name]/[founder-name].jpg`

All images are resized to 256x256px and converted to JPEG format using Sharp.

### Data Features

Projects can be filtered by:
- **Funding sources**: VC firms, accelerators (e.g., Y Combinator, Techstars)
- **Cohorts**: Product Studio cohorts by semester
- **Categories**: Industry tags (e.g., AI/ML, Developer Tools, B2B)
- **Search**: By company name or project title

Projects are sorted by:
1. Funding status (funded projects first)
2. Investor prestige score
3. Cohort order (newest first)

See the [CONTRIBUTING.md](./CONTRIBUTING.md) file for more detailed information about code standards and workflow.
