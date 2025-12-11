# eSIMwallet

[![CI Status](https://github.com/eSIMwallet/esimwallet.io/actions/workflows/ci-tests.yml/badge.svg)](https://github.com/eSIMwallet/esimwallet.io/actions/workflows/ci-tests.yml)

**URL:** [dev.esimwallet.io](https://dev.esimwallet.io)<br />
**Storybook URL:** [esimwallet.stories.chromatic.com](https://master--666956b4ed41e44e63f11467.chromatic.com)

Built with [NextJS](https://nextjs.org/docs) and [PayloadCMS](https://payloadcms.com/), deployed to [Vercel Platform](https://vercel.com/).

## Development

```bash
# Install dependencies using PNPM package manager.
pnpm install

# Start local Mongo database (needed by PayloadCMS) and import initial data
docker-compose up
pnpm payload:init-db
pnpm payload:import-mm

# Run the site (watch/reload mode)
pnpm dev
# Run the site (watch/reload mode, but production-like build)
pnpm dev:start

# When working with Stripe / Payments, to have webhook forwarded and processed to local env
pnpm stripe:listen

# Trigger Vercel deployment (dummy commit as Vercel registered user)
pnpm trigger-deployment-commit
```

Remember to edit the `.env` file - see ENV Variables section below.

Open [localhost:3000](http://localhost:3000) with your browser to see the app.
Access PayloadCMS on [localhost:3000/payload](http://localhost:3000/payload) url.

## Storybook - working with UI

Start our [Storybook](https://master--666956b4ed41e44e63f11467.chromatic.com) to work and style components in isolation and review design.

```
pnpx storybook
```

Our Storybook also renders most of our documentation / README files - check it out!

## Unit testing

```bash
pnpm test

# in case of any issues with cached tests results, run one-off non-cached version.
pnpm test:run
```

# Read more

- [CLI Commands](./docs/CLI-commands.mdx)
- [E2E Testing](./docs/Testing-E2E.mdx)
- [ENV variables](./docs/ENV-variables.mdx)
- [Working with PayloadCMS](./docs/PayloadCMS.mdx)
- [Stripe, Orders and Payments](./docs/Orders-and-Payments.mdx)

---

(c) 2024 eSIMwallet team
