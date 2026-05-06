
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addChatMessage, bulkUpdateFields, setLoading } from '../store/interactionSlice';
import axios from 'axios';

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.interaction.chatMessages);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");

    dispatch(addChatMessage({ role: "user", content: userMessage }));

    // Call chat API for real LLM response
    dispatch(setLoading(true));
    setIsTyping(true);
    try {
      // 1. Get Chat Response
      const chatResponse = await axios.post(
        "http://localhost:8000/api/interactions/agent/chat",
        { message: userMessage }
      );
      dispatch(addChatMessage({
        role: "assistant",
        content: chatResponse.data.response
      }));

      // 2. Extract Data for Autofill (if message looks like an interaction)
      const triggers = ["met", "call", "dr", "meeting", "spoke", "visited"];
      if (triggers.some(t => userMessage.toLowerCase().includes(t))) {
        const extractRes = await axios.post('http://localhost:8000/api/interactions/agent/extract', {
          text: userMessage
        });
        
        if (extractRes.data) {
          dispatch(bulkUpdateFields(extractRes.data));
        }
      }
    } catch (error) {
      dispatch(addChatMessage({
        role: "assistant",
        content: "Agent Error: Could not connect. Please try again."
      }));
    } finally {
      dispatch(setLoading(false));
      setIsTyping(false);
    }
  };

  const styles = {
    container: {
      flex: '0 0 35%',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 120px)',
      border: '1px solid #dadce0'
    },
    header: {
      padding: '16px',
      borderBottom: '1px solid #dadce0',
      backgroundColor: '#fff',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px'
    },
    title: {
      fontSize: '16px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#202124'
    },
    subtitle: {
      fontSize: '12px',
      color: '#5f6368',
      marginTop: '4px'
    },
    messageArea: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    bubble: (role) => ({
      maxWidth: '85%',
      padding: '10px 14px',
      borderRadius: '12px',
      fontSize: '14px',
      lineHeight: '1.4',
      alignSelf: role === 'user' ? 'flex-end' : 'flex-start',
      backgroundColor: role === 'user' ? '#1a73e8' : '#fff',
      color: role === 'user' ? '#fff' : '#3c4043',
      boxShadow: role === 'assistant' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
      border: role === 'assistant' ? '1px solid #e8eaed' : 'none'
    }),
    inputArea: {
      padding: '16px',
      borderTop: '1px solid #dadce0',
      backgroundColor: '#fff',
      display: 'flex',
      gap: '8px',
      borderBottomLeftRadius: '8px',
      borderBottomRightRadius: '8px'
    },
    textInput: {
      flex: 1,
      padding: '8px 12px',
      border: '1px solid #dadce0',
      borderRadius: '20px',
      fontSize: '14px',
      outline: 'none'
    },
    sendButton: {
      backgroundColor: '#1a73e8',
      color: '#fff',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>
          <span>🤖</span> AI Assistant
        </div>
        <div style={styles.subtitle}>Log interaction via chat</div>
      </div>
      
      <div style={styles.messageArea} ref={scrollRef}>
        {messages.map((msg, i) => (
          <div key={i} style={styles.bubble(msg.role)}>
            {msg.content}
          </div>
        ))}
        {isTyping && (
          <div style={{...styles.bubble('assistant'), color: '#5f6368', fontStyle: 'italic'}}>
            Thinking...
          </div>
        )}
      </div>

      <div style={styles.inputArea}>
        <input 
          style={styles.textInput} 
          placeholder="Type here..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button style={styles.sendButton} onClick={sendMessage}>Log</button>
      </div>
    </div>
  );
};

export default ChatInterface;
