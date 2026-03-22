import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// NOTE: This in-memory rate limiter works in local dev and long-lived Node.js servers.
// On Vercel (serverless), each invocation may be a fresh instance so the map won't
// persist across requests. For production rate limiting on Vercel, use @upstash/ratelimit.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export async function POST(req: NextRequest) {
  try {
    // Origin / CSRF check
    // Supports: custom domain (NEXT_PUBLIC_SITE_URL), Vercel deployments (VERCEL_URL), host header fallback
    const origin = req.headers.get("origin");
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const vercelUrl = process.env.VERCEL_URL; // auto-set by Vercel on every deployment
    const host = req.headers.get("host");
    const isDev = process.env.NODE_ENV === "development";

    if (!isDev) {
      const originAllowed =
        (siteUrl && origin === siteUrl) ||
        (vercelUrl && origin === `https://${vercelUrl}`) ||
        (host && origin && origin === `https://${host}`);

      if (!originAllowed) {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
    }

    // Rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute." },
        { status: 429 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Email service not configured." }, { status: 503 });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Input length validation
    if (String(name).length > 100 || String(email).length > 254 || String(message).length > 5000) {
      return NextResponse.json({ error: "Input too long." }, { status: 400 });
    }

    // Server-side email format validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(String(email))) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const contactEmail = process.env.CONTACT_EMAIL;

    if (!contactEmail) {
      return NextResponse.json({ error: "Email service not configured." }, { status: 503 });
    }

    // Escape user input before inserting into HTML
    const safeName = escapeHtml(String(name));
    const safeEmail = escapeHtml(String(email));
    const safeMessage = escapeHtml(String(message));

    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [contactEmail],
      replyTo: safeEmail,
      subject: `New message from ${safeName}`,
      text: `Name: ${safeName}\nEmail: ${safeEmail}\n\nMessage:\n${safeMessage}`,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #f5f6f3; border-radius: 12px;">
          <h2 style="font-size: 20px; font-weight: 700; color: #181616; margin-bottom: 24px;">New contact form submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; font-size: 13px; color: #999; text-transform: uppercase; letter-spacing: 0.05em; width: 80px;">Name</td>
              <td style="padding: 10px 0; font-size: 15px; font-weight: 500; color: #181616;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-size: 13px; color: #999; text-transform: uppercase; letter-spacing: 0.05em;">Email</td>
              <td style="padding: 10px 0; font-size: 15px; font-weight: 500; color: #0088ff;">
                <a href="mailto:${safeEmail}" style="color: #0088ff; text-decoration: none;">${safeEmail}</a>
              </td>
            </tr>
          </table>
          <div style="margin-top: 24px; padding: 20px; background: #fff; border-radius: 10px; border: 1px solid rgba(136,136,136,0.12);">
            <p style="font-size: 13px; color: #999; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">Message</p>
            <p style="font-size: 15px; color: #181616; line-height: 1.7; white-space: pre-wrap;">${safeMessage}</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
