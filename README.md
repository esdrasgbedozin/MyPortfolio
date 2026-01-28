# Astro Starter Kit: Minimal

```sh
pnpm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `pnpm install`         | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## 🔒 Environment Variables

This project requires several environment variables for full functionality. See `.env.example` for the complete list.

### Required Variables

- `RESEND_API_KEY`: Resend email service API key
- `TURNSTILE_SECRET_KEY`: Cloudflare Turnstile anti-spam secret
- `SENTRY_DSN`: Sentry error tracking DSN (optional but recommended)

### Local Development

1. Copy `.env.example` to `.env.local`
2. Fill in your actual API keys
3. Never commit `.env.local` to version control

### Vercel Deployment (EF-049f)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project → Settings → Environment Variables
3. Add each variable from `.env.example`:
   - `RESEND_API_KEY` (Production, Preview, Development)
   - `TURNSTILE_SECRET_KEY` (Production, Preview, Development)
   - `SENTRY_DSN` (Production, Preview, Development)

### Sentry Configuration (Epic 4.2)

1. Create a project on [sentry.io](https://sentry.io)
2. Select platform: **Astro**
3. Copy the DSN from project settings
4. Configure alert rules:
   - Navigate to Alerts → Create Alert Rule
   - Condition: "When the issue is seen more than 5 times in 1 minute"
   - Action: Send email notification
   - Environment: Production only

**Features:**

- Automatic error capture for 5xx server errors
- Performance monitoring (10% sample rate in production)
- Breadcrumb tracking for request lifecycle
- Context enrichment: requestId, IP, userAgent
