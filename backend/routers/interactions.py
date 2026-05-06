import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Interaction
from schemas import InteractionCreate, InteractionUpdate, InteractionResponse, ChatRequest, ExtractRequest
from agent import run_agent, log_interaction

router = APIRouter(
    prefix="/interactions",
    tags=["interactions"]
)

@router.post("/", response_model=InteractionResponse, status_code=status.HTTP_201_CREATED)
def create_interaction(interaction: InteractionCreate, db: Session = Depends(get_db)):
    db_interaction = Interaction(**interaction.model_dump())
    db.add(db_interaction)
    db.commit()
    db.refresh(db_interaction)
    return db_interaction

@router.get("/", response_model=List[InteractionResponse])
def get_interactions(db: Session = Depends(get_db)):
    return db.query(Interaction).all()

@router.get("/{id}", response_model=InteractionResponse)
def get_interaction(id: int, db: Session = Depends(get_db)):
    interaction = db.query(Interaction).filter(Interaction.id == id).first()
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return interaction

@router.put("/{id}", response_model=InteractionResponse)
def update_interaction(id: int, interaction_update: InteractionUpdate, db: Session = Depends(get_db)):
    db_interaction = db.query(Interaction).filter(Interaction.id == id).first()
    if not db_interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    
    update_data = interaction_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_interaction, key, value)
    
    db.commit()
    db.refresh(db_interaction)
    return db_interaction

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_interaction(id: int, db: Session = Depends(get_db)):
    interaction = db.query(Interaction).filter(Interaction.id == id).first()
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    db.delete(interaction)
    db.commit()
    return None

# --- AGENT ROUTES ---

@router.post("/agent/chat")
async def agent_chat(request: ChatRequest):
    try:
        response = await run_agent(request.message)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/agent/extract")
async def agent_extract(request: dict):
    try:
        from agent import llm
        from langchain_core.messages import HumanMessage
        
        text = request.get("text", "")
        
        prompt = f"""Extract interaction details from this text and return ONLY a valid JSON object.
No explanation, no markdown, just raw JSON.

Text: {text}

Return JSON with these exact keys:
{{
  "hcp_name": "",
  "interaction_type": "Meeting",
  "topics_discussed": "",
  "hcp_sentiment": "Neutral",
  "outcomes": "",
  "follow_up_actions": "",
  "ai_suggested_followups": ""
}}"""
        
        response = llm.invoke([HumanMessage(content=prompt)])
        text_response = response.content.strip()
        
        # Clean markdown if present
        if "```" in text_response:
            text_response = text_response.split("```")[1]
            if text_response.startswith("json"):
                text_response = text_response[4:]
        
        import json
        extracted = json.loads(text_response.strip())
        return extracted
        
    except Exception as e:
        return {
            "hcp_name": "",
            "interaction_type": "Meeting", 
            "topics_discussed": text if 'text' in locals() else "",
            "hcp_sentiment": "Neutral",
            "outcomes": "",
            "follow_up_actions": "",
            "ai_suggested_followups": f"Error: {str(e)}"
        }
