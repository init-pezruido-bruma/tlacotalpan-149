export const brochureChannels = ["correo", "whatsapp"] as const;

export type BrochureChannel = (typeof brochureChannels)[number];

export type BrochureLead = {
  name: string;
  email: string;
  phone: string;
  channel: BrochureChannel;
};

export type BrochureField = keyof BrochureLead | "privacy";

export type BrochureParseResult =
  | { ok: true; honeypot: true }
  | { ok: true; honeypot: false; lead: BrochureLead }
  | {
      ok: false;
      message: string;
      fields: Partial<Record<BrochureField, string>>;
    };

const fieldMessage = "Revisa los datos e inténtalo de nuevo.";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function singleLine(value: string) {
  return value.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim();
}

export function parseBrochureRequest(input: unknown): BrochureParseResult {
  if (!input || typeof input !== "object") {
    return { ok: false, message: fieldMessage, fields: {} };
  }

  const body = input as Record<string, unknown>;
  if (text(body.company)) return { ok: true, honeypot: true };

  const fields: Partial<Record<BrochureField, string>> = {};
  const name = singleLine(text(body.name));
  const email = singleLine(text(body.email)).toLowerCase();
  const phone = singleLine(text(body.phone));
  const channel = text(body.channel);
  const privacy = body.privacy === true || body.privacy === "on";
  const phoneDigits = phone.replace(/\D/g, "");

  if (name.length < 2 || name.length > 80) {
    fields.name = "Escribe tu nombre.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
    fields.email = "Escribe un correo válido.";
  }
  if (phoneDigits.length < 10 || phoneDigits.length > 15 || phone.length > 24) {
    fields.phone = "Escribe un teléfono de 10 dígitos.";
  }
  if (channel !== "correo" && channel !== "whatsapp") {
    fields.channel = "Elige cómo quieres recibir el brochure.";
  }
  if (!privacy) {
    fields.privacy = "Confirma que leíste el aviso de privacidad.";
  }

  if (Object.keys(fields).length > 0) {
    return { ok: false, message: fieldMessage, fields };
  }

  return {
    ok: true,
    honeypot: false,
    lead: {
      name,
      email,
      phone,
      channel: channel as BrochureChannel,
    },
  };
}

export function whatsappHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const withCountry = digits.length === 10 ? `52${digits}` : digits;
  return `https://wa.me/${withCountry}`;
}

export function brochureChannelLabel(channel: BrochureChannel) {
  return channel === "whatsapp" ? "WhatsApp" : "Correo";
}

export function brochureSubject(lead: BrochureLead) {
  return `Tlacotalpan 149 · Brochure · ${lead.name} · ${brochureChannelLabel(lead.channel)}`;
}

export function brochureBody(lead: BrochureLead, brand: string) {
  const when = new Intl.DateTimeFormat("es-MX", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  }).format(new Date());

  return [
    `Nueva solicitud de brochure — ${brand}`,
    "",
    `Nombre: ${lead.name}`,
    `Correo: ${lead.email}`,
    `Teléfono: ${lead.phone}`,
    `Prefiere recibirlo por: ${brochureChannelLabel(lead.channel)}`,
    `WhatsApp: ${whatsappHref(lead.phone)}`,
    "",
    when,
  ].join("\n");
}

export function brochureMailto(to: string, lead: BrochureLead, brand: string) {
  const subject = encodeURIComponent(brochureSubject(lead));
  const body = encodeURIComponent(brochureBody(lead, brand));
  return `mailto:${to}?subject=${subject}&body=${body}`;
}
