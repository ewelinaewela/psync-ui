# Contributing to Psync

Thank you for considering a contribution. Psync is an early-stage project, so small, focused changes are the easiest to review.

## Ways to contribute

- report a reproducible bug;
- improve accessibility or responsive behaviour;
- improve interface wording and synthetic demo fixtures;
- propose a carefully scoped feature;
- improve tests or documentation.

## Scope: interface contributions

The public routes use sample content, not real psychological exercises. Please focus contributions on layout, forms, navigation, timers, accessibility, responsiveness and tests. Shared form and timer components live in `app/components/exercise-ui.tsx`; real exercise content and orchestration are maintained separately and are not part of this contribution workflow.

Do not add, upload, reconstruct or request original psychological materials or real exercise scripts in code, issues, screenshots or tests. Feedback about a real exercise should describe the usability problem without copying its full instructions. Content changes require a separate review by the project and relevant subject-matter experts.

Psync must not present itself as therapy, diagnosis, crisis support or medical advice.

## Development workflow

1. Fork the repository and create a focused branch.
2. Install dependencies with `npm install`.
3. Make the smallest change that solves the problem.
4. Run `npm run check`.
5. Open a pull request describing the reason for the change and how it was tested.

For browser testing, install Playwright locally (`npm install --no-save --package-lock=false playwright` and `npx playwright install chromium`), then run `npm run test:browser`. The test uses a local production demo build and isolated browser data. `PSYNC_PLAYWRIGHT_MODULE` may point to an existing Playwright module; `PSYNC_CHROME_PATH` optionally selects an installed Chrome executable. No payment account or private source is required.

Opening a PR or editing a fork does not publish Psync. Maintainers review contributions, run private regression checks where relevant, and choose a release separately. Do not add deployment jobs or request production credentials in a public PR.

Please do not include personal reflections, health information, credentials, API keys or private source documents in issues, screenshots, tests or commits.

## Design principles

- keep the application usable without an account;
- collect and store no exercise answers by default;
- use plain, supportive and non-judgmental language;
- maintain keyboard access, readable contrast and responsive layouts;
- prefer simple features that work without paid services.
