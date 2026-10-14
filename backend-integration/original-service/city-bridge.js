import {PROTOCOL, HOUSE_ORIGIN, CITY_ORIGIN, trustedMessage, validNonce, checkedRequest, callOriginalService} from './city-bridge-protocol.js';
const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.hash.slice(1));
const nonce = params.get('nonce'), peer = window.opener;
let language = params.get('lang') === 'fa' ? 'fa' : 'en', statusKey = 'waiting';
const publicLabels = {
  heading: ['Your original House account', 'حساب اصلی خانهٔ ایده‌ها'],
  explanation: ['Connect this City of Ideas window to your existing private House service. Your homes, conversations and decisions remain in the original account. The city can read them and submit your saves through this connection; account credentials stay on this site.', 'این پنجرهٔ شهر ایده‌ها را به سرویس خصوصی خانهٔ موجود وصل کنید. خانه‌ها، گفتگوها و تصمیم‌ها در حساب اصلی می‌مانند. شهر می‌تواند آن‌ها را بخواند و ذخیره‌های شما را از همین اتصال ارسال کند؛ اطلاعات ورود در این سایت باقی می‌ماند.'],
  connect: ['Connect this city session', 'اتصال این جلسهٔ شهر'],
  disconnect: ['Disconnect', 'قطع اتصال'],
  house: ['Open the original House / sign in', 'باز کردن خانهٔ اصلی / ورود'],
  'session-note': ['Keep this window open while connected. Closing it ends access. Nothing is copied into a public repository or uploaded to GitHub by this bridge.', 'در زمان اتصال این پنجره را باز نگه دارید. بستن آن دسترسی را پایان می‌دهد. این واسط هیچ داده‌ای را در مخزن عمومی یا گیت‌هاب بارگذاری نمی‌کند.'],
  'approval-title': ['Review development approval', 'بررسی تأیید طرح توسعه'],
  approve: ['Approve this saved brief', 'تأیید این طرح ذخیره‌شده'],
  decline: ['Keep it as a draft', 'حفظ به‌صورت پیش‌نویس']
};
const publicStatuses = {
  waiting: ['Waiting for the city window.', 'در انتظار پنجرهٔ شهر.'],
  openFromCity: ['Open this connection using the button in City of Ideas. No account requests were made.', 'این اتصال را با دکمهٔ شهر ایده‌ها باز کنید. هیچ درخواستی به حساب ارسال نشده است.'],
  consent: ['Choose Connect to grant this city session access to your original House account.', 'برای دسترسی این جلسهٔ شهر به حساب اصلی خانه، اتصال را انتخاب کنید.'],
  checking: ['Checking the original signed-in House service…', 'در حال بررسی سرویس اصلی و ورود حساب…'],
  connected: ['Connected to your original private House. Keep this window open.', 'به خانهٔ خصوصی اصلی متصل شد. این پنجره را باز نگه دارید.'],
  accountNotReady: ['The original account is not ready. Open the House, sign in, then reopen the city connection.', 'حساب اصلی آماده نیست. خانه را باز کنید، وارد شوید و اتصال شهر را دوباره باز کنید.'],
  disconnected: ['Disconnected. Your saved records remain in the original House.', 'اتصال قطع شد. داده‌های ذخیره‌شده در خانهٔ اصلی باقی می‌مانند.']
};
function renderLanguage() {
  const index = language === 'fa' ? 1 : 0;
  document.documentElement.lang = language; document.documentElement.dir = index ? 'rtl' : 'ltr';
  document.title = index ? 'اتصال شهر ایده‌ها به خانهٔ اصلی' : 'Connect City of Ideas to your House';
  for (const [id, labels] of Object.entries(publicLabels)) $(id).textContent = labels[index];
  $('status').textContent = publicStatuses[statusKey][index];
  // Deliberately exclude approval-problem/proposal/criteria: those are private authored strings.
}
function setLanguage(value) { if (value !== 'fa' && value !== 'en') return; language = value; renderLanguage(); }
const status = key => { statusKey = key; renderLanguage(); };
renderLanguage();
let active = false, hello = false, busy = false, dead = false, pending = 0;
const seen = new Set();
const post = payload => peer?.postMessage({protocol: PROTOCOL, nonce, ...payload}, CITY_ORIGIN);
function end() { active = false; dead = true; $('connect').disabled = true; $('disconnect').hidden = true; post({type: 'disconnected'}); status('disconnected'); }
// The nonce is session-bound, kept in memory, and removed from local address/history.
history.replaceState(null, '', location.pathname);
$('origin').textContent = CITY_ORIGIN;
if (location.origin !== HOUSE_ORIGIN || !peer || !validNonce(nonce)) {
  status('openFromCity'); dead = true;
}
async function reviewApproval(path) {
  const id = path.split('/')[3];
  const archive = await callOriginalService({id: crypto.randomUUID().replaceAll('-', ''), method: 'GET', path: '/api/conversations?limit=1'});
  if (!archive.ok) throw Error(archive.data?.error || 'Could not load the saved brief.');
  const brief = archive.data.briefs?.find(value => value.id === id);
  if (!brief) throw Error('The saved development brief was not found.');
  if (brief.status === 'approved') return true;
  $('approval-problem').textContent = brief.problem; $('approval-proposal').textContent = brief.proposal; $('approval-criteria').textContent = brief.criteria;
  $('approval').hidden = false;
  return new Promise(resolve => {
    const finish = answer => { $('approval').hidden = true; $('approve').onclick = $('decline').onclick = null; resolve(answer && active && !dead); };
    $('approve').onclick = () => finish(true); $('decline').onclick = () => finish(false);
    // Disconnect must resolve the review without committing any approval.
    approvalCancel = () => finish(false);
  });
}
let approvalCancel = null;
let tail = Promise.resolve();
window.addEventListener('message', event => {
  if (dead || !trustedMessage(event, {peer, origin: CITY_ORIGIN, nonce})) return;
  const data = event.data;
  if (data.type === 'language') { setLanguage(data.lang); return; }
  if (data.type === 'hello') { setLanguage(data.lang); hello = true; if (!active) { $('connect').disabled = busy; status(busy ? 'checking' : 'consent'); } else post({type: 'ready'}); return; }
  if (data.type === 'disconnect') { approvalCancel?.(); end(); return; }
  if (data.type !== 'request' || !active) return;
  let request;
  try { request = checkedRequest(data.request); if (seen.has(request.id) || seen.size >= 5000 || pending >= 20) throw Error('Duplicate request or session limit. Reconnect and reload saved state.'); }
  catch (error) { post({type: 'response', id: data.request?.id, result: {ok: false, status: 400, data: {error: error.message}}}); return; }
  seen.add(request.id); pending++;
  tail = tail.then(async () => {
    if (!active || dead) return;
    let result;
    try {
      if (/\/improvements\/[a-f0-9-]{36}\/approve$/.test(request.path) && !(await reviewApproval(request.path))) result = {ok: false, status: 409, data: {error: 'Approval was not recorded. The brief remains a draft.'}};
      else result = await callOriginalService(data.request);
    } catch { result = {ok: false, status: 503, data: {error: 'The original service could not complete this request. Reload saved state before retrying a save.', outcomeUnknown: request.method !== 'GET'}}; }
    finally { pending--; approvalCancel = null; }
    if (active && !dead) post({type: 'response', id: request.id, result});
  });
});
$('connect').onclick = async () => {
  if (dead || !hello || busy) return; busy = true; $('connect').disabled = true;
  status('checking');
  try {
    const result = await callOriginalService({id: crypto.randomUUID().replaceAll('-', ''), method: 'GET', path: '/api/config'});
    if (dead) return;
    if (!result.ok || result.data.mode !== 'online' || result.data.storage !== 'private-cloud') throw Error('Sign in at the original House, then reconnect from the city.');
    active = true; $('connect').hidden = true; $('disconnect').hidden = false; post({type: 'ready', capabilities: result.data.capabilities});
    status('connected');
  } catch { status('accountNotReady'); }
  finally { busy = false; if (!active && !dead) $('connect').disabled = false; }
};
$('disconnect').onclick = () => { approvalCancel?.(); end(); };
window.addEventListener('pagehide', () => { active = false; post({type: 'disconnected'}); });
