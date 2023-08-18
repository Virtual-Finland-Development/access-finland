# Access Finland monorepo / workspaces (Turborepo)

Access Finland apps and shared components.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `vf-features`: a [Next.js](https://nextjs.org/) app. Access Finland "demo app" that contains experimental features.
- `vf-mvp`: another [Next.js](https://nextjs.org/) app. Access Finland MVP app for the VF project, production.
- `vf-shared`: React components and utils shared by both `vf-features` and `vf-mvp` applications.
- `tailwind-config`: shared taildwind configs
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

### Utilities

This Turborepo has some additional tools already setup for you:

- [Tailwind CSS](https://tailwindcss.com/) for styles
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
