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
        msg = MIMEMultipart("alternative")
        msg['From'] = f"EduFlow Team <{smtp_user}>"
        msg['To'] = email_to
        msg['Subject'] = "EduFlow - Mã Xác Nhận OTP"

        # Phiên bản plain text dự phòng
        text_body = f"Xin chào!\n\nMã xác thực OTP của bạn là: {otp_code}\n\nMã này có hiệu lực trong vòng 5 phút.\n\nTrân trọng,\nĐội ngũ EduFlow"

        # Phiên bản HTML (giống bản localhost)
        spaced_otp = " ".join(list(otp_code))
        html_body = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
    <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#4f8cff 0%,#6366f1 100%);padding:36px 0;text-align:center;">
            <h1 style="color:#ffffff;font-size:28px;font-weight:800;margin:0;letter-spacing:1px;">EduFlow</h1>
        </div>
        
        <!-- Body -->
        <div style="padding:40px 36px;text-align:center;">
            <h2 style="color:#1e293b;font-size:20px;font-weight:700;margin:0 0 8px 0;">Xin chào! 👋</h2>
            <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 28px 0;">
                Cảm ơn bạn đã đồng hành cùng <strong>EduFlow</strong>!<br>
                Để hoàn tất xác thực tài khoản và trải nghiệm đầy đủ tính năng, vui lòng sử dụng mã OTP dưới đây:
            </p>
            
            <!-- OTP Box -->
            <div style="background:linear-gradient(135deg,#eef2ff 0%,#e0e7ff 100%);border:2px solid #c7d2fe;border-radius:16px;padding:24px;margin:0 auto 24px auto;max-width:320px;">
                <p style="color:#4338ca;font-size:36px;font-weight:900;letter-spacing:12px;margin:0;font-family:'Courier New',monospace;">{spaced_otp}</p>
            </div>
            
            <p style="color:#94a3b8;font-size:13px;margin:0 0 8px 0;">Mã này có hiệu lực trong vòng <strong style="color:#ef4444;">5 phút</strong>.</p>
            <p style="color:#cbd5e1;font-size:12px;margin:0;">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email.</p>
        </div>
        
        <!-- Footer -->
        <div style="background:#f8fafc;padding:20px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="color:#94a3b8;font-size:12px;margin:0;">© 2024 EduFlow - Hệ thống Quản lý Học tập Thông minh</p>
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
