import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateFormField, setLoading, resetForm, setAISuggestions } from '../store/interactionSlice';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const LogInteractionForm = () => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.interaction.formData);
  const isLoading = useSelector((state) => state.interaction.isLoading);

  const handleInputChange = (field, value) => {
    dispatch(updateFormField({ field, value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      // Clean and format the payload to match backend schema
      const payload = {
        hcp_name: formData.hcp_name || "",
        interaction_type: formData.interaction_type || "Meeting",
        date: formData.date || new Date().toISOString().split("T")[0],
        time: formData.time || "00:00",
        attendees: formData.attendees || "",
        topics_discussed: formData.topics_discussed || "",
        materials_shared: formData.materials_shared || "",
        samples_distributed: formData.samples_distributed || "",
        hcp_sentiment: formData.hcp_sentiment || "Neutral",
        outcomes: formData.outcomes || "",
        follow_up_actions: formData.follow_up_actions || "",
        ai_suggested_followups: formData.ai_suggested_followups || ""
      };

      // 1. Log Interaction
      await axios.post('http://localhost:8000/api/interactions/', payload);
      
      // 2. Extract AI suggestions from topics
      const extractResponse = await axios.post('http://localhost:8000/api/interactions/agent/extract', {
        text: formData.topics_discussed
      });
      
      if (extractResponse.data && extractResponse.data.ai_suggested_followups) {
        dispatch(setAISuggestions(extractResponse.data.ai_suggested_followups));
      }

      alert('Interaction logged successfully!');
      dispatch(resetForm()); // Reset form after success
    } catch (error) {
      console.error('Error logging interaction:', error);
      alert('Failed to log interaction.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSummarize = async () => {
    if (!formData.topics_discussed) {
      alert("Please enter some topics to summarize.");
      return;
    }
    dispatch(setLoading(true));
    try {
      const response = await axios.post('http://localhost:8000/api/interactions/agent/chat', {
        message: `Summarize these notes professionally: ${formData.topics_discussed}`
      });
      dispatch(updateFormField({ field: 'outcomes', value: response.data.response }));
    } catch (error) {
      console.error('Error summarizing:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const styles = {
    container: {
      padding: '24px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      flex: '0 0 65%',
      marginRight: '24px'
    },
    sectionHeader: {
      fontSize: '13px',
      fontWeight: 'bold',
      color: '#5f6368',
      textTransform: 'uppercase',
      marginBottom: '16px',
      display: 'block'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '8px',
      color: '#202124'
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #dadce0',
      borderRadius: '6px',
      fontSize: '14px',
      outline: 'none'
    },
    textarea: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #dadce0',
      borderRadius: '6px',
      fontSize: '14px',
      minHeight: '80px',
      outline: 'none',
      resize: 'vertical'
    },
    row: {
      display: 'flex',
      gap: '16px'
    },
    button: {
      backgroundColor: '#1a73e8',
      color: '#fff',
      padding: '12px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      width: '100%',
      marginTop: '12px'
    },
    secondaryButton: {
      backgroundColor: '#f1f3f4',
      border: '1px solid #dadce0',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      cursor: 'pointer',
      marginLeft: '8px'
    },
    chip: {
      display: 'inline-block',
      backgroundColor: '#e8f0fe',
      color: '#1a73e8',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '13px',
      margin: '4px'
    }
  };

  return (
    <div style={styles.container}>
      <span style={styles.sectionHeader}>Log HCP Interaction</span>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>HCP Name</label>
          <input 
            style={styles.input} 
            placeholder="Search or select HCP..."
            value={formData.hcp_name}
            onChange={(e) => handleInputChange('hcp_name', e.target.value)}
            required
          />
        </div>

        <div style={styles.row}>
          <div style={{...styles.formGroup, flex: 1}}>
            <label style={styles.label}>Interaction Type</label>
            <select 
              style={styles.input}
              value={formData.interaction_type}
              onChange={(e) => handleInputChange('interaction_type', e.target.value)}
            >
              <option>Meeting</option>
              <option>Call</option>
              <option>Email</option>
              <option>Conference</option>
            </select>
          </div>
          <div style={{...styles.formGroup, flex: 1}}>
            <label style={styles.label}>Date</label>
            <DatePicker 
              selected={new Date(formData.date)}
              onChange={(date) => handleInputChange('date', date.toISOString().split('T')[0])}
              className="date-picker-custom"
              customInput={<input style={styles.input} />}
            />
          </div>
          <div style={{...styles.formGroup, flex: 1}}>
            <label style={styles.label}>Time</label>
            <input 
              type="time" 
              style={styles.input} 
              value={formData.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Attendees</label>
          <input 
            style={styles.input} 
            value={formData.attendees}
            onChange={(e) => handleInputChange('attendees', e.target.value)}
          />
        </div>

        <div style={styles.formGroup}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{...styles.label, marginBottom: 0}}>Topics Discussed</label>
            <button 
              type="button" 
              style={styles.secondaryButton}
              onClick={handleSummarize}
            >
              ✨ Summarize from Voice Note
            </button>
          </div>
          <textarea 
            style={styles.textarea}
            value={formData.topics_discussed}
            onChange={(e) => handleInputChange('topics_discussed', e.target.value)}
          />
        </div>

        <div style={styles.row}>
          <div style={{...styles.formGroup, flex: 1}}>
            <label style={styles.label}>Materials Shared</label>
            <div style={{display: 'flex'}}>
              <input 
                style={styles.input} 
                value={formData.materials_shared}
                onChange={(e) => handleInputChange('materials_shared', e.target.value)}
              />
              <button 
                type="button" 
                style={styles.secondaryButton}
                onClick={() => alert('Opening Materials Search...')}
              >
                Search/Add
              </button>
            </div>
          </div>
          <div style={{...styles.formGroup, flex: 1}}>
            <label style={styles.label}>Samples Distributed</label>
            <div style={{display: 'flex'}}>
              <input 
                style={styles.input} 
                value={formData.samples_distributed}
                onChange={(e) => handleInputChange('samples_distributed', e.target.value)}
              />
              <button 
                type="button" 
                style={styles.secondaryButton}
                onClick={() => alert('Opening Samples Inventory...')}
              >
                Add Sample
              </button>
            </div>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Observed HCP Sentiment</label>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Positive', 'Neutral', 'Negative'].map(sentiment => (
              <label key={sentiment} style={{ display: 'flex', alignItems: 'center', fontSize: '14px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="sentiment" 
                  value={sentiment}
                  checked={formData.hcp_sentiment === sentiment}
                  onChange={(e) => handleInputChange('hcp_sentiment', e.target.value)}
                  style={{ marginRight: '8px' }}
                />
                {sentiment}
              </label>
            ))}
          </div>
        </div>

        <div style={styles.row}>
          <div style={{...styles.formGroup, flex: 1}}>
            <label style={styles.label}>Outcomes</label>
            <textarea 
              style={styles.textarea}
              value={formData.outcomes}
              onChange={(e) => handleInputChange('outcomes', e.target.value)}
            />
          </div>
          <div style={{...styles.formGroup, flex: 1}}>
            <label style={styles.label}>Follow-up Actions</label>
            <textarea 
              style={styles.textarea}
              value={formData.follow_up_actions}
              onChange={(e) => handleInputChange('follow_up_actions', e.target.value)}
            />
          </div>
        </div>

        <div style={{...styles.formGroup, backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '6px'}}>
          <label style={{...styles.label, color: '#1a73e8', fontSize: '12px', textTransform: 'uppercase'}}>AI Suggested Follow-ups</label>
          <div style={{ minHeight: '20px' }}>
            {formData.ai_suggested_followups ? (
              formData.ai_suggested_followups.split('\n').filter(s => s.trim()).map((s, i) => (
                <span key={i} style={styles.chip}>{s.replace(/^[•\d.]+\s*/, '')}</span>
              ))
            ) : (
              <span style={{color: '#9aa0a6', fontSize: '12px'}}>Suggestions will appear here after submit...</span>
            )}
          </div>
        </div>

        <button type="submit" style={styles.button} disabled={isLoading}>
          {isLoading ? 'Logging...' : 'Log Interaction'}
        </button>
      </form>
    </div>
  );
};

export default LogInteractionForm;
