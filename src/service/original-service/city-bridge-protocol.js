// Shared public protocol. No identity, credential or private records are bundled.
export const PROTOCOL = 'city-house-bridge-v1';
export const HOUSE_ORIGIN = 'https://house-of-ideas-online.nutmeg-ibex-4408.chatgpt.site';
export const CITY_ORIGIN = 'https://hadi1373z.github.io';
export const CITY_PATH = '/city-of-ideas/';
export const MAX_REQUEST_BYTES = 1_300_000;
export const MAX_RESPONSE_BYTES = 192 * 1024 * 1024;
export const validNonce = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
export const validRequestId = value => typeof value === 'string' && /^[a-f0-9]{32}$/.test(value);
const plain = value => value && typeof value === 'object' && !Array.isArray(value);
export function trustedMessage(event, {peer, origin, nonce}) {
  return event.source === peer && event.origin === origin && plain(event.data)
    && event.data.protocol === PROTOCOL && validNonce(nonce) && event.data.nonce === nonce;
}
export function allowedRoute(method, path) {
  if (typeof path !== 'string' || path.length > 200 || /[%\\#\s]/.test(path)) return false;
  let url; try { url = new URL(path, HOUSE_ORIGIN); } catch { return false; }
  if (url.origin !== HOUSE_ORIGIN || path !== url.pathname + url.search) return false;
  if (method === 'GET') {
    if (!url.search && ['/api/config', '/api/gpt/config', '/api/house', '/api/neighborhood', '/api/house/export', '/api/cities', '/api/conversations/file'].includes(path)) return true;
    if (!url.search && /^\/api\/improvements\/[a-f0-9-]{36}\/file$/.test(path)) return true;
    if (url.pathname !== '/api/conversations') return false;
    const keys = [...url.searchParams.keys()];
    if (keys.some(key => !['before', 'limit'].includes(key)) || new Set(keys).size !== keys.length) return false;
    const before = url.searchParams.get('before'), limit = url.searchParams.get('limit');
    return (before === null || /^[1-9][0-9]{0,15}$/.test(before) && Number.isSafeInteger(Number(before)))
      && (limit === null || /^[1-9][0-9]{0,2}$/.test(limit) && Number(limit) <= 500);
  }
  if (url.search) return false;
  if (method === 'PUT') return ['/api/house', '/api/cities'].includes(path);
  return method === 'POST' && (['/api/neighborhood/select', '/api/neighborhood/create', '/api/neighborhood/import', '/api/conversations/import', '/api/improvements'].includes(path)
    || /^\/api\/improvements\/[a-f0-9-]{36}\/approve$/.test(path));
}
export function checkedRequest(input) {
  if (!plain(input) || Object.keys(input).some(key => !['id', 'method', 'path', 'body'].includes(key))) throw Error('Unsupported bridge request.');
  if (!validRequestId(input.id) || !allowedRoute(input.method, input.path)) throw Error('Unsupported House operation.');
  if (input.method === 'GET' && input.body !== undefined) throw Error('Read requests do not take a body.');
  if (input.method !== 'GET' && !plain(input.body)) throw Error('Send the supported JSON operation.');
  const body = input.body === undefined ? undefined : JSON.stringify(input.body);
  if (body !== undefined && new TextEncoder().encode(body).byteLength > MAX_REQUEST_BYTES) throw Error('Request too large. Split conversation imports using the original importer.');
  return {id: input.id, method: input.method, path: input.path, body};
}
export async function callOriginalService(input, fetchImpl = globalThis.fetch) {
  const request = checkedRequest(input);
  const response = await fetchImpl(request.path, {method: request.method, credentials: 'same-origin', mode: 'same-origin', redirect: 'error', cache: 'no-store', referrerPolicy: 'same-origin',
    headers: request.method === 'GET' ? {Accept: 'application/json'} : {Accept: 'application/json', 'Content-Type': 'application/json', 'X-House-Request': '1'},
    ...(request.body !== undefined ? {body: request.body} : {})});
  if (!/application\/json(?:\s*;|$)/i.test(response.headers.get('content-type') || '')) {
    return {ok: false, status: response.status === 401 || response.status === 403 ? response.status : 502,
      data: {error: 'Open the original House, sign in with ChatGPT, then reconnect from City of Ideas.'}};
  }
  const declared = Number(response.headers.get('content-length') || 0);
  if (declared > MAX_RESPONSE_BYTES) throw Error('Archive exceeds the bridge transfer limit. Keep its original download.');
  const reader = response.body?.getReader();
  let data;
  if (reader) {
    const chunks = []; let size = 0;
    try {
      while (true) {
        const {done, value} = await reader.read(); if (done) break;
        size += value.byteLength;
        if (size > MAX_RESPONSE_BYTES) { await reader.cancel(); throw Error('Archive exceeds the bridge transfer limit.'); }
        chunks.push(value);
      }
      const bytes = new Uint8Array(size); let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
      data = JSON.parse(new TextDecoder('utf-8', {fatal: true}).decode(bytes));
    } finally { reader.releaseLock(); }
  } else data = await response.json();
  // Only API JSON is returned. No authentication cookies, headers or identity are exposed.
  return {ok: response.ok, status: response.status, data};
}
