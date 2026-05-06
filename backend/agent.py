import os
import json
from typing import TypedDict, Annotated, List, Dict, Optional
from dotenv import load_dotenv

from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langchain_core.tools import tool
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition

load_dotenv()

# --- LLM INITIALIZATION ---

# Using Groq Llama 3.1 8B for fast, reliable responses with higher rate limits.
llm = ChatGroq(
    model="llama-3.1-8b-instant",
    groq_api_key=os.getenv("GROQ_API_KEY"),
    temperature=0,
    max_retries=3
)

# This allows import in other files
__all__ = ["run_agent", "llm"]

# Agent State definition
class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]
    interaction_data: Optional[Dict]
    action_result: Optional[str]

# --- TOOLS ---

@tool
def log_interaction(text: str) -> str:
    """Extracts HCP interaction fields from natural language text."""
    prompt = f"""
    Extract interaction details from the following text:
    "{text}"
    
    Extract these fields:
    - hcp_name (String)
    - interaction_type (Meeting, Call, Email, or Conference)
    - date (YYYY-MM-DD)
    - topics_discussed (String)
    - hcp_sentiment (Positive, Neutral, or Negative)
    - outcomes (String)
    - follow_up_actions (String)
    
    Also, generate 'ai_suggested_followups' based on the interaction.
    
    Return ONLY a valid JSON object.
    """
    response = llm.invoke(prompt)
    return response.content

@tool
def edit_interaction(interaction_id: str, updates_json: str) -> str:
    """Edit an existing interaction by ID."""
    try:
        # Convert to int safely
        id_int = int(str(interaction_id).strip())
        updates = json.loads(updates_json)
        
        prompt = f"Confirm these updates for interaction {id_int} in plain English: {updates_json}"
        confirmation = llm.invoke(prompt).content
        
        result = {
            "interaction_id": id_int,
            "updates": updates,
            "confirmation": confirmation
        }
        return json.dumps(result)
    except Exception as e:
        return f"Edit failed: {str(e)}"

@tool
def search_hcp(hcp_name: str) -> str:
    """Searches for HCP details in the database."""
    mock_profiles = {
        "Dr. Smith": {"name": "Dr. Smith", "specialty": "Cardiology", "hospital": "City Hospital", "last_interaction": "2024-04-15"},
        "Dr. Jones": {"name": "Dr. Jones", "specialty": "Oncology", "hospital": "Central Clinic", "last_interaction": "2024-05-01"}
    }
    
    profile = mock_profiles.get(hcp_name, {"name": hcp_name, "specialty": "Unknown", "hospital": "Unknown", "last_interaction": "None"})
    profile["note"] = "In production this connects to HCP master database"
    return json.dumps(profile)

@tool
def suggest_followups(summary_text: str) -> str:
    """Generates 3 intelligent follow-up action suggestions based on a summary."""
    prompt = f"""
    Based on this interaction summary, suggest 3 intelligent follow-up actions following pharma sales best practices:
    "{summary_text}"
    
    Format as a numbered list.
    """
    response = llm.invoke(prompt)
    return response.content

@tool
def summarize_interaction(text: str) -> str:
    """Produces a clean, concise 3-5 sentence professional summary for CRM entry."""
    prompt = f"""
    Summarize the following interaction notes into a professional CRM entry (3-5 sentences):
    "{text}"
    """
    response = llm.invoke(prompt)
    return response.content

tools = [log_interaction, edit_interaction, search_hcp, suggest_followups, summarize_interaction]
llm_with_tools = llm.bind_tools(tools)

# --- SYSTEM PROMPT ---
SYSTEM_PROMPT = """You are a highly professional AI assistant for a Pharmaceutical CRM system. 
Your goal is to help field representatives manage interactions with Healthcare Professionals (HCPs).

You MUST use the provided tools for specialized tasks:
1. log_interaction: Use whenever a user describes a meeting, visit, or interaction with an HCP.
2. edit_interaction: Use when a user wants to update or modify an existing interaction.
3. search_hcp: Use ONLY when a user explicitly asks to find or search for an HCP profile.
4. suggest_followups: Use whenever a user asks for follow-up actions, ideas, or what to do next with an HCP.
5. summarize_interaction: Use whenever a user asks to "summarize" or "recap" interaction notes.

IMPORTANT RULES:
- If a user says "Summarize: [text]" → call summarize_interaction.
- If a user says "Suggest follow-ups for [topic]" → call suggest_followups.
- If a user says "Met Dr. X..." → call log_interaction.
- For general questions not related to CRM data entry or HCPs, answer directly as helpful text.
- NEVER mention tool names to the user. Just provide the final professional result.
"""

# --- GRAPH NODES ---

def call_model(state: AgentState):
    messages = state['messages']
    # Always ensure system prompt is at the start
    if not any(isinstance(m, SystemMessage) for m in messages):
        messages = [SystemMessage(content=SYSTEM_PROMPT)] + messages
    else:
        # Update existing system prompt to the strong version if it's there
        for i, m in enumerate(messages):
            if isinstance(m, SystemMessage):
                messages[i] = SystemMessage(content=SYSTEM_PROMPT)
                break
    
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}

# --- GRAPH CONSTRUCTION ---

workflow = StateGraph(AgentState)

workflow.add_node("agent", call_model)
workflow.add_node("tools", ToolNode(tools))

workflow.set_entry_point("agent")
workflow.add_conditional_edges("agent", tools_condition)
workflow.add_edge("tools", "agent")

app_graph = workflow.compile()

async def run_agent(user_message: str) -> str:
    """Main entry point to run the agent with a message."""
    try:
        inputs = {"messages": [HumanMessage(content=user_message)]}
        config = {"configurable": {"thread_id": "aivoa_crm_session"}}
        
        final_state = await app_graph.ainvoke(inputs, config=config)
        return final_state["messages"][-1].content
    except Exception as e:
        return f"Agent Error: {str(e)}. Please check your connection and try again."
