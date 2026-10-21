import express from 'express';
import { ChatService } from '../services/storage.js';
import { processAIRequest } from '../services/aiEngine.js';

const router = express.Router();

// GET chat history
router.get('/history', async (req, res) => {
  try {
    const history = await ChatService.getHistory();
    res.json({ success: true, count: history.length, data: history });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST send message and get AI response
router.post('/message', async (req, res) => {
  try {
    const { text, context } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, error: 'Message text cannot be empty' });
    }

    // 1. Save user message
    const userMsg = await ChatService.addMessage({
      sender: 'user',
      text: text.trim(),
      intent: 'UserPrompt',
    });

    // 2. Process through AI Engine
    const aiResult = await processAIRequest({ text: text.trim(), context });

    // 3. Save assistant message
    const alexaMsg = await ChatService.addMessage({
      sender: 'alexa',
      text: aiResult.text,
      intent: aiResult.intent,
      metadata: aiResult.actionExecuted || {},
      suggestedActions: aiResult.suggestedActions || [],
    });

    res.json({
      success: true,
      userMessage: userMsg,
      response: alexaMsg,
      actionExecuted: aiResult.actionExecuted || null,
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE clear history
router.delete('/history', async (req, res) => {
  try {
    const result = await ChatService.clearHistory();
    // Re-seed welcome message
    const welcome = await ChatService.addMessage({
      sender: 'alexa',
      text: 'Message history has been reset. How may I assist your life schedule and smart space today?',
      intent: 'Welcome',
      suggestedActions: [
        { label: 'Summarize today\'s schedule', action: 'ask_schedule' },
        { label: 'Turn on Living Room lights', action: 'toggle_light' },
        { label: 'Daily Briefing', action: 'ask_briefing' }
      ]
    });
    res.json({ success: true, message: 'History cleared', welcomeMessage: welcome });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
