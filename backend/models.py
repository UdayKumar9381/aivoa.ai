from sqlalchemy import Column, Integer, String, Text, Date, DateTime, func
from database import Base

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    hcp_name = Column(String(255), nullable=False)
    interaction_type = Column(String(100))  # Meeting, Call, Email, Conference
    date = Column(String(100))
    time = Column(String(50))
    attendees = Column(String(512))
    topics_discussed = Column(Text)
    materials_shared = Column(Text)
    samples_distributed = Column(Text)
    hcp_sentiment = Column(String(50))  # Positive, Neutral, Negative
    outcomes = Column(Text)
    follow_up_actions = Column(Text)
    ai_suggested_followups = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
