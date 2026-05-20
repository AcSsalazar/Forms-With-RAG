# JustForms RAG 

JustForms is a web-based skills assessment platform designed to provide accurate, professional feedback and a clear evaluation of knowledge on specific topics. Powered by a cutting-edge Retrieval-Augmented Generation (RAG) system, it draws from hundreds of up-to-date documents and processes responses using an advanced AI model.

Users receive a unique, insightful analysis alongside a downloadable visual dashboard featuring clean, professional-grade charts for easy interpretation.

---

##  Local Installation

I have decided to share the complete source code; you only need to add your own API keys. Additionally, I provide a comprehensive guide to help you set it up while leveraging optimized model costs.

To install **JustForms RAG** in your local environment, run the following commands:

### 1. Backend Setup (Django)
From the root directory, create a virtual environment, activate it, and install the dependencies:
```bash
python -m venv .venv

# On macOS/Linux:
source .venv/bin/activate

# On Windows (Command Prompt):
# .venv\Scripts\activate

pip install -r requirements.txt

```
Create a root `.env` with at least:

```
SECRET_KEY=change-me
DEBUG=True
DATABASE_NAME=db.sqlite3
FRONTEND_URL=http://localhost:5173
CLERK_JWKS_URL=https://<your-clerk-domain>/.well-known/jwks.json
CLERK_ISSUER=https://<your-clerk-domain>
CLERK_AUDIENCE=
MAILERSEND_API_TOKEN=
MAILERSEND_FROM_EMAIL=
MAILERSEND_FROM_NAME=
MAILERSEND_REPLY_TO_EMAIL=
GITHUB_TOKEN=
```
### 2. Frontend Setup (React + Vite)
```bash
cd frontend
pnpm install
```

### 3. Iniciar Backend

From the main root folder (with the virtual environment activated):

```bash
python manage.py migrate --noinput
python manage.py runserver 0.0.0.0:8000
```

### 4. Iniciar Frontend
From the `frontend/` folder

```bash
pnpm run dev
```
