# Access Finland monorepo / workspaces (Turborepo)

Access Finland apps and shared components.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `af-features`: a [Next.js](https://nextjs.org/) app. Access Finland "demo app" that contains experimental features.
- `af-mvp`: another [Next.js](https://nextjs.org/) app. Access Finland MVP app for the VF project, production.
- `af-shared`: React components and utils shared by both `af-features` and `af-mvp` applications.
- `tailwind-config`: shared taildwind configs
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

### Utilities

This Turborepo has some additional tools already setup for you:

- [Tailwind CSS](https://tailwindcss.com/) for styles
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Usage

Install, and run both apps simultaneously

```bash
npm install && npm run dev
```

Or run apps separately

```bash
npm run dev:features
```

```bash
npm run dev:mvp
```

### Docker

The following network must be created: `vfd-network`.

Create the network with command:

```bash
docker network create vfd-network
```

Run both apps in docker

```bash
docker compose up
```

Run af-mvp separately

```bash
docker compose -f docker-compose.mvp-dev.yml up
```

`af-featues` can be accessed at [http://localhost:3005](http://localhost:3005)  
`af-mvp` can be accessed at [http://localhost:3006](http://localhost:3006)
