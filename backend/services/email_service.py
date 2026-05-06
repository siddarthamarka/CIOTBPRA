import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
from datetime import datetime
from config.settings import settings

# ── Recommendation map ────────────────────────────────────
RECOMMENDATIONS = {
    "Alert":     "Reduce salt intake, avoid processed foods, and exercise regularly.",
    "Warning":   "Monitor BP daily, reduce stress, consult a doctor within 48 hours.",
    "Emergency": "Immediate hospitalization required. Do not delay.",
}

RISK_COLOR = {
    "Alert":     "#FF6600",
    "Warning":   "#FF0000",
    "Emergency": "#8B0000",
}

# ── HTML Email Template ───────────────────────────────────
def _build_html(name: str, age, gender: str,
                sbp: int, dbp: int, hr: int,
                risk: str, timestamp: str) -> str:

    recommendation = RECOMMENDATIONS.get(risk, "Please consult a medical professional.")
    risk_color     = RISK_COLOR.get(risk, "#FF0000")

    return f"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>BP Alert — CIOT-BPRA</title>
</head>
<body style="margin:0;padding:0;background-color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0"
         style="background-color:#FFFFFF;padding:32px 16px;">
    <tr>
      <td align="center">

        <!-- ── Card ── -->
        <table width="600" cellpadding="0" cellspacing="0"
               style="background-color:#FFFFFF;border-radius:12px;
                      border:1px solid #FF0000;overflow:hidden;
                      box-shadow:0 0 24px rgba(255,0,0,0.15);">

          <!-- ── Header ── -->
          <tr>
            <td style="background-color:#FFFFFF;padding:28px 32px;
                       border-bottom:2px solid #FF0000;text-align:center;">
              <img src="cid:logo" alt="CIOT-BPRA Logo"
                   width="80" height="80"
                   style="border-radius:10px;display:block;margin:0 auto 14px;"/>
              <h1 style="margin:0;color:#000000;font-size:20px;
                         letter-spacing:0.1em;font-weight:800;">
                CIOT-BPRA
              </h1>
              <p style="margin:4px 0 0;color:#FF0000;font-size:12px;
                        letter-spacing:0.08em;text-transform:uppercase;
                        font-weight:600;">
                Health Monitoring System
              </p>
            </td>
          </tr>

          <!-- ── Risk Banner ── -->
          <tr>
            <td style="background-color:{risk_color};padding:16px 32px;text-align:center;">
              <p style="margin:0;color:#FFFFFF;font-size:18px;
                        font-weight:800;letter-spacing:0.06em;
                        text-transform:uppercase;">
                ⚠ {risk} CONDITION DETECTED
              </p>
            </td>
          </tr>

          <!-- ── Body ── -->
          <tr>
            <td style="padding:32px;background-color:#FFFFFF;">

              <!-- Readings -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="margin-bottom:24px;">
                <tr>
                  <td style="color:#FF0000;font-size:11px;font-weight:700;
                             text-transform:uppercase;letter-spacing:0.08em;
                             padding-bottom:10px;">
                    BP Readings
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="8">
                      <tr>
                        <!-- SBP -->
                        <td width="32%" align="center"
                            style="background-color:#F5F5F5;border:1px solid #FF0000;
                                   border-radius:8px;padding:16px 8px;">
                          <p style="margin:0;color:#FF0000;font-size:11px;
                                    font-weight:700;text-transform:uppercase;
                                    letter-spacing:0.06em;">SBP</p>
                          <p style="margin:6px 0 0;color:#000000;font-size:28px;
                                    font-weight:800;font-family:monospace;">
                            {sbp}
                          </p>
                          <p style="margin:2px 0 0;color:#666666;font-size:11px;">
                            mmHg
                          </p>
                        </td>
                        <td width="4%"></td>
                        <!-- DBP -->
                        <td width="32%" align="center"
                            style="background-color:#F5F5F5;border:1px solid #FF0000;
                                   border-radius:8px;padding:16px 8px;">
                          <p style="margin:0;color:#FF0000;font-size:11px;
                                    font-weight:700;text-transform:uppercase;
                                    letter-spacing:0.06em;">DBP</p>
                          <p style="margin:6px 0 0;color:#000000;font-size:28px;
                                    font-weight:800;font-family:monospace;">
                            {dbp}
                          </p>
                          <p style="margin:2px 0 0;color:#666666;font-size:11px;">
                            mmHg
                          </p>
                        </td>
                        <td width="4%"></td>
                        <!-- HR -->
                        <td width="32%" align="center"
                            style="background-color:#F5F5F5;border:1px solid #FF0000;
                                   border-radius:8px;padding:16px 8px;">
                          <p style="margin:0;color:#FF0000;font-size:11px;
                                    font-weight:700;text-transform:uppercase;
                                    letter-spacing:0.06em;">HR</p>
                          <p style="margin:6px 0 0;color:#000000;font-size:28px;
                                    font-weight:800;font-family:monospace;">
                            {hr}
                          </p>
                          <p style="margin:2px 0 0;color:#666666;font-size:11px;">
                            bpm
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Recommendation -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="margin-bottom:24px;">
                <tr>
                  <td style="color:#FF0000;font-size:11px;font-weight:700;
                             text-transform:uppercase;letter-spacing:0.08em;
                             padding-bottom:10px;">
                    Recommendation
                  </td>
                </tr>
                <tr>
                  <td style="background-color:#F5F5F5;border-left:3px solid #FF0000;
                             border-radius:0 8px 8px 0;padding:14px 18px;">
                    <p style="margin:0;color:#000000;font-size:14px;line-height:1.6;">
                      {recommendation}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Timestamp -->
              <p style="margin:0;color:#888888;font-size:11px;
                        font-family:monospace;text-align:right;">
                Recorded: {timestamp}
              </p>

            </td>
          </tr>

          <!-- ── Footer ── -->
          <tr>
            <td style="background-color:#F5F5F5;border-top:1px solid #E0E0E0;
                       padding:20px 32px;text-align:center;">
              <p style="margin:0 0 4px;color:#000000;font-size:13px;font-weight:700;">
                CIOT-BPRA Health Monitoring System
              </p>
              <p style="margin:0 0 4px;color:#FF0000;font-size:12px;">
                ciotbpra@gmail.com
              </p>
              <p style="margin:12px 0 0;color:#888888;font-size:11px;line-height:1.5;">
                This is an automated alert. Do not ignore abnormal readings.<br/>
                IoT-Based Blood Pressure Risk Analysis System.
              </p>
            </td>
          </tr>

        </table>
        <!-- end card -->

      </td>
    </tr>
  </table>

</body>
</html>
"""

# ── Send Function ─────────────────────────────────────────
def send_email_alert(email: str, name: str, age, gender: str,
                     sbp: int, dbp: int, hr: int, risk: str) -> None:
    try:
        risk = risk.strip().capitalize()
        if risk == "Normal":
            return

        timestamp  = datetime.now().strftime("%d-%m-%Y %H:%M:%S")
        logo_path  = os.path.join(settings.BASE_DIR, "assets", "CIOTBPRALogo.png")
        html_body  = _build_html(name, age, gender, sbp, dbp, hr, risk, timestamp)

        msg                  = MIMEMultipart("related")
        msg["Subject"]       = f"🚨 BP Alert — {risk} | CIOT-BPRA"
        msg["From"]          = settings.EMAIL_USER
        msg["To"]            = email

        alternative          = MIMEMultipart("alternative")
        msg.attach(alternative)
        alternative.attach(MIMEText(html_body, "html"))

        # Attach logo as inline CID
        if os.path.exists(logo_path):
            with open(logo_path, "rb") as f:
                img = MIMEImage(f.read())
                img.add_header("Content-ID", "<logo>")
                img.add_header("Content-Disposition", "inline", filename="logo.png")
                msg.attach(img)
        else:
            print(f"⚠ Logo not found at: {logo_path}")

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.EMAIL_USER, settings.EMAIL_PASS)
            server.sendmail(settings.EMAIL_USER, email, msg.as_string())

        print(f"✅ Email sent to {email} — Risk: {risk}")

    except smtplib.SMTPAuthenticationError:
        print("❌ Email auth failed — check EMAIL_USER and EMAIL_PASS in .env")
    except smtplib.SMTPException as e:
        print(f"❌ SMTP Error: {e}")
    except Exception as e:
        print(f"❌ Email Error: {e}")