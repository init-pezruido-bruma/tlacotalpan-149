import { NextResponse } from "next/server";
import { brochureDelivery, contactEmail, site } from "../../../content";
import {
  brochureBody,
  brochureSubject,
  parseBrochureRequest,
} from "../../../lib/brochureRequest";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const buckets = new Map<string, { count: number; resetAt: number }>();

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

function allowed(ip: string) {
  const now = Date.now();
  if (buckets.size > 1000) {
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt < now) buckets.delete(key);
    }
  }

  const bucket = buckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (bucket.count >= MAX_REQUESTS) return false;
  bucket.count += 1;
  return true;
}

export async function POST(request: Request) {
  if (brochureDelivery !== "resend") {
    return NextResponse.json(
      { ok: false, message: "La solicitud se envía desde tu correo." },
      { status: 409 },
    );
  }

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 10_000) {
    return NextResponse.json(
      { ok: false, message: "La solicitud es demasiado grande." },
      { status: 413 },
    );
  }

  if (!allowed(clientIp(request))) {
    return NextResponse.json(
      {
        ok: false,
        message: "Recibimos varios intentos. Espera unos minutos y vuelve a intentar.",
      },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "No pudimos leer la solicitud." },
      { status: 400 },
    );
  }

  const parsed = parseBrochureRequest(payload);
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, message: parsed.message, fields: parsed.fields },
      { status: 400 },
    );
  }
  if (parsed.honeypot) return NextResponse.json({ ok: true });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BROCHURE_FROM;
  const to = process.env.BROCHURE_TO || contactEmail;

  if (!apiKey || !from) {
    console.error(
      "Falta RESEND_API_KEY o BROCHURE_FROM. La solicitud de brochure no se envió.",
    );
    const message =
      process.env.NODE_ENV === "development"
        ? "Falta configurar RESEND_API_KEY y BROCHURE_FROM en .env.local."
        : "No pudimos enviar la solicitud. Inténtalo de nuevo en un momento.";
    return NextResponse.json({ ok: false, message }, { status: 503 });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: parsed.lead.email,
      subject: brochureSubject(parsed.lead),
      text: brochureBody(parsed.lead, site.brand),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Resend rechazó la solicitud de brochure.", response.status, detail);
    return NextResponse.json(
      {
        ok: false,
        message: "No pudimos enviar la solicitud. Inténtalo de nuevo en un momento.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
