interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <html>
      <body style={{ fontFamily: "sans-serif", padding: 24 }}>
        <h1>Welcome, {name}!</h1>
        <p>Thank you for signing up for SaaS App.</p>
        <p>Get started by exploring your dashboard and setting up your first project.</p>
        <a
          href="https://app.saas-app.com/dashboard"
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
          Go to Dashboard
        </a>
      </body>
    </html>
  );
}