from pydantic import BaseModel, ConfigDict, field_validator
from datetime import date, datetime
from typing import Optional

class InteractionBase(BaseModel):
    hcp_name: str
    interaction_type: Optional[str] = "Meeting"
    date: Optional[str] = None
    time: Optional[str] = None
    attendees: Optional[str] = ""
    topics_discussed: Optional[str] = ""
    materials_shared: Optional[str] = ""
    samples_distributed: Optional[str] = ""
    hcp_sentiment: Optional[str] = "Neutral"
    outcomes: Optional[str] = ""
    follow_up_actions: Optional[str] = ""
    ai_suggested_followups: Optional[str] = ""

class InteractionCreate(InteractionBase):
    pass

class InteractionUpdate(BaseModel):
    hcp_name: str  # Required as per instructions
    interaction_type: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    attendees: Optional[str] = None
    topics_discussed: Optional[str] = None
    materials_shared: Optional[str] = None
    samples_distributed: Optional[str] = None
    hcp_sentiment: Optional[str] = None
    outcomes: Optional[str] = None
    follow_up_actions: Optional[str] = None
    ai_suggested_followups: Optional[str] = None

class InteractionResponse(BaseModel):
    id: int
    hcp_name: str
    interaction_type: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    attendees: Optional[str] = None
    topics_discussed: Optional[str] = None
    materials_shared: Optional[str] = None
    samples_distributed: Optional[str] = None
    hcp_sentiment: Optional[str] = None
    outcomes: Optional[str] = None
    follow_up_actions: Optional[str] = None
    ai_suggested_followups: Optional[str] = None

    @field_validator('date', mode='before')
    @classmethod
    def convert_date(cls, v):
        if v is None:
            return None
        if hasattr(v, 'isoformat'):
            return v.isoformat()
        return str(v)

    model_config = {"from_attributes": True}

class ChatRequest(BaseModel):
    message: str

class ExtractRequest(BaseModel):
    text: str
