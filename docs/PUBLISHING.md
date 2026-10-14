# Source and deployment mapping

The City of Ideas target is `hadi1373z/city-of-ideas`, branch `main`. The `.github/workflows/pages.yml` workflow checks `src/`, builds `_site/` and deploys the Pages artifact. `version.json` identifies the source commit and a deterministic content hash; `asset-manifest.json` records each file’s SHA-256.

The workflow verifies that the live site serves the expected commit and content hash, then fetches every asset and compares its exact bytes/SHA-256 against the build manifest. Browser QA separately verifies movement, entry clicks, real tool actions, both languages and persistence. A successful HTTP response alone is not a completed migration.

The initial publication uses the existing Windows Credential Manager GitHub login. No credential is stored in the project, passed as a command argument, printed or put in client code. Future publication is handled by the workflow’s narrowly scoped GitHub token.

GitHub Pages hosts the static frontend. The original House of Ideas Sites Worker and user-owned database belong to a separate authenticated origin. This repository does not replace or claim to migrate that private backend. Exact preserved capabilities and remaining account/export requirements are recorded in the verification report.
