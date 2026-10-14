# Original House account connection

Implemented 14 October 2026 against downloaded House source commit `48ccb361e8e64857f4e9f94f4598d8dc97970e00`. The original-service addition is deployed in place as version 20, source commit `d0e8879afd634cdf93c60eea6cf210ddf0178735`. The City client and original tools transport are installed in `src/`. **Deployment and fake-backend tests do not establish a granted live connection or cloud persistence.** Those checks require the owner's explicit session connection and are reported separately.

The city uses the original account and database in place. This is not a local copy or replacement backend. House calls are performed by a top-level popup on the original authenticated House origin. Its browser supplies existing same-origin credentials; Sites dispatch supplies its visitor identity and the unchanged original Worker performs all validation, revisions and atomic saves. No key, token, cookie, user ID or sign-in header is returned to the city.

Cross-origin popup messaging is supported by the browser, provided the windows retain their opener relationship. Every message must match the exact peer window, origin, protocol and session nonce. A restrictive COOP policy can sever that relationship; the connection must then fail closed and be reopened after sign-in. See [MDN postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) and [MDN COOP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Opener-Policy).

## Original-service installation

Work only in the separate original House service checkout. Preserve its existing project identity, audience, DB binding, schema and backend source. Do not install test fixtures in that service.

1. Copy `original-service/city-bridge.html`, `city-bridge.css`, `city-bridge.js` and `city-bridge-protocol.js` into its `web/` directory.
2. Copy `original-service/city-online.js` and `city-bridge-worker.js` into its `worker/` directory.
3. In that checkout's `scripts/build-online.mjs`, change only the bundled entry point from `worker/online.js` to `worker/city-online.js`. The original build already copies `web/` into the hosted client directory. `city-online.js` wraps the unchanged `createOnlineWorker()`.
4. Run the original checks and build, and deploy through the supported Sites source/hosting workflow. Keep its audience and original service intact. Publishing the City frontend alone does not install the popup.

The wrapper protects `/city-bridge`, `/city-bridge.html` and the three bridge script/style assets with the same visitor-ID validation as the original Worker. Sites canonicalizes the HTML route to its extensionless alias; both paths receive the same auth and headers. Service bypass access without a visitor identity is rejected. Its restrictive headers permit only local scripts/styles/API fetches and prohibit framing. `Cross-Origin-Opener-Policy: unsafe-none` is scoped to those bridge assets to support the trusted popup. All original `/api` routes are delegated unchanged. A platform-enforced header or sign-in transition may still sever the opener; do not change account authentication to work around that.

Read-only unauthenticated checks returned 401. Signed-in Chrome verified deployed version 20 at canonical `/city-bridge`: it rendered the expected no-opener/no-nonce message and kept Connect disabled. Deployment `appgdep_6acf727f9e3c81918fd1c2441eca7d10` succeeded on 14 October 2026 at 12:16:20 UTC. The protected alias and response headers are installed. No private records were read or mutated by this inspection.

## City client hook

Include `city-house-service.mjs` and its relative `original-service/city-bridge-protocol.js` module in the City asset tree. In the parent city window:

```js
import {createHouseServiceBridge} from './backend-integration/city-house-service.mjs';
window.CITY_HOUSE_SERVICE = createHouseServiceBridge({
  lang: currentLanguage, // en or fa
  onStatus: status => updateOriginalAccountStatus(status)
});
connectButton.onclick = () => window.CITY_HOUSE_SERVICE.connect();
window.addEventListener('city-language', event => {
  window.CITY_HOUSE_SERVICE.setLanguage(event.detail.lang);
});
```

The intended city is `https://hadi1373z.github.io/city-of-ideas/`; the trusted origin is exactly `https://hadi1373z.github.io`. This origin includes other repositories owned by that account. Browser origin checks cannot independently isolate repository paths. The client checks its own City path, the popup still requires an explicit user connection, and the owner must treat all applications on that GitHub origin as part of the same origin security boundary.

Public interface:

