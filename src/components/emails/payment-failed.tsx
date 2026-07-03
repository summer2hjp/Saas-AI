interface PaymentFailedEmailProps {
  name: string;
}

export function PaymentFailedEmail({ name }: PaymentFailedEmailProps) {
  return (
    <html>
      <body style={{ fontFamily: "sans-serif", padding: 24 }}>
        <h1>Payment Failed</h1>
        <p>Hi {name},</p>
        <p>
          Your recent payment for SaaS App has failed. Please update your billing
          information to avoid any service interruption.
        </p>
        <a
          href="https://app.saas-app.com/user/billing"
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
          Update Billing
        </a>
      </body>
    </html>
  );
}