import me from "@/lib/startup-week/handlers/me";
import students from "@/lib/startup-week/handlers/students";
import companies from "@/lib/startup-week/handlers/companies";
import profile from "@/lib/startup-week/handlers/companies-company";
import preferences from "@/lib/startup-week/handlers/companies-company-preferences";
import recommended from "@/lib/startup-week/handlers/companies-company-recommended";
import recommendations from "@/lib/startup-week/handlers/recommendations";
import auto from "@/lib/startup-week/handlers/recommendations-auto";
import run from "@/lib/startup-week/handlers/matches-run";
import notify from "@/lib/startup-week/handlers/matches-notify";
import webhook from "@/lib/startup-week/handlers/tally-webhook";
import { ConfigurationError } from "@/lib/startup-week/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Adapt the migrated business handlers to App Router without weakening their
// server-side admin/company/signature checks. Nothing is added to public nav.
const routes = [
  [/^me$/, ["GET"], me],
  [/^students$/, ["GET"], students],
  [/^companies$/, ["GET"], companies],
  [/^companies\/([^/]+)$/, ["POST"], profile],
  [/^companies\/([^/]+)\/preferences$/, ["GET", "POST"], preferences],
  [/^companies\/([^/]+)\/recommended$/, ["GET"], recommended],
  [/^recommendations$/, ["GET", "POST"], recommendations],
  [/^recommendations\/auto$/, ["POST"], auto],
  [/^matches\/run$/, ["POST"], run],
  [/^matches\/notify$/, ["POST"], notify],
  [/^tally\/webhook$/, ["POST"], webhook],
];
const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };
const json = (body, status, extra = {}) => Response.json(body, { status, headers: { ...headers, ...extra } });

async function dispatch(request, context) {
  const { path } = await context.params;
  const pathname = path.join("/");
  const route = routes.find(([pattern]) => pattern.test(pathname));
  if (!route) return json({ error: "Not found" }, 404);
  const [pattern, methods, handler] = route;
  if (!methods.includes(request.method)) return json({ error: "Method not allowed" }, 405, { Allow: methods.join(", ") });

  let body;
  let rawBody = "";
  if (request.method === "POST") {
    // Bound input before JSON parsing, including chunked requests.
    const reader = request.body?.getReader();
    const chunks = [];
    let size = 0;
    if (reader) {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 1024 * 1024) {
          await reader.cancel();
          return json({ error: "Request body too large" }, 413);
        }
        chunks.push(Buffer.from(value));
      }
    }
    rawBody = Buffer.concat(chunks).toString("utf8");
    try { body = rawBody ? JSON.parse(rawBody) : {}; }
    catch { return json({ error: "Invalid JSON" }, 400); }
  }

  let status = 200;
  const res = {
    status(code) { status = code; return this; },
    json(value) { return json(value, status); },
  };
  try {
    return await handler({
      method: request.method,
      headers: Object.fromEntries(request.headers),
      query: { slug: pathname.match(pattern)?.[1] },
      body, rawBody,
    }, res);
  } catch (error) {
    if (error instanceof ConfigurationError) return json({ error: error.message }, 503);
    console.error("[startup-week] Request failed", pathname);
    return json({ error: "Startup Week request failed. Please try again." }, 500);
  }
}

export { dispatch as GET, dispatch as POST, dispatch as PUT, dispatch as PATCH, dispatch as DELETE };
