# Repository Guidelines

## Project Structure & Module Organization
- `backend/` – Node/Express API (TypeScript). Domain folders (controllers, services, validators) keep logic isolated, and colocated `*.test.ts` files document behavior.
- `admin-console/` – Vue 3 + Vite desk console; shared UI lives in `src/components/` and routed pages in `src/views/`.
- `miniprogram/` – uni-app WeChat client with pages under `pages/`, shared state in `stores/`, and reusable blocks in `components/`.
- `mobile-admin/` – uni-app operations console mirroring the mini program layout for field tooling.
- `shared/` – cross-cutting docs (`shared/docs`), docker helpers (`shared/tools/docker`), mock data, and automation scripts.
Keep Sequelize migrations in `backend/migrations/` and align contract changes with `shared/docs/api/` before merging.

## Build, Test, and Development Commands
- `cd backend && npm run dev` – start the API with nodemon; Swagger is available at `http://localhost:3000/api-docs`.
- `cd backend && npm run test` (add `--watch` for TDD) – run the Jest suite; `npm run build` transpiles into `dist/`.
- `cd admin-console && npm run dev` – Vite dev server at `http://localhost:5173`; `npm run build` + `npm run preview` validate production assets.
- `cd miniprogram && npm run dev:mp-weixin` and `cd mobile-admin && npm run dev:mp-weixin` – launch uni-app builds inside HBuilderX; use `npm run build:mp-weixin` before packaging.
- `cd shared/tools/docker && docker-compose up -d` – boot MySQL, Redis, and the mock HTTP services prior to multi-surface integration.

## Coding Style & Naming Conventions
- TypeScript is the default; respect strict compiler settings and the path aliases declared in each `tsconfig.json`.
- Enforce 2-space indentation and ESLint (`npm run lint`, `lint:fix`) in every package; run `npm run format` inside `admin-console` to apply Prettier.
- Branch names follow `feature/<scope>` or `bugfix/<issue-id>`; DTOs/interfaces use `PascalCase`, helpers use `camelCase`, and REST routes stay kebab-case.
- Copy `.env.example` to `.env` per package for local overrides; never commit populated secrets.

## Testing Guidelines
- Backend coverage relies on Jest + ts-jest; colocate specs as `*.test.ts` next to their targets and keep touched files above 80% statements (`npm run test -- --coverage`).
- Exercise happy-path and edge-case flows for every new controller, validator, and Sequelize hook before requesting review.
- Mini program and admin console work require manual smoke tests via HBuilderX or `npm run preview`; capture screenshots when UI behavior shifts.
- Prefer the mock server at `http://localhost:3001` until the real API (`http://localhost:3000`) is available, then rerun the scenario end to end.

## Commit & Pull Request Guidelines
- Use Conventional Commits such as `feat(auth): add MFA guard` so release automation can infer changes.
- Keep PRs scoped to a single module; cross-surface work needs reviewers from each affected directory plus updates in `shared/docs/`.
- Every PR description should link its issue, call out risk areas, list the commands/tests executed, and attach UI or API evidence for user-facing changes.
