// FAKE BACKEND ONLY: these tests never contact a Site, sign in or read user data.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {PROTOCOL, HOUSE_ORIGIN, CITY_ORIGIN, allowedRoute, checkedRequest, trustedMessage, callOriginalService} from '../original-service/city-bridge-protocol.js';
import {withCityBridge} from '../original-service/city-bridge-worker.js';
import {createHouseServiceBridge, HouseServiceError} from '../city-house-service.mjs';
const nonce = 'a'.repeat(64), id = 'b'.repeat(32);
const peer = {}, envelope = {protocol: PROTOCOL, nonce, type: 'hello'};
assert(trustedMessage({source: peer, origin: CITY_ORIGIN, data: envelope}, {peer, origin: CITY_ORIGIN, nonce}));
for (const event of [{source: {}, origin: CITY_ORIGIN, data: envelope}, {source: peer, origin: 'https://example.invalid', data: envelope}, {source: peer, origin: CITY_ORIGIN, data: {...envelope, nonce: 'c'.repeat(64)}}]) assert(!trustedMessage(event, {peer, origin: CITY_ORIGIN, nonce}));
for (const [method, path] of [['GET','/api/config'], ['GET','/api/house/export'], ['GET','/api/conversations?before=12&limit=500'], ['PUT','/api/cities'], ['POST','/api/neighborhood/import'], ['POST','/api/conversations/import'], ['POST','/api/improvements'], ['POST','/api/improvements/11111111-1111-1111-1111-111111111111/approve'], ['GET','/api/improvements/11111111-1111-1111-1111-111111111111/file']]) assert(allowedRoute(method, path), path);
for (const [method, path] of [['GET','https://evil.invalid/api/house'], ['GET','//evil.invalid/api/house'], ['GET','/api/%68ouse'], ['GET','/api/house#x'], ['GET','/api/house?user=other'], ['GET','/api/conversations?limit=501'], ['GET','/api/conversations?limit=5&limit=10'], ['POST','/api/gpt/chat'], ['POST','/api/chatgpt/start'], ['DELETE','/api/house'], ['GET','/api/conversations?before=0'], ['GET','/api/conversations?before=9999999999999999']]) assert(!allowedRoute(method, path), path);
assert.throws(() => checkedRequest({id, method: 'GET', path: '/api/house', headers: {Authorization: 'fixture'}}));
assert.throws(() => checkedRequest({id, method: 'GET', path: '/api/house', body: {}}));
assert.throws(() => checkedRequest({id, method: 'PUT', path: '/api/house', body: {fixture: 'a'.repeat(1_300_000)}}));
let fakeRevision = 0; const calls = [];
const fakeBackend = async (path, options) => {
  calls.push({path, options});
  if (path === '/api/config') return Response.json({mode: 'online', storage: 'private-cloud', capabilities: {conversationArchive: true}});
  if (path === '/api/house' && options.method === 'GET') return Response.json({house: {fixture: true}, revision: fakeRevision});
  if (path === '/api/house' && options.method === 'PUT') {
    const body = JSON.parse(options.body);
    if (body.revision !== fakeRevision) return Response.json({error: 'Fixture save conflict. Your draft is kept.'}, {status: 409});
    return Response.json({revision: ++fakeRevision});
  }
  return Response.json({error: 'Fixture unsupported.'}, {status: 404});
};
const result = await callOriginalService({id, method: 'PUT', path: '/api/house', body: {revision: 0, house: {fixture: true}}}, fakeBackend);
assert.equal(result.status, 200); assert.equal(result.data.revision, 1);
assert.equal(calls[0].options.credentials, 'same-origin'); assert.equal(calls[0].options.mode, 'same-origin'); assert.equal(calls[0].options.redirect, 'error'); assert.equal(calls[0].options.headers['X-House-Request'], '1'); assert(!Object.hasOwn(calls[0].options.headers, 'oai-authenticated-user-id')); assert(!Object.hasOwn(calls[0].options.headers, 'Origin'));
assert.equal((await callOriginalService({id, method: 'PUT', path: '/api/house', body: {revision: 0, house: {fixture: true}}}, fakeBackend)).status, 409);
const notSignedIn = await callOriginalService({id, method: 'GET', path: '/api/config'}, async () => new Response('<html>private sign-in fixture</html>', {status: 401, headers: {'Content-Type': 'text/html'}}));
assert.equal(notSignedIn.status, 401); assert(!JSON.stringify(notSignedIn).includes('private sign-in fixture'));
let originalCalls = 0, assetCalls = 0;
const worker = withCityBridge({fetch: async () => { originalCalls++; return new Response('original fixture'); }});
const env = {ASSETS: {fetch: async () => { assetCalls++; return new Response('static fixture'); }}};
for (const route of ['/city-bridge', '/city-bridge.html']) assert.equal((await worker.fetch(new Request(`${HOUSE_ORIGIN}${route}`), env)).status, 401); assert.equal(assetCalls, 0);
const serviceOnly = new Request(`${HOUSE_ORIGIN}/city-bridge.html`, {headers: {'OAI-Sites-Authorization': 'fixture service access is NOT visitor identity'}});
assert.equal((await worker.fetch(serviceOnly, env)).status, 401); assert.equal(assetCalls, 0);
for (const route of ['/city-bridge', '/city-bridge.html']) {
  const gated = await worker.fetch(new Request(`${HOUSE_ORIGIN}${route}`, {headers: {'oai-authenticated-user-id': 'fake-test-visitor'}}), env);
  assert.equal(gated.status, 200); assert.equal(gated.headers.get('Cross-Origin-Opener-Policy'), 'unsafe-none'); assert(gated.headers.get('Content-Security-Policy').includes("connect-src 'self'")); assert.equal(gated.headers.get('X-Frame-Options'), 'DENY');
}
await worker.fetch(new Request(`${HOUSE_ORIGIN}/api/house`), env); assert.equal(originalCalls, 1);

