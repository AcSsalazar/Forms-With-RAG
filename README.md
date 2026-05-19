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
### 2. Frontend Setup (React)
```bash
cd frontend
pnpm install
```

### 3. Iniciar Backend

From the main root folder (with the virtual environment activated):

```bash
python manage.py run server
```

### 4. Iniciar Frontend
From the frontend/ folder

```bash
pnpm start
```
