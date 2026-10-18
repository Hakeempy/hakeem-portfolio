# hakeem-portfolio

Personal portfolio of Hakeem Wikireh: data engineer, former data analyst, and data analytics instructor.

Live at **https://hakeem-portfolio-azure.vercel.app**.

Built with Next.js (App Router), TypeScript, Tailwind CSS v4, Motion and Three.js. Project case studies are MDX files.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

```
content/
  projects/          One .mdx file per project (frontmatter + case study)
docs/                Planning notes: project inventory, design decisions
public/
  images/projects/   Screenshots and architecture diagrams, one folder per project slug
src/
  app/               Routes: /, /projects, /projects/[slug]
  components/
    sections/        Page sections (hero, experience, teaching, contact)
    ui/              Small reusable primitives (buttons, tags, cards)
    motion/          Animation wrappers built on Motion
  data/              Typed site data: profile, links, experience
  lib/               Content loaders and helpers
```

## Adding a project

1. Create `content/projects/<slug>.mdx` with frontmatter:

   ```yaml
   ---
   title: Project title
   summary: One or two sentences.
   category: data-engineering # or analytics, machine-learning
   stack: [Python, PySpark]
   year: 2025
   repo: https://github.com/...
   featured: false
   order: 12
   ---
   ```

2. Put images in `public/images/projects/<slug>/`.
3. The project shows up on `/projects` and gets its own page at `/projects/<slug>`. Set `featured: true` to also list it on the home page.

## Deployment

The site is hosted on Vercel and connected to this repository: every push to `main` deploys to
production, and every other branch gets its own preview URL. To deploy by hand from this folder:

```bash
npx vercel deploy --prod
```
