interface MagicLinkEmailProps {
  url: string;
}

export function MagicLinkEmail({ url }: MagicLinkEmailProps) {
  return (
    <html>
      <body style={{ fontFamily: "sans-serif", padding: 24 }}>
        <h1>Sign in to SaaS App</h1>
        <p>Click the link below to sign in to your account:</p>
        <a
          href={url}
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "#2563eb",
            color: "#fff",
            textDecoration: "none",
            borderRadius: 6,
            marginTop: 16,
          }}
        >
          Sign In
        </a>
        <p style={{ marginTop: 24, color: "#666" }}>
          If you didn't request this, you can safely ignore this email.
        </p>
      </body>
    </html>
  );
}