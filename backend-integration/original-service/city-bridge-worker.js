// Install in the ORIGINAL House service alongside its existing Worker.
// Keep the original Worker, DB binding, audience and identity boundary intact.
const routes = new Set(['/city-bridge', '/city-bridge.html', '/city-bridge.js', '/city-bridge.css', '/city-bridge-protocol.js']);
export function withCityBridge(originalWorker) {
  return {async fetch(request, env, context) {
    const url = new URL(request.url);
    if (!routes.has(url.pathname)) return originalWorker.fetch(request, env, context);
    if (!['GET', 'HEAD'].includes(request.method) || url.search) return new Response('Not found.', {status: 404});
    const user = request.headers.get('oai-authenticated-user-id');
    if (!user || user.length > 256 || /[\u0000-\u001f]/.test(user)) return new Response('Sign in at the original House, then reopen the city connection.', {status: 401, headers: {'Cache-Control': 'no-store'}});
    const asset = await env.ASSETS.fetch(request);
    const response = new Response(asset.body, asset);
    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('Referrer-Policy', 'no-referrer');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Content-Security-Policy', "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'");
    // A cross-origin popup needs its opener. This is scoped only to the bridge assets.
    // A dispatch-enforced COOP override can still sever the opener; test live after deployment.
    response.headers.set('Cross-Origin-Opener-Policy', 'unsafe-none');
    return response;
  }};
}
