import { liveKitVoiceService } from '../services/livekit/LiveKitVoiceService';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
};

type LarkState = {
  messages: Message[];
  workflowState: string;
  suggestions: string[];
};

class LarkOrchestrator {
  private state: LarkState = {
    messages: [],
    workflowState: 'idle',
    suggestions: [],
  };

  handleVoiceInput(text: string) {
    this.addMessage('user', text);
    this.processInput(text);
  }

  handleTextInput(text: string) {
    this.addMessage('user', text);
    this.processInput(text);
  }

  private addMessage(role: 'user' | 'assistant' | 'system', content: string) {
    this.state.messages.push({ role, content, timestamp: Date.now() });
  }

  private async processInput(text: string) {
    const lowered = text.toLowerCase();

    // Call OpenRouter API with conversation context
    try {
      const response = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'quasar-alpha',
          messages: [
            { role: 'system', content: 'You are LARK, an autonomous law enforcement assistant.' },
            ...this.state.messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: text.trim() }
          ]
        }),
      });
      if (!response.ok) {
        console.error('OpenRouter API error:', response.status, response.statusText);
        this.addMessage('assistant', `Error: OpenRouter API returned ${response.status}`);
        return;
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || 'No response.';
      this.addMessage('assistant', reply);

      // Speak the reply aloud using LiveKit with Ash voice
      liveKitVoiceService.speak(reply, 'ash');
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      this.addMessage('assistant', 'Error: Unable to get response.');
    }

    // Example proactive suggestions
    if (lowered.includes('suspect aggressive') && !this.state.suggestions.includes('Request backup?')) {
      this.state.suggestions.push('Request backup?');
    }
    if (lowered.includes('need medic') && !this.state.suggestions.includes('Request medical assistance?')) {
      this.state.suggestions.push('Request medical assistance?');
    }

    // Placeholder: trigger autonomous actions based on input
    if (lowered.includes('arriving')) {
      this.updateWorkflowState('arriving');
      this.triggerAction('notifyDispatch', { status: 'arrived' });
    }
  }

  triggerAction(actionType: string, payload?: any) {
    console.log(`Triggering action: ${actionType}`, payload);
    // TODO: Implement API calls or system integrations here
  }

  updateWorkflowState(state: string) {
    this.state.workflowState = state;
  }

  getState(): LarkState {
    return this.state;
  }

  clearSuggestions() {
    this.state.suggestions = [];
  }
}

const orchestrator = new LarkOrchestrator();
export default orchestrator;