import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Field whitelists keep arbitrary payloads out of the handler. */
const ALLOWED: Record<string, string[]> = {
  exhibit: ['company', 'contact', 'jobTitle', 'email', 'phone', 'sector', 'boothSize', 'message'],
  visitor: ['name', 'company', 'jobTitle', 'email', 'phone', 'category'],
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const MAX_LENGTH = 2000;
// Strips control characters (including newlines) from free-text input.
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/g;

function sanitise(value: unknown, max = 300): string {
  if (typeof value !== 'string') return '';
  const cleaned = value.replace(CONTROL_CHARS, ' ').trim().slice(0, max);
  return cleaned;
}

/**
 * Registration endpoint.
 *
 * Right now it validates and logs the submission, which is all that is needed
 * to bring the forms online. To connect a real backend, replace the `console.log`
 * block below with your provider — e.g. Resend / Postmark / SendGrid, a HubSpot
 * or Salesforce webhook, or a Google Apps Script / Sheets endpoint.
 */
export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  if (!payload || typeof payload !== 'object') {
    return NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 });
  }

  const body = payload as Record<string, unknown>;
  const type = body.type === 'visitor' ? 'visitor' : body.type === 'exhibit' ? 'exhibit' : null;

  if (!type) {
    return NextResponse.json({ ok: false, error: 'invalid_type' }, { status: 400 });
  }

  const rawData = (body.data ?? {}) as Record<string, unknown>;
  const submission: Record<string, string> = {};

  for (const field of ALLOWED[type]) {
    submission[field] = sanitise(rawData[field], field === 'message' ? MAX_LENGTH : 300);
  }

  const email = submission.email ?? '';
  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }

  const record = {
    type,
    locale: sanitise(body.locale, 8),
    submittedAt: typeof body.submittedAt === 'string' ? body.submittedAt : new Date().toISOString(),
    receivedAt: new Date().toISOString(),
    data: submission,
    meta: {
      userAgent: request.headers.get('user-agent')?.slice(0, 300) ?? '',
      referer: request.headers.get('referer')?.slice(0, 300) ?? '',
    },
  };

  // ---------------------------------------------------------------------------
  // TODO: forward `record` to your CRM / email / spreadsheet here.
  // ---------------------------------------------------------------------------
  console.log('[registration]', JSON.stringify(record));

  // Honeypot: bots fill hidden fields; pretend success, drop silently.
  if (submission.company.toLowerCase() === 'http://') {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true, id: `reg_${Date.now().toString(36)}` }, { status: 201 });
}

export async function GET() {
  return NextResponse.json(
    { ok: true, message: 'Registration endpoint is ready. POST an exhibit or visitor payload.' },
    { status: 200 },
  );
}