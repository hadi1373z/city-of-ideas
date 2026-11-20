# City guestbook

“Leave a comment” opens a closeable, mobile-sized dialog inside the city. The
native in-game form sends an optional nickname and a 5–2000-character general note
to a dedicated hosted service, not the existing private House database.
Comments are private to the creator, not a public wall. No account is needed
to submit. The form explains this before sending and retains text on failure.

Service source: workspace `services/city-guestbook`, with its own Sites project
and D1 `city_comments` table. Schema migrations are generated and versioned.
The worker has a submission endpoint restricted to its own origin and the city origin, length/body limits,
honeypot, hourly keyed network bucket (five notes/hour), 500-note daily ceiling,
idempotent receipt IDs and plain-text rendering. No raw network address is stored.
The rate pepper and owner email are runtime secrets, never frontend assets.

Owner inbox:
https://city-of-ideas-guestbook.nutmeg-ibex-4408.chatgpt.site/inbox

Sign in with the owner’s existing ChatGPT account. The server checks the
platform-supplied identity and owner email for every read/export/read-status
request. Other visitors cannot list or read comments. The inbox offers newest
first pagination, unread counts, mark-as-read and JSON export. Export is bounded
at 10,000 records. No private House records, voice settings or visitor notes
are read or modified. The guestbook is the only newly public service.

GitHub Pages continues to serve the city; it does not pretend to host a database.
The form is rendered by the game itself, without an iframe, external links or an owner-inbox link. Only public POST submissions permit the exact city origin through CORS; inbox reads and exports retain same-origin owner checks. Closing preserves the draft. Unconfirmed sends retain both text and the same receipt ID for retries; only a confirmed matching saved receipt clears the form.
