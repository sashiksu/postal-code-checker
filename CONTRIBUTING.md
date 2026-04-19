# Contributing

Thanks for your interest in improving `postal-code-checker`! This guide covers the two most common contributions — **bug fixes** and **country-data issues** — plus the basics of getting set up.

## Quick setup

```bash
git clone https://github.com/sashiksu/postal-code-checker.git
cd postal-code-checker
npm install
npm test            # run the full Jest suite
npm run build       # rollup → tsc → d.ts bundle
```

Node 18+ is recommended. No other system dependencies.

## Before you open a PR

- Branch from `master`. Use `bugfix/<short-desc>` or `feature/<short-desc>`.
- Add or update tests under `src/__tests__/` for any behavior change. Every utility in `src/utils/` has a matching `__tests__/utils/<name>.test.ts` — follow the same pattern for new utilities.
- Run `npm test` and `npm run lint` locally; both must pass.
- Keep commit messages clear and self-contained. One logical change per commit where practical.
- Public API changes go through `src/index.ts`. Anything not re-exported there is internal and free to refactor.

## Country data — how to contribute fixes

**Do not hand-edit `src/assets/index.ts`.** That file is auto-generated from [Google's `libaddressinput`](https://github.com/google/libaddressinput), the same dataset behind Chromium, Android, and Google Pay.

### If a country's postal-code pattern is wrong or outdated

The fix needs to land upstream at libaddressinput first. Open an issue on their repo with the country code, the incorrect behavior, and an authoritative source (postal authority URL, national standard). Once they update, our next `npm run sync:data` pulls the correction automatically.

Feel free to also open an issue here linking to your upstream report — we'll track it on our side.

### If a country is missing from this package

Same path: file at libaddressinput, link it here. We don't add custom per-country data locally — the whole point of the live sync is that the dataset stays authoritative.

### If there's a bug in our regex handling (not the data)

That's a code bug, not a data issue. Open a PR against `src/utils/` with a failing test first, then the fix.

## Refreshing country data (maintainers)

```bash
npm run sync:data    # pulls from Google, rewrites src/assets/index.ts
git diff src/assets/index.ts
npm test             # the countryMatrix snapshot catches regressions
```

`npm run sync:check` runs in `prepublishOnly` and blocks releases where the on-disk data has drifted from what the script would produce. Don't skip it.

## Running the demo locally

```bash
cd demo
npm install
npm run dev
```

Opens on `http://localhost:5173`. The demo imports the local build of the package — run `npm run build` in the repo root first if you want to test against unbuilt changes.

## Reporting bugs

Use the issue templates under `.github/ISSUE_TEMPLATE/` when you open an issue — they prompt for the specific info we need to reproduce.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
