# Psync

This is the Psync contributor interface: an open-source workspace for testing user experience, accessibility and responsive layouts, and proposing improvements through GitHub. It uses independently written sample content, not the real psychological exercises.

Contribute through [ewelinaewela/psync-ui](https://github.com/ewelinaewela/psync-ui). The contributor demo is intended for [GitHub Pages](https://ewelinaewela.github.io/psync-ui/), which requires a separate manual publication. Creating or merging a PR does not publish the demo or the paid app.

The route names represent Psync's product areas:

- **Imagery**
- **Inner Voice**
- **Anxiety & pressure**

Each exercise route opens the same neutral sample form, timer and summary so contributors can test the UI without private content. The real exercise wording, sequencing, result scripts and Journal implementation are held separately. The public and private versions share `app/components/exercise-ui.tsx` and application styles, so contributions to these components can benefit both. A proposal is reviewed and tested before it is adopted; it cannot change the published product automatically.

Psync is an educational tool. It does not diagnose conditions, provide therapy or replace professional mental health care.

## Privacy by default

The public contributor demo has:

- no accounts;
- no database;
- no analytics or advertising;
- no server-side storage;
- no artificial-intelligence chat.

Exercise answers remain in the memory of the open browser page and disappear when the page is refreshed or closed. The hosting provider may process limited technical information; see the in-app Privacy page for details.

## Run locally

Requirements:

- Node.js 22.13 or newer;
- npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Quality checks

```bash
npm run check
```

This runs linting, creates a production static export and verifies the generated pages.

## Static build

```bash
npm run build
```

The static site is generated in `dist/client/`. The project can be published on GitHub Pages without a custom domain.

## Project structure

```text
app/                    Application routes, components and styles
public/                 Psync icons and public assets
tests/                  Static export tests
.github/workflows/      Contributor checks and manual demo publishing
```

The original research and working protocol documents are private source materials and are intentionally excluded from this repository.

`npm run dev` and `npm run build` use the contributor demo by default, even if private files happen to exist locally. Maintainer-only private preview and production scripts explicitly select the private implementation at build time. A missing private checkout fails the private build rather than silently substituting sample exercises.

## Reviews and publishing

Pull requests run public checks with read-only repository permissions and no production secrets. GitHub Pages publishing is manual. The paid app has a separate manually triggered private workflow. `CODEOWNERS` requests maintainer review; it does not enforce it by itself. Before accepting contributions, enable a GitHub ruleset for `main` requiring pull requests, successful Contributor checks, code-owner review, and protection against force pushes. Do not grant contributors direct write/deploy access.

The working-tree split does not erase old Git history, forks, downloads or previously deployed assets. Review those separately before claiming the exercise content has never been public. See `docs/MAINTAINER-RELEASE.md`.

## Contributing

UX feedback, accessibility improvements and interface code proposals are welcome. Real exercise content is outside the public contribution scope. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. All participation is covered by our [Code of Conduct](CODE_OF_CONDUCT.md).

For security concerns, follow [SECURITY.md](SECURITY.md).

## License

The public interface source and synthetic demo fixtures are available under the [MIT License](LICENSE). No original psychology documents, private exercise implementation, or private Journal source are supplied or licensed by this repository. Previously distributed versions and their history require a separate review; this change does not retroactively alter earlier distributions.
