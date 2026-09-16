# Research into action

An interactive, mobile-friendly companion to Yang et al. (2026), **Developing the UK’s capability in behavioural research: Identifying strengths, challenges and strategies through cross-sector workshops**, PLOS One 21(9), e0357909.

[Read the paper](https://doi.org/10.1371/journal.pone.0357909) · [Original strategy table](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0357909#pone-0357909-t003)

Readers choose one of the ten actor groups in Table 3, explore the ten strategies in a map or list, and save a personal action plan. All source actor mappings are retained. Saved plans stay in the browser and can be copied, downloaded as text, printed as PDF, or shared through a URL. No account, server, analytics, or external font service is required.

## Run locally

Requires Node.js 22.12+ and npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173. For the production build:

```sh
npm run build
npm run preview
```

## Share on LinkedIn

The interactive experience lives on a webpage. Use the square image as the LinkedIn post attachment and include the published webpage link in the post. The image itself is static.

- `public/linkedin-post.png`: 1080 × 1080 post image.
- `public/social-preview.png`: 1200 × 627 link-preview image.
- `linkedin-post.md`: suggested post text and image alt text.

For GitHub Pages, follow [the setup and publishing guide](PUBLISHING.md). The supplied workflow builds, tests and publishes the site when you choose **Actions → Deploy to GitHub Pages → Run workflow**. It gets the public URL from GitHub automatically and configures asset paths and social-preview metadata. The separate **Check website** workflow runs on pushes and pull requests without publishing.

For another static host, set `VITE_SITE_URL` to the actual public HTTPS address, run `npm run build`, and deploy the contents of `dist`. No backend is needed. Do not use the localhost preview link in a public post.

The public URL can point to a particular role, strategy, and saved selection. For example, the query string `?role=funders&strategy=5&plan=5,6` opens the funder view with two saved strategies. Numbers match Table 3 and do not indicate priority.

To regenerate both social images while the dev server is running:

```sh
npm run export:social
```

Exports use the actual local fonts and the same diagram component as the website, keeping text sharp and content consistent.

## Content and evidence

`src/data/source-table.json` contains the original ten rows extracted from the publisher’s JATS XML. `src/data/strategies.ts` derives strategy titles and actions verbatim from these rows for the “Put it into practice” panel, saved plans, and copied, downloaded and printed exports. Only the row numbers and bullet markers are separated for display; wording, spelling, punctuation and action order are preserved. No paraphrased strategy summaries are added. Short labels are used only for navigation on the map and list. Audience connections are derived from the original actor cells. Other strategies remain explorable with a note when the table does not map them to the selected role.

The study involved 58 participants in five UK workshops held in November–December 2024. It was published on 10 September 2026. The strategies were proposed by participants, are not ranked, and were not implemented or evaluated in the study. Feasibility, cost, acceptability, and impact have not been established. The app’s source dialog, footer, and exports preserve this distinction.

Article and table copyright © 2026 Yang et al., [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Short navigation labels are identified as adaptations in the app. The header and LinkedIn graphics use the official BR-UK colour icon and organisation subtitle, following the existing BR-UK AI repository’s header treatment. See [logo provenance](public/brand/README.md). The explorer retains its original palette and typography.

## Structure and checks

- `src/components/`: audience selection, SVG map, action detail, plan/source dialogs and social export layout.
- `src/lib/state.ts`: validated URL state, browser persistence and clipboard support.
- `design/concept-desktop.png`: full-screen design reference generated using built-in Image Gen.
- `design/design-system.md` and `design/image-prompt.txt`: visual specification, intentional extensions and generation prompt.
- `tests/explorer.spec.ts`: source mapping, all strategy panels, keyboard/list navigation, history, persistence, downloads, sharing, invalid input, storage failures, responsive behaviour and automated accessibility checks.

```sh
npm test
```

Tests and image exports use Playwright with installed Google Chrome by default. Set `PLAYWRIGHT_CHANNEL=chromium` to use a Playwright-managed Chromium installation instead. Test artifacts are written outside the project under `/tmp/plos-action-explorer-test-results`.

Fonts are bundled locally from Fontsource (DM Sans and Lora, SIL Open Font License). Layout supports small phones through desktop screens and honours reduced-motion preferences. Native dialogs provide focus trapping and Escape-to-close behaviour; the map supports keyboard activation and has a list alternative.
