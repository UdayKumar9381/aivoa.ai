import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import interactions
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Auto-create tables (Legacy support, Alembic is now preferred)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="aivoa-crm API")

# 1. Add CORS Middleware (MUST be before including routers)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Health Check
@app.get("/")
def health_check():
    return {"status": "ok"}

# 3. Include Routers
app.include_router(interactions.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