// Execute popup UI with a synthetic window/DOM. Test both explicit consent and fail-closed entry.
const originalGlobals = new Map(['window','document','location','history','fetch'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
async function popupFixture({opener = {}, hash = `#nonce=${nonce}`} = {}) {
  const nodes = new Map(), messages = [], listeners = new Map(); let requests = 0;
  const node = key => { if (!nodes.has(key)) nodes.set(key, {disabled: false, hidden: false, textContent: '', onclick: null}); return nodes.get(key); };
  const testPeer = opener && {postMessage: (data, origin) => messages.push({data, origin})};
  globalThis.window = {opener: testPeer, addEventListener: (type, fn) => listeners.set(type, fn)};
  globalThis.document = {getElementById: node, documentElement: {}};
  globalThis.location = {origin: HOUSE_ORIGIN, pathname: '/city-bridge.html', hash};
  globalThis.history = {replaceState() {}};
  globalThis.fetch = async (...args) => { requests++; return fakeBackend(...args); };
  await import(new URL(`../original-service/city-bridge.js?fake=${crypto.randomUUID()}`, import.meta.url));
  return {node, messages, listeners, peer: testPeer, document: globalThis.document, count: () => requests,
    send(data, source = testPeer, origin = CITY_ORIGIN) { listeners.get('message')?.({source, origin, data: {protocol: PROTOCOL, nonce, ...data}}); }};
}
try {
  for (const input of [{opener: null}, {hash: '#nonce=bad'}]) { const p = await popupFixture(input); p.send({type: 'hello'}); await p.node('connect').onclick?.(); assert.equal(p.count(), 0); }
  const p = await popupFixture({hash: `#nonce=${nonce}&lang=fa`});
  assert.equal(p.document.documentElement.lang, 'fa'); assert.equal(p.document.documentElement.dir, 'rtl');
  p.send({type: 'language', lang: 'en'}, {}, CITY_ORIGIN); assert.equal(p.document.documentElement.lang, 'fa');
  p.send({type: 'language', lang: 'en', nonce: 'f'.repeat(64)}); assert.equal(p.document.documentElement.lang, 'fa');
  p.send({type: 'language', lang: 'en'}); assert.equal(p.document.documentElement.lang, 'en'); assert.equal(p.document.documentElement.dir, 'ltr'); assert.equal(p.node('heading').textContent, 'Your original House account'); assert.equal(p.count(), 0);
  p.send({type: 'hello'}, {}, CITY_ORIGIN); assert.equal(p.count(), 0);
  p.send({type: 'hello'}, p.peer, 'https://example.invalid'); assert.equal(p.count(), 0);
  p.send({type: 'hello'}); p.send({type: 'request', request: {id, method: 'GET', path: '/api/house'}}); assert.equal(p.count(), 0);
  await p.node('connect').onclick(); assert.equal(p.count(), 1); assert(p.messages.some(m => m.data.type === 'ready' && m.origin === CITY_ORIGIN));
  p.node('approval-problem').textContent = 'FAKE private problem / پرسش خصوصی'; p.node('approval-proposal').textContent = 'FAKE private proposal'; p.node('approval-criteria').textContent = 'FAKE private criteria';
  p.send({type: 'language', lang: 'fa'}); assert.equal(p.document.documentElement.lang, 'fa'); assert.equal(p.document.documentElement.dir, 'rtl'); assert.equal(p.node('status').textContent, 'به خانهٔ خصوصی اصلی متصل شد. این پنجره را باز نگه دارید.'); assert.equal(p.node('approval-problem').textContent, 'FAKE private problem / پرسش خصوصی'); assert.equal(p.node('approval-proposal').textContent, 'FAKE private proposal'); assert.equal(p.node('approval-criteria').textContent, 'FAKE private criteria'); assert.equal(p.count(), 1);
  p.send({type: 'language', lang: 'en'}); assert.equal(p.node('status').textContent, 'Connected to your original private House. Keep this window open.'); assert.equal(p.node('approval-problem').textContent, 'FAKE private problem / پرسش خصوصی');
  p.send({type: 'request', request: {id, method: 'GET', path: '/api/house'}}); await new Promise(resolve => setImmediate(resolve)); assert.equal(p.count(), 2);
  p.send({type: 'request', request: {id, method: 'GET', path: '/api/house'}}); await new Promise(resolve => setImmediate(resolve)); assert.equal(p.count(), 2);
  p.node('disconnect').onclick(); p.send({type: 'request', request: {id: 'd'.repeat(32), method: 'GET', path: '/api/house'}}); assert.equal(p.count(), 2);
} finally { for (const [key, descriptor] of originalGlobals) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; } }

// Client test uses a fake popup whose replies explicitly go through the same checks.
const clientListeners = new Map(); let popup, sessionNonce, openedURL; const clientMessages = [];
const fakeWindow = {location: {origin: CITY_ORIGIN, pathname: '/city-of-ideas/'}, crypto, setTimeout, clearTimeout, setInterval, clearInterval,
  addEventListener: (type, fn) => clientListeners.set(type, fn), removeEventListener: type => clientListeners.delete(type),
  open(url) { openedURL = new URL(url); sessionNonce = new URLSearchParams(openedURL.hash.slice(1)).get('nonce'); popup = {closed: false, close() { this.closed = true; }, postMessage(data, origin) { clientMessages.push({data, origin}); if (data.type === 'request') queueMicrotask(async () => { const result = await callOriginalService(data.request, fakeBackend); deliver({type: 'response', id: data.request.id, result}); }); }}; return popup; }};
function deliver(data, source = popup, origin = HOUSE_ORIGIN) { clientListeners.get('message')?.({source, origin, data: {protocol: PROTOCOL, nonce: sessionNonce, ...data}}); }
const client = createHouseServiceBridge({windowLike: fakeWindow, lang: 'fa', connectTimeoutMs: 3000, requestTimeoutMs: 3000});
await assert.rejects(client.request('/api/house'), error => error.status === 428);
client.setLanguage('en');
const connection = client.connect(); assert.equal(openedURL.pathname, '/city-bridge'); assert.equal(new URLSearchParams(openedURL.hash.slice(1)).get('lang'), 'en'); assert.equal(clientMessages.at(-1).data.lang, 'en'); deliver({type: 'ready'}, {}, HOUSE_ORIGIN); assert(!client.connected); deliver({type: 'ready'}, popup, 'https://example.invalid'); assert(!client.connected); deliver({type: 'ready', nonce: 'f'.repeat(64)}); assert(!client.connected); deliver({type: 'ready'}); await connection; assert(client.connected);
client.setLanguage('fa'); assert.equal(clientMessages.at(-1).data.type, 'language'); assert.equal(clientMessages.at(-1).data.lang, 'fa'); assert.equal(clientMessages.at(-1).data.nonce, sessionNonce); assert.equal(clientMessages.at(-1).origin, HOUSE_ORIGIN);
assert.equal((await client.request('/api/house')).revision, 1);
const save = await client.fetch('/api/house', {method: 'PUT', body: JSON.stringify({revision: 1, house: {fixture: true}}), headers: {'Content-Type': 'application/json'}}); assert(save.ok); assert.equal((await save.json()).revision, 2);
await assert.rejects(client.request('/api/house', {method: 'PUT', body: {revision: 1, house: {fixture: true}}}), error => error instanceof HouseServiceError && error.status === 409);
await assert.rejects(client.request('/api/house', {headers: {Authorization: 'do-not-forward-fixture'}}), error => error.status === 400);
client.disconnect(); assert(!client.connected); assert(popup.closed); client.destroy();
console.log('PASS: fake-only bridge smoke — canonical route/identity/consent/opener/origin/nonce gates, route/body limits, no identity injection, replay rejection, revision conflicts, private-text-safe language changes, disconnect. No live account or API requests.');
