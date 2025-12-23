import nodemailer from "nodemailer";

const domain = process.env.FRONTEND_URL || "http://localhost:3000";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const emailTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Günstiger Tanken</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7f9;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7f9; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0078BE 0%, #005a8d 100%); padding: 40px 30px; text-align: center;">
              <div style="display: inline-flex; align-items: center; gap: 10px;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Günstiger Tanken</h1>
              </div>
              <p style="margin: 10px 0 0 0; color: #e0f2ff; font-size: 14px;">Jetzt günstig tanken!</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">
                © ${new Date().getFullYear()} Günstiger Tanken. Alle Rechte vorbehalten.
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/new-verification?token=${token}`;

  const content = `
    <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: 600;">
      Willkommen bei Günstiger Tanken! 🎉
    </h2>
    <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
      Vielen Dank für Ihre Registrierung! Wir freuen uns, Sie in unserer Community begrüßen zu dürfen.
    </p>
    <p style="margin: 0 0 30px 0; color: #475569; font-size: 16px; line-height: 1.6;">
      Um Ihr Konto zu aktivieren und die günstigsten Tankstellen in Ihrer Nähe zu finden, bestätigen Sie bitte Ihre E-Mail-Adresse:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${confirmLink}" style="display: inline-block; background: linear-gradient(135deg, #0078BE 0%, #005a8d 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(0, 120, 190, 0.3);">
        E-Mail bestätigen
      </a>
    </div>
    <p style="margin: 30px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
      Falls der Button nicht funktioniert, kopieren Sie bitte diesen Link in Ihren Browser:<br>
      <a href="${confirmLink}" style="color: #0078BE; word-break: break-all;">${confirmLink}</a>
    </p>
    <div style="margin-top: 30px; padding: 20px; background-color: #f1f5f9; border-radius: 8px; border-left: 4px solid #0078BE;">
      <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6;">
        <strong>💡 Tipp:</strong> Mit Günstiger Tanken sparen Sie bei jedem Tankvorgang! Vergleichen Sie Preise in Echtzeit und finden Sie die günstigste Tankstelle in Ihrer Umgebung.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Willkommen bei Günstiger Tanken - E-Mail bestätigen",
    html: emailTemplate(content),
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/reset-password?token=${token}`;

  const content = `
    <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: 600;">
      Passwort zurücksetzen 🔐
    </h2>
    <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
      Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts erhalten.
    </p>
    <p style="margin: 0 0 30px 0; color: #475569; font-size: 16px; line-height: 1.6;">
      Klicken Sie auf den Button unten, um ein neues Passwort zu erstellen:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #0078BE 0%, #005a8d 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(0, 120, 190, 0.3);">
        Passwort zurücksetzen
      </a>
    </div>
    <p style="margin: 30px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
      Falls der Button nicht funktioniert, kopieren Sie bitte diesen Link in Ihren Browser:<br>
      <a href="${resetLink}" style="color: #0078BE; word-break: break-all;">${resetLink}</a>
    </p>
    <div style="margin-top: 30px; padding: 20px; background-color: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">
      <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.6;">
        <strong>⚠️ Wichtig:</strong> Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail bitte. Ihr Passwort bleibt unverändert.
      </p>
    </div>
    <p style="margin: 20px 0 0 0; color: #64748b; font-size: 13px; line-height: 1.6;">
      Dieser Link ist aus Sicherheitsgründen nur 1 Stunde gültig.
    </p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Passwort zurücksetzen - Günstiger Tanken",
    html: emailTemplate(content),
  });
};
