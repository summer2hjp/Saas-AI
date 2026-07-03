import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendEmail(options: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  if (!resend) {
    console.warn("Resend not configured — skipping email send");
    return;
  }
  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "noreply@saas-app.com",
    to: options.to,
    subject: options.subject,
    react: options.react,
  });
}