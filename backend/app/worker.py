import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_otp_email(email_to: str, otp_code: str):
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("EMAIL_SENDER", "")
    smtp_password = os.getenv("EMAIL_PASSWORD", "")

    if not smtp_host or not smtp_user or not smtp_password:
        print(f"\n{'='*50}\n[WARNING] EMAIL_SENDER or EMAIL_PASSWORD not set in .env!\n[MOCK EMAIL] To: {email_to}\nSubject: EduFlow OTP Verification\nOTP Code: {otp_code}\n{'='*50}\n")
        return

    try:
        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = email_to
        msg['Subject'] = "EduFlow - Mã xác thực OTP"

        body = f"Chào bạn,\n\nMã xác thực OTP của bạn là: {otp_code}\n\nTrân trọng,\nĐội ngũ EduFlow."
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
        print(f"OTP email successfully sent to {email_to}")
    except Exception as e:
        print(f"Error sending OTP email: {e}")
