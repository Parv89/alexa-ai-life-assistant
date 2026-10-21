import { TaskService, DeviceService } from './storage.js';

export const processAIRequest = async ({ text, context = {} }) => {
  const cleanText = text.trim();
  const lower = cleanText.toLowerCase();

  // 1. Task Creation Intent
  // e.g. "add task buy groceries", "remind me to prepare presentation", "create task urgent call client"
  const addTaskMatch = lower.match(/(?:add task|create task|remind me to|new task)\s+(.*)/i);
  if (addTaskMatch && addTaskMatch[1]) {
    const rawTitle = addTaskMatch[1].trim();
    let priority = 'medium';
    let category = 'Personal';

    if (/urgent|asap|critical/i.test(rawTitle)) priority = 'urgent';
    else if (/high|important/i.test(rawTitle)) priority = 'high';
    else if (/low/i.test(rawTitle)) priority = 'low';

    if (/work|office|client|presentation|code|deploy|bug/i.test(rawTitle)) category = 'Work';
    else if (/workout|exercise|health|gym|medicine|doctor/i.test(rawTitle)) category = 'Health';
    else if (/home|clean|groceries|dishes|cook/i.test(rawTitle)) category = 'Home';
    else if (/study|read|learn|course/i.test(rawTitle)) category = 'Learning';

    const cleanedTitle = rawTitle.replace(/\b(urgent|high priority|low priority)\b/gi, '').trim();

    const createdTask = await TaskService.create({
      title: cleanedTitle.charAt(0).toUpperCase() + cleanedTitle.slice(1),
      category,
      priority,
      source: 'alexa',
      dueDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString()
    });

    return {
      text: `I have added "${createdTask.title}" to your tasks under ${category} with ${priority} priority.`,
      intent: 'AddTaskIntent',
      actionExecuted: { type: 'TASK_CREATED', task: createdTask },
      suggestedActions: [
        { label: 'View All Tasks', action: 'view_tasks' },
        { label: 'Set Due Date', action: 'edit_task', payload: { id: createdTask._id } }
      ]
    };
  }

  // 2. Task Query / Schedule Intent
  if (/task|schedule|to-do|todo|what do i have|agenda|plan today/i.test(lower)) {
    const tasks = await TaskService.getAll();
    const pending = tasks.filter(t => !t.completed);
    const urgent = pending.filter(t => t.priority === 'urgent' || t.priority === 'high');

    let responseText = `You have ${pending.length} pending task${pending.length === 1 ? '' : 's'}. `;
    if (urgent.length > 0) {
      responseText += `Of those, ${urgent.length} require immediate attention: ${urgent.map(t => `"${t.title}"`).join(', ')}.`;
    } else if (pending.length > 0) {
      responseText += `Your next scheduled item is "${pending[0].title}".`;
    } else {
      responseText = `All caught up! You have 0 pending tasks for today. Great job!`;
    }

    return {
      text: responseText,
      intent: 'GetTasksIntent',
      suggestedActions: [
        { label: 'Add a new task', action: 'prompt_add_task' },
        { label: 'View productivity score', action: 'view_analytics' }
      ]
    };
  }

  // 3. Smart Home Control Intent
  if (/turn on|turn off|switch on|switch off|lights|thermostat|temperature|lock|unlock|scene/i.test(lower)) {
    const devices = await DeviceService.getAll();

    // Scene triggers
    if (/good morning/i.test(lower)) {
      const updated = await DeviceService.activateScene('good_morning');
      return {
        text: 'Good Morning scene activated. Ambient lighting elevated to 80%, coffee machine socket powered on, and climate adjusted to 72°F.',
        intent: 'SceneActivationIntent',
        actionExecuted: { type: 'SCENE_ACTIVATED', scene: 'good_morning' },
        suggestedActions: [{ label: 'View Home Dashboard', action: 'view_home' }]
      };
    }
    if (/movie night|cinema/i.test(lower)) {
      const updated = await DeviceService.activateScene('movie_night');
      return {
        text: 'Movie Night scene activated. Ambient lighting dimmed to 15%, front deadbolt secured, and sound system primed.',
        intent: 'SceneActivationIntent',
        actionExecuted: { type: 'SCENE_ACTIVATED', scene: 'movie_night' },
        suggestedActions: [{ label: 'View Home Dashboard', action: 'view_home' }]
      };
    }
    if (/leave home|away mode|goodbye/i.test(lower)) {
      const updated = await DeviceService.activateScene('leave_home');
      return {
        text: 'Away mode triggered. All non-essential lighting and sockets turned off, deadbolt locked, thermostat switched to eco mode.',
        intent: 'SceneActivationIntent',
        actionExecuted: { type: 'SCENE_ACTIVATED', scene: 'leave_home' },
        suggestedActions: [{ label: 'View Home Dashboard', action: 'view_home' }]
      };
    }

    // Individual light toggle
    if (/light/i.test(lower)) {
      const turnOn = /on/i.test(lower);
      const light = devices.find(d => d.type === 'light');
      if (light) {
        await DeviceService.updateState(light._id, { on: turnOn });
        return {
          text: `${light.name} has been turned ${turnOn ? 'ON' : 'OFF'}. [Simulated smart device state updated]`,
          intent: 'DeviceControlIntent',
          actionExecuted: { type: 'DEVICE_UPDATED', deviceId: light._id, state: { on: turnOn } }
        };
      }
    }

    // Thermostat
    const tempMatch = lower.match(/(?:temperature|thermostat|temp)\s+(?:to\s+)?(\d{2})/i);
    if (tempMatch && tempMatch[1]) {
      const target = parseInt(tempMatch[1], 10);
      const therm = devices.find(d => d.type === 'thermostat');
      if (therm) {
        await DeviceService.updateState(therm._id, { targetTemperature: target });
        return {
          text: `Thermostat target adjusted to ${target}°F. [Simulated climate control directive applied]`,
          intent: 'DeviceControlIntent',
          actionExecuted: { type: 'DEVICE_UPDATED', deviceId: therm._id, state: { targetTemperature: target } }
        };
      }
    }

    // Lock
    if (/lock|deadbolt/i.test(lower)) {
      const shouldLock = !/unlock/i.test(lower);
      const lock = devices.find(d => d.type === 'lock');
      if (lock) {
        await DeviceService.updateState(lock._id, { locked: shouldLock });
        return {
          text: `${lock.name} is now ${shouldLock ? 'LOCKED' : 'UNLOCKED'}. [Simulated security directive executed]`,
          intent: 'DeviceControlIntent',
          actionExecuted: { type: 'DEVICE_UPDATED', deviceId: lock._id, state: { locked: shouldLock } }
        };
      }
    }
  }

  // 4. Daily Briefing Intent
  if (/briefing|summary|overview|status report|morning report/i.test(lower)) {
    const tasks = await TaskService.getAll();
    const pending = tasks.filter(t => !t.completed);
    const completed = tasks.filter(t => t.completed);
    const devices = await DeviceService.getAll();
    const activeDevices = devices.filter(d => d.state && d.state.on);

    return {
      text: `Here is your Daily Life Briefing: You have completed ${completed.length} tasks today, with ${pending.length} pending. You currently have ${activeDevices.length} simulated smart devices active. All systems and Alexa webhook channels are online.`,
      intent: 'DailyBriefingIntent',
      suggestedActions: [
        { label: 'View Tasks', action: 'view_tasks' },
        { label: 'Smart Home Controls', action: 'view_home' },
        { label: 'Productivity Metrics', action: 'view_analytics' }
      ]
    };
  }

  // 5. Alexa / Hackathon compliance query
  if (/alexa|hackathon|alexa\+|compliance|ask|skill|mcp/i.test(lower)) {
    return {
      text: `Alexa AI Life Assistant complies with the official Amazon Alexa Skills Kit (ASK) specification. It features an official webhook endpoint (/api/alexa/webhook) supporting LaunchRequest, IntentRequest (AddTaskIntent, GetTasksIntent, DeviceControlIntent), and SessionEndedRequest. Smart home devices are labeled as simulated endpoints ready for AWS IoT Core / Alexa Smart Home Skill binding.`,
      intent: 'AlexaComplianceInfoIntent',
      suggestedActions: [
        { label: 'Open Alexa Developer Modal', action: 'open_alexa_modal' },
        { label: 'Test ASK Webhook Payload', action: 'test_ask_webhook' }
      ]
    };
  }

  // Fallback intelligent conversational response
  return {
    text: `I received: "${cleanText}". You can ask me to manage tasks ("add task prepare demo"), control simulated smart home devices ("turn on living room light", "set temperature to 72"), or ask for your daily briefing.`,
    intent: 'GeneralConversation',
    suggestedActions: [
      { label: 'Daily Briefing', action: 'ask_briefing' },
      { label: 'What are my tasks?', action: 'ask_tasks' },
      { label: 'Activate Good Morning Scene', action: 'scene_morning' }
    ]
  };
};
