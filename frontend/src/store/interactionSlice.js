import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  formData: {
    hcp_name: '',
    interaction_type: 'Meeting',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    attendees: '',
    topics_discussed: '',
    materials_shared: '',
    samples_distributed: '',
    hcp_sentiment: 'Neutral',
    outcomes: '',
    follow_up_actions: '',
    ai_suggested_followups: ''
  },
  chatMessages: [
    { role: 'assistant', content: "Log interaction details here (e.g., 'Met Dr. Smith, discussed Product X efficacy, positive sentiment, shared brochure') or ask for help." }
  ],
  isLoading: false,
  error: null
};

const interactionSlice = createSlice({
  name: 'interaction',
  initialState,
  reducers: {
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },
    addChatMessage: (state, action) => {
      state.chatMessages.push(action.payload);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setAISuggestions: (state, action) => {
      state.formData.ai_suggested_followups = action.payload;
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.error = null;
    },
    bulkUpdateFields: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    }
  }
});

export const { 
  updateFormField, 
  addChatMessage, 
  setLoading, 
  setAISuggestions, 
  resetForm,
  bulkUpdateFields
} = interactionSlice.actions;

export default interactionSlice.reducer;
