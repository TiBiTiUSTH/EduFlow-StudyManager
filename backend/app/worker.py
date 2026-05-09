import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

def send_otp_email(email_to: str, otp_code: str):
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("EMAIL_SENDER", "")
    smtp_password = os.getenv("EMAIL_PASSWORD", "")

    if not smtp_host or not smtp_user or not smtp_password:
        print(f"\n{'='*50}\n[WARNING] EMAIL_SENDER or EMAIL_PASSWORD not set in .env!\n[MOCK EMAIL] To: {email_to}\nSubject: EduFlow OTP Verification\nOTP Code: {otp_code}\n{'='*50}\n")
        return

    try:
        msg = MIMEMultipart("alternative")
        msg['From'] = f"EduFlow Team <{smtp_user}>"
        msg['To'] = email_to
        msg['Subject'] = "EduFlow - Mã Xác Nhận OTP"

        # Phiên bản plain text dự phòng
        text_body = f"Xin chào!\n\nMã xác thực OTP của bạn là: {otp_code}\n\nMã này có hiệu lực trong vòng 5 phút.\n\nTrân trọng,\nĐội ngũ EduFlow"

        # Tạo mã OTP hiển thị liền nhau dễ copy
        otp_display = ''.join([
            f'<span style="display:inline-block;padding:0 3px;font-size:32px;font-weight:900;color:#ffffff;font-family:\'Courier New\',monospace;letter-spacing:2px;">{digit}</span>'
            for digit in otp_code
        ])

        current_year = datetime.now().year

        html_body = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f0f2f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
    <div style="max-width:480px;margin:40px auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.12);">

        <!-- Header -->
        <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px 0;text-align:center;position:relative;">
            <div style="width:60px;height:60px;background:rgba(255,255,255,0.2);border-radius:16px;margin:0 auto 16px auto;display:flex;align-items:center;justify-content:center;">
                <span style="font-size:32px;">📚</span>
            </div>
            <h1 style="color:#ffffff;font-size:24px;font-weight:800;margin:0;letter-spacing:0.5px;">EduFlow</h1>
            <p style="color:rgba(255,255,255,0.8);font-size:13px;margin:8px 0 0 0;font-weight:500;">Hệ thống Quản lý Học tập Thông minh</p>
        </div>

        <!-- Body -->
        <div style="padding:40px 32px;text-align:center;">
            <h2 style="color:#1a1a2e;font-size:22px;font-weight:800;margin:0 0 8px 0;">Xác thực tài khoản</h2>
            <p style="color:#6b7280;font-size:14px;line-height:1.7;margin:0 0 32px 0;">
                Nhập mã bên dưới để hoàn tất xác thực.<br>
                Mã có hiệu lực trong <strong style="color:#ef4444;">5 phút</strong>.
            </p>

            <!-- OTP Code - hiển thị liền để dễ copy -->
            <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:16px;padding:16px 24px;display:inline-block;margin:0 auto 32px auto;box-shadow:0 8px 24px rgba(102,126,234,0.35);">
                {otp_display}
            </div>

            <div style="background:#f8f9fc;border-radius:12px;padding:16px 20px;margin:0 auto;max-width:360px;">
                <p style="color:#9ca3af;font-size:12px;line-height:1.6;margin:0;">
                    ⚠️ Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.<br>
                    Không chia sẻ mã OTP với bất kỳ ai.
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div style="background:#f8f9fc;padding:24px 32px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="color:#9ca3af;font-size:11px;margin:0 0 4px 0;">© {current_year} EduFlow - Hệ thống Quản lý Học tập Thông minh</p>
            <p style="color:#d1d5db;font-size:10px;margin:0;">Email này được gửi tự động, vui lòng không trả lời.</p>
        </div>
    </div>
</body>
</html>"""

        msg.attach(MIMEText(text_body, 'plain', 'utf-8'))
        msg.attach(MIMEText(html_body, 'html', 'utf-8'))

        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
        print(f"OTP email successfully sent to {email_to}")
    except Exception as e:
        print(f"Error sending OTP email: {e}")
