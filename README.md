# Lemon Code

Standalone Angular application for the Developer Task Laboratory (`scope: code.*`), extracted from `lemon-actions` and prepared for independent testing and iteration.

## Architecture
- **Frontend**: Angular 18 standalone components (`OnPush`, native `@if`/`@for`, `inject()`, Tailwind CSS).
- **Backend Dependency**: Connects to the `lemon-actions` API (`http://<host>:3000/api` via `src/environments/environment.ts` or `/api` proxy during `ng serve`), synchronizing `.lemon/tasks.json` and `.lemon/results.json`.

## Development
```bash
npm install
npm start
```

Before running local servers on custom ports, follow [AGENTS.md](./AGENTS.md) and register via `lemon-projectarium` (`4320+`).

## Build & Test
```bash
npm run build
npx ng test --watch=false --browsers=ChromeHeadlessCustom
```