| Method | Contract |
|---|---|
| `connect()` | Call directly from a user button; opens the original service popup. No account requests occur until the user chooses **Connect this city session** there. Promise resolves after original `/api/config` confirms private-cloud mode. |
| `connected` | Boolean session status; no private identity value is exposed. |
| `setLanguage(lang)` | Set `en` or `fa` before connecting or while the popup is open. Authenticated peer/nonce messages update only public popup labels, status and direction; private brief problem/proposal/criteria text stays untouched. |
| `request(path, options)` | Returns original JSON; throws `HouseServiceError` with original HTTP status and `outcomeUnknown` when a mutation result is uncertain. |
| `fetch(path, options)` | Response-like `{ok, status, json()}` adapter for original House `houseRequest()` and similar frontend code. |
| `download(path, filename)` | Explicit JSON backup download using the same authenticated bridge, instead of a GitHub-origin `/api` link. |
| `disconnect()` / `destroy()` | End access and reject outstanding requests. Destroy also removes the event listener. |

The original tool frontend must replace API transport with this interface while keeping its original document validation, saved revision, conflicts and explicit user actions. A same-origin tool frame may use `parent.CITY_HOUSE_SERVICE`; the parent city should own the connection popup. Preserve original archive/import, collections, edition history and draft behavior. Do not automatically fall back to a local preview when connection fails.

Supported routes mirror the actual original cloud service: config; house/neighbourhood read/save/export; neighbour select/create/import; city network; paginated/full conversations; validated conversation import; development draft; explicit saved-brief approval and download. Local ChatGPT/GPT setup and arbitrary API/URL fetches are excluded. Original hosted inference is unavailable by design; connecting storage does not add paid or remote plan inference.

## Session and save safeguards

- A fresh 256-bit cryptographic nonce travels in the popup URL fragment, not the query string, and is then removed from the popup address/history. The nonce is a session binding, not an authentication credential.
- Both sides validate exact `event.source`, `event.origin`, protocol and nonce; sends use exact target origins, never `*`. The popup requires its original House origin, opener and nonce before it can connect.
- Explicit popup consent precedes even the config read. The bridge has no generic headers, credential input or arbitrary network proxy. Requests use same-origin credentials, `X-House-Request: 1`, JSON and no redirects. Browser Origin/identity headers are never fabricated.
- Allowed paths/methods/query parameters and request sizes are bounded. There are no automatic save retries. Duplicate request IDs are rejected; the original Worker still enforces revisions and append-only archive rules. Oversized conversation uploads use the original chunked importer.
- Development-brief approval additionally loads the actual saved brief and displays its problem/proposal/acceptance criteria in the original popup. Approval requires a separate button there; no brief content or authority is invented by the city.
- Disconnect/timeout cannot undo an already-submitted save. If its reply is lost, `outcomeUnknown` tells the UI to retain the draft and reload saved state before any explicit retry. Do not log private responses or store them in public assets.

## Validation and remaining gates

Run `node backend-integration/tests/bridge-smoke.mjs` from the City repository. The harness uses a clearly labelled fake backend/window only. It never contacts the House, signs in or reads user data. It checks both canonical popup paths, missing visitor identity (including service-only access), missing opener/nonce, exact origin/source/nonce checks, no requests before consent, allowed routes/body limits, no injected identity headers, replay rejection, revision conflicts, language changes without private-text modification, and disconnection.

Before declaring this connected, verify the deployed original popup assets/build, real top-level sign-in and opener survival, private config read, city rendering of saved state, both language controls and an owner-authorized reversible save/reload/conflict flow. Do not run mutations against existing private records merely as an unattended smoke test. A missing signed-in session should ask the user to sign in through the original House route; it must never ask them for credentials or an API key.

Once this bridge is installed and verified, original cloud data stays in the same account and does not need a migration export. Explicit backups are still useful, and browser-local Park/Atlas notes from another origin still require their compatible export/import path. This prepared connection does not claim that any original records were read or moved.
