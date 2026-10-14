import {PROTOCOL, HOUSE_ORIGIN, CITY_ORIGIN, CITY_PATH, trustedMessage, checkedRequest} from './original-service/city-bridge-protocol.js';

export class HouseServiceError extends Error {
  constructor(message, {status = 503, outcomeUnknown = false} = {}) { super(message); this.name = 'HouseServiceError'; this.status = status; this.outcomeUnknown = outcomeUnknown; }
}
export function createHouseServiceBridge({windowLike = window, lang = 'en', onStatus = () => {}, connectTimeoutMs = 120000, requestTimeoutMs = 60000} = {}) {
  const w = windowLike, pending = new Map();
  let language = lang === 'fa' ? 'fa' : 'en';
  let peer = null, nonce = null, active = false, connecting = null, connectResolve = null, connectReject = null, helloTimer = null, connectTimer = null, closeTimer = null;
  const random = bytes => [...w.crypto.getRandomValues(new Uint8Array(bytes))].map(value => value.toString(16).padStart(2, '0')).join('');
  const post = payload => peer?.postMessage({protocol: PROTOCOL, nonce, ...payload}, HOUSE_ORIGIN);
  function timers() { for (const timer of [helloTimer, connectTimer, closeTimer]) { w.clearTimeout(timer); w.clearInterval(timer); } helloTimer = connectTimer = closeTimer = null; }
  function stop(message, close = true) {
    const error = new HouseServiceError(message);
    active = false; timers(); connectReject?.(error); connectReject = connectResolve = null; connecting = null;
    for (const item of pending.values()) { w.clearTimeout(item.timer); item.reject(new HouseServiceError(message, {outcomeUnknown: item.method !== 'GET'})); }
    pending.clear(); if (close) { try { peer?.close(); } catch {} } peer = null; nonce = null; onStatus({connected: false, message});
  }
  const listener = event => {
    if (!peer || !trustedMessage(event, {peer, origin: HOUSE_ORIGIN, nonce})) return;
    const data = event.data;
    if (data.type === 'disconnected') { stop('The original House connection ended. Saved records remain there.'); return; }
    if (data.type === 'ready' && connecting) {
      active = true; w.clearTimeout(connectTimer); w.clearInterval(helloTimer); connectTimer = helloTimer = null;
      const resolve = connectResolve; connecting = null; connectResolve = connectReject = null;
      onStatus({connected: true, message: 'Connected to the original private House.'}); resolve?.({connected: true, capabilities: data.capabilities || {}}); return;
    }
    if (data.type === 'response') {
      const item = pending.get(data.id); if (!item) return;
      const result = data.result;
      if (!result || typeof result.ok !== 'boolean' || !Number.isInteger(result.status) || result.status < 100 || result.status > 599 || !Object.hasOwn(result, 'data')) return;
      pending.delete(data.id); w.clearTimeout(item.timer); item.resolve(result);
    }
  };
  w.addEventListener('message', listener);
  function connect() {
    if (w.location.origin !== CITY_ORIGIN || !w.location.pathname.startsWith(CITY_PATH)) return Promise.reject(new HouseServiceError('Open the published City of Ideas to connect to this original service.', {status: 403}));
    if (active) return Promise.resolve({connected: true}); if (connecting) return connecting;
    nonce = random(32);
    const url = `${HOUSE_ORIGIN}/city-bridge#nonce=${nonce}&lang=${language}`;
    // Must be called directly by the user's Connect button. Do not use noopener: the authenticated peer is checked for every message.
    peer = w.open(url, '_blank', 'popup,width=720,height=780');
    if (!peer) { nonce = null; return Promise.reject(new HouseServiceError('Allow the original House connection window, then choose Connect again.', {status: 428})); }
    connecting = new Promise((resolve, reject) => { connectResolve = resolve; connectReject = reject; });
    post({type: 'hello', lang: language}); helloTimer = w.setInterval(() => post({type: 'hello', lang: language}), 750);
    connectTimer = w.setTimeout(() => stop('Connection was not approved or sign-in was interrupted. Sign in at the original House, then reconnect.'), connectTimeoutMs);
    closeTimer = w.setInterval(() => { try { if (peer?.closed) stop('The original House connection window closed.'); } catch { stop('The browser separated the sign-in window. Reconnect after signing in.'); } }, 750);
    onStatus({connected: false, connecting: true, message: 'Approve Connect in the original House window.'}); return connecting;
  }
  async function response(path, options = {}) {
    if (!active || !peer) throw new HouseServiceError('Connect your original House account before using cloud data.', {status: 428});
    if (Object.keys(options).some(key => !['method', 'body', 'headers'].includes(key))) throw new HouseServiceError('Unsupported House request options.', {status: 400});
    for (const key of Object.keys(options.headers || {})) if (!['content-type', 'accept', 'x-house-request'].includes(key.toLowerCase())) throw new HouseServiceError('Do not send identity, credentials or custom headers to the bridge.', {status: 400});
    const method = String(options.method || 'GET').toUpperCase();
    let body = options.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { throw new HouseServiceError('Send valid House JSON.', {status: 400}); } }
    const input = {id: random(16), method, path, ...(body === undefined ? {} : {body})};
    try { checkedRequest(input); } catch (error) { throw new HouseServiceError(error.message, {status: 400}); }
    return new Promise((resolve, reject) => {
      const timer = w.setTimeout(() => { pending.delete(input.id); reject(new HouseServiceError('The response was not confirmed. Reload saved House state before retrying.', {status: 504, outcomeUnknown: method !== 'GET'})); }, requestTimeoutMs);
      pending.set(input.id, {resolve, reject, timer, method}); post({type: 'request', request: input});
    });
  }
  async function request(path, options) {
    const result = await response(path, options);
    if (!result.ok) throw new HouseServiceError(result.data?.error || 'The original House request failed.', {status: result.status, outcomeUnknown: Boolean(result.data?.outcomeUnknown)});
    return result.data;
  }
  return {
    connect, request, get connected() { return active; },
    setLanguage(value) { language = value === 'fa' ? 'fa' : 'en'; if (peer) post({type: 'language', lang: language}); },
    async fetch(path, options) { const result = await response(path, options); return {ok: result.ok, status: result.status, json: async () => structuredClone(result.data)}; },
    async download(path, filename) { const data = await request(path); const blob = new w.Blob([JSON.stringify(data, null, 2)], {type: 'application/json'}); const url = w.URL.createObjectURL(blob); const a = w.document.createElement('a'); a.href = url; a.download = filename; a.click(); w.setTimeout(() => w.URL.revokeObjectURL(url), 1000); },
    disconnect() { post({type: 'disconnect'}); stop('Disconnected from the original House.'); },
    destroy() { post({type: 'disconnect'}); stop('Original House connection ended.'); w.removeEventListener('message', listener); }
  };
}
