import os
import requests

MAILERSEND_API_URL = "https://api.mailersend.com/v1/email"
FROM_EMAIL = os.getenv("MAILERSEND_FROM_EMAIL", "tengnologies@wirkconsulting.com")
FROM_NAME = os.getenv("MAILERSEND_FROM_NAME", "RAG Forms")
REPLY_TO_EMAIL = os.getenv("MAILERSEND_REPLY_TO_EMAIL", FROM_EMAIL)
def send_mailersend_email(to_email, subject, text, html=None):
    headers = {
        "Authorization": f"Bearer {os.getenv('MAILERSEND_API_TOKEN')}",
        "Content-Type": "application/json",
    }

    payload = {
        "from": {"email": FROM_EMAIL, "name": FROM_NAME},
        "to": [{"email": to_email}],
        "subject": subject,
        "text": text,
        "reply_to": [{"email": REPLY_TO_EMAIL}],
    }

    if html:
        payload["html"] = html
        

    try:
        print(payload)
        response = requests.post(MAILERSEND_API_URL, json=payload, headers=headers)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"[MailerSend] Error sending email to {to_email}: {e}")
        print("MailerSend API Token: ", os.getenv("MAILERSEND_API_TOKEN"))
