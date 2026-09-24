import { Resend } from "resend";
import { siteConfig } from "@/lib/data";

export interface ContactEmailPayload {
  name: string;
  phone: string;
  email: string;
  message: string;
  propertyRef?: string;
  source?: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

function getFromAddress(): string {
  return (
    process.env.RESEND_FROM?.trim() ??
    `${siteConfig.name} <onboarding@resend.dev>`
  );
}

function getContactRecipient(): string {
  return process.env.CONTACT_TO?.trim() ?? siteConfig.email;
}

export async function sendContactEmail(payload: ContactEmailPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Resend no configurado");
  }

  const resend = new Resend(apiKey);
  const subject = payload.propertyRef
    ? `Consulta inmueble ${payload.propertyRef} — ${payload.name}`
    : `Nueva consulta web — ${payload.name}`;

  const textLines = [
    `Nombre: ${payload.name}`,
    `Teléfono: ${payload.phone}`,
    `Email: ${payload.email}`,
    payload.propertyRef ? `Inmueble: ${payload.propertyRef}` : null,
    payload.source ? `Origen: ${payload.source}` : null,
    "",
    "Mensaje:",
    payload.message,
  ].filter(Boolean);

  const htmlRows = [
    `<tr><td style="padding:4px 12px 4px 0;font-weight:600;">Nombre</td><td>${escapeHtml(payload.name)}</td></tr>`,
    `<tr><td style="padding:4px 12px 4px 0;font-weight:600;">Teléfono</td><td>${escapeHtml(payload.phone)}</td></tr>`,
    `<tr><td style="padding:4px 12px 4px 0;font-weight:600;">Email</td><td><a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a></td></tr>`,
    payload.propertyRef
      ? `<tr><td style="padding:4px 12px 4px 0;font-weight:600;">Inmueble</td><td>${escapeHtml(payload.propertyRef)}</td></tr>`
      : "",
    payload.source
      ? `<tr><td style="padding:4px 12px 4px 0;font-weight:600;">Origen</td><td>${escapeHtml(payload.source)}</td></tr>`
      : "",
  ]
    .filter(Boolean)
    .join("");

  const html = `
    <div style="font-family:system-ui,sans-serif;color:#1a1a1a;line-height:1.5;">
      <p style="margin:0 0 16px;">Nueva solicitud desde la web de ${escapeHtml(siteConfig.name)}.</p>
      <table style="border-collapse:collapse;margin:0 0 16px;">${htmlRows}</table>
      <p style="margin:0 0 8px;font-weight:600;">Mensaje</p>
      <p style="margin:0;white-space:pre-wrap;">${escapeHtml(payload.message)}</p>
    </div>
  `.trim();

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: [getContactRecipient()],
    replyTo: payload.email,
    subject,
    text: textLines.join("\n"),
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
}
