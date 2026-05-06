# AIVOA.AI - AI-First Pharmaceutical CRM

AIVOA.AI is a cutting-edge, AI-first Customer Relationship Management (CRM) platform specifically designed for pharmaceutical field representatives. It streamlines the process of logging and managing interactions with Healthcare Professionals (HCPs) using advanced Language Model (LLM) orchestration.

## 🚀 Key Features

*   **AI-Driven Interaction Logging**: Natural language processing to extract structured data from unstructured visit notes.
*   **3D Intelligence Dashboard**: A premium, animated real-time overview of sales performance and engagement metrics.
*   **HCP Network Management**: Comprehensive database of Healthcare Professionals with search, filtering, and segmentation.
*   **Automated Follow-up Suggestions**: AI-generated action items based on interaction outcomes.
*   **Interactive Analytics Reports**: Detailed statistical representation of sentiment trends and channel distribution.
*   **Smart Summarization**: One-click professional CRM entry generation from raw notes.

---

## 🛠 Technology Stack

### Backend (Python)
*   **FastAPI**: High-performance web framework for building APIs.
*   **SQLAlchemy**: SQL toolkit and Object Relational Mapper (ORM).
*   **MySQL**: Relational database for persistent storage of interactions and HCP data.
*   **Alembic**: Database migration tool for version-controlled schema updates.
*   **LangGraph**: Orchestration framework for stateful, multi-turn AI agent conversations.
*   **Groq (Llama 3.3 70B)**: Ultra-fast LLM used for data extraction and tool execution.

### Frontend (React)
*   **React (Functional Components)**: Modern UI library for building responsive interfaces.
*   **Redux Toolkit**: Centralized state management for synchronizing AI chat and data entry forms.
*   **Axios**: Promise-based HTTP client for API communication.
*   **React Datepicker**: Specialized component for medical interaction scheduling.
*   **Vanilla CSS**: Premium custom styling with 3D transforms and glassmorphism.

---

## 🤖 AI Agent & Tool Integration

The system utilizes a **LangGraph** agent configured with 5 specialized tools to act as an intelligent assistant:

1.  **`log_interaction`**: Extracts structured fields (Date, Sentiment, Topics) from raw text.
2.  **`edit_interaction`**: Validates and prepares updates for existing records.
3.  **`search_hcp`**: Connects to the HCP database to find specific doctor profiles.
4.  **`suggest_followups`**: Generates 3 intelligent action items following pharma sales best practices.
5.  **`summarize_interaction`**: Converts long notes into 3-5 concise, professional sentences.

---

## 📚 Terminology

*   **HCP (Healthcare Professional)**: Doctors, nurses, or clinicians that the pharma representative interacts with.
*   **Interaction**: A single touchpoint with an HCP (Meeting, Call, Email, or Conference).
*   **Sentiment**: The professional receptiveness of an HCP (Positive, Neutral, Negative).
*   **StateGraph**: The logic flow within LangGraph that decides which tool to call based on user input.

---

## 🏁 Setup Instructions

### 1. Backend Setup
1.  Navigate to `/backend`.
2.  Create and activate a virtual environment:
    ```powershell
    python -m venv venv
    .\venv\Scripts\activate
    ```
3.  Install dependencies:
    ```powershell
    pip install -r requirements.txt
    ```
4.  Configure `.env` with your `GROQ_API_KEY` and `DATABASE_URL`.
5.  Run migrations:
    ```powershell
    alembic upgrade head
    ```
6.  Start the server:
    ```powershell
    uvicorn main:app --reload
    ```

### 2. Frontend Setup
1.  Navigate to `/frontend`.
2.  Install dependencies:
    ```powershell
    npm install
    ```
3.  Start the application:
    ```powershell
    npm start
    ```

---

## 📈 Architecture Diagram
*   **Client (React)** → Dispatches actions to **Redux**.
*   **Redux** → Syncs the **Chat Interface** with the **Structured Form**.
*   **API (FastAPI)** → Routes requests to either the **MySQL DB** or the **LangGraph Agent**.
*   **Agent** → Uses **Groq LLM** to decide tool execution and return structured JSON.
