# Contributor demo and private app

## Local commands

- `npm run dev` / `npm run build`: public contributor demo with synthetic fixtures.
- `npm run check`: public demo build, lint and boundary tests.
- `npm run test:browser`: interactive demo regression scenarios in isolated Chromium; install Playwright as described in CONTRIBUTING.
- `npm run dev:private`: real exercises plus local Journal preview (requires private checkout).
- `npm run build:private:production`: real exercises and production Journal, with real configuration required; no deployment.
- `npm run test:browser:private`: full private regression suite with mocked licensing. Requires private checkout and Playwright. No real payments.

The private checkout must be located at `premium-private/` next to `app/`. Vite resolves `@psync/exercise` to the demo unless the maintainer build explicitly sets `PSYNC_EXERCISE_MODE=private`. The production output validator rejects a sample exercise page. Private sources are not needed for the public demo build. Original psychology documents remain in ignored `Psync_content/` and are never build inputs.

Shared fields, choices and timer UI are in `app/components/exercise-ui.tsx`. The private implementation imports these exact components; accepted improvements are verified with the private browser suite. Product content, branching and result scripts are not contributor extension points. Contributors can propose UI changes but can modify any MIT-licensed public code in their own forks.

## Before uploading this change

1. Review public Git history and currently hosted assets: the earlier `GuidedExercise.tsx` included real content and remains in existing commits. Moving it now does not remove old copies. Do not promise retrospective confidentiality.
2. Decide how to handle existing public history/deployments and notify content owners if needed. A fresh sanitized repository or a coordinated history rewrite may be considered separately; neither is done by these local changes, and neither retracts downloads or forks.
3. Review the exact public diff and staged files; keep source documents, private tests, local artifacts, credentials and Journal exports out. Root `.gitignore` excludes private directories and local artifacts; ignoring does not remove already tracked files.
4. Enable GitHub rules for `main`: require PRs, Contributor checks and code-owner review; restrict bypasses/direct pushes and force pushes. CODEOWNERS alone is not a server-side restriction. Review collaborators and Actions access. Do not run untrusted PR changes with private source or production secrets.
5. Apply and review the workflow changes on GitHub. Until pushed, the currently configured workflow and deployment remain unchanged. Public checks have no deploy permissions; Pages publishing is manual. Do not reintroduce automatic production publishing on PRs or merges.
6. Pin reviewed public and private commits for a paid release and run the private production tests. GitHub environment protection and secrets must be configured in the account; local code cannot enforce those settings.
7. Publish the contributor demo separately from the paid app. Clearly label which URL is sample content and which is the real product.

## Confidentiality limits

Private original documents and unpublished drafts stay out of both public sources and generated output. Any exercise instructions intentionally displayed in the real app are visible to its users and may be copied. Repository separation does not make client-side instructions secret. Do not publish original documents or source maps containing private source. Protect license access server-side, independently of source visibility.
