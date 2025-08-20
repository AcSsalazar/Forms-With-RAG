import requests
from django.conf import settings
import logging
from typing import Optional

logger = logging.getLogger(__name__)
MAILERSEND_API_URL = "https://api.mailersend.com/v1/email"

def send_mailersend_email(to_email: str, subject: str, text: str, html: Optional[str] = None) -> bool:
    """
    Send email using MailerSend API
    
    Args:
        to_email: Recipient email address
        subject: Email subject
        text: Plain text email content
        html: Optional HTML email content
    
    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    headers = {
        "Authorization": f"Bearer {settings.MAILERSEND_API_TOKEN}",
        "Content-Type": "application/json",
    }

    payload = {
        "from": {
            "email": settings.MAILERSEND_FROM_EMAIL,
            "name": settings.MAILERSEND_FROM_NAME
        },
        "to": [{"email": to_email}],
        "subject": subject,
        "text": text,
        "reply_to": [{"email": settings.MAILERSEND_REPLY_TO_EMAIL}],
    }

    if html:
        payload["html"] = html

    try:
        response = requests.post(MAILERSEND_API_URL, json=payload, headers=headers)
        response.raise_for_status()
        
        logger.info(f"Email sent successfully to {to_email}")
        return True
        
    except requests.RequestException as e:
        # Log error without exposing API token
        logger.error(
            f"MailerSend API error sending to {to_email}: {str(e)}", 
            exc_info=True
        )
        
        # Log detailed error for debugging but mask token
        masked_token = settings.MAILERSEND_API_TOKEN[:6] + "..." if settings.MAILERSEND_API_TOKEN else "Not set"
        logger.debug(f"MailerSend API Token (masked): {masked_token}")
        
        return False
