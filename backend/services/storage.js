import Task from '../models/Task.js';
import Device from '../models/Device.js';
import ChatMessage from '../models/ChatMessage.js';
import { getDBStatus } from '../config/db.js';

// In-Memory Fallback Store if MongoDB is disconnected
const inMemoryStore = {
  tasks: [
    {
      _id: 'task-1',
      title: 'Review Alexa Skills Kit (ASK) interaction model',
      description: 'Verify custom intents, utterances, and slot validations in the skill package.',
      category: 'Work',
      priority: 'urgent',
      dueDate: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
      completed: false,
      completedAt: null,
      source: 'alexa',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'task-2',
      title: 'Verify smart home simulation endpoints',
      description: 'Ensure device control webhooks return valid Alexa Smart Home response directives.',
      category: 'Work',
      priority: 'high',
      dueDate: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
      completed: false,
      completedAt: null,
      source: 'web',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'task-3',
      title: 'Morning wellness: 15-minute mindfulness',
      description: 'Hydration and breathing exercise tracked via voice assistant.',
      category: 'Health',
      priority: 'medium',
      dueDate: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      completed: true,
      completedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
      source: 'voice',
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'task-4',
      title: 'Sync smart lighting & temperature scenes',
      description: 'Calibrate living room ambient cyan luminescence with evening schedule.',
      category: 'Home',
      priority: 'medium',
      dueDate: new Date(Date.now() + 30 * 3600 * 1000).toISOString(),
      completed: false,
      completedAt: null,
      source: 'web',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'task-5',
      title: 'Practice speech prompt: "Alexa, give me my daily briefing"',
      description: 'Test speech recognition accuracy and natural voice synthesis playback.',
      category: 'Productivity',
      priority: 'low',
      dueDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      completed: false,
      completedAt: null,
      source: 'voice',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  devices: [
    {
      _id: 'dev-1',
      name: 'Ambient Cyan Ceiling Halo',
      type: 'light',
      room: 'Living Room',
      status: 'online',
      state: { on: true, brightness: 85, colorTemperature: 4500, powerUsageWatts: 14 },
      isSimulated: true,
      simulationNote: 'Simulated smart light endpoint. Ready for AWS IoT Core or Alexa Smart Home Skill binding.',
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'dev-2',
      name: 'Ultra-Comfort Climate Controller',
      type: 'thermostat',
      room: 'Main Suite',
      status: 'online',
      state: { on: true, targetTemperature: 72, currentTemperature: 71, mode: 'eco', powerUsageWatts: 340 },
      isSimulated: true,
      simulationNote: 'Simulated smart thermostat endpoint. Ready for Alexa Connected Device API.',
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'dev-3',
      name: 'Executive Smart Deadbolt',
      type: 'lock',
      room: 'Entryway',
      status: 'online',
      state: { locked: true, powerUsageWatts: 1 },
      isSimulated: true,
      simulationNote: 'Simulated smart lock endpoint with secure audit logging.',
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'dev-4',
      name: 'Artisan Espresso Hub',
      type: 'plug',
      room: 'Kitchen',
      status: 'online',
      state: { on: false, powerUsageWatts: 0 },
      isSimulated: true,
      simulationNote: 'Simulated 16A smart energy monitoring socket.',
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'dev-5',
      name: 'Acoustic Studio Echo Bar',
      type: 'speaker',
      room: 'Office',
      status: 'online',
      state: { on: true, volume: 55, powerUsageWatts: 18 },
      isSimulated: true,
      simulationNote: 'Simulated multi-room Alexa audio node with sync playback.',
      updatedAt: new Date().toISOString(),
    },
  ],
  chatMessages: [
    {
      _id: 'msg-1',
      sender: 'alexa',
      text: 'Good day! I am your Alexa AI Life Assistant. I can organize your tasks, control your simulated smart devices, summarize productivity, or execute voice queries. How may I assist you right now?',
      intent: 'Welcome',
      metadata: { verified: true },
      suggestedActions: [
        { label: 'Summarize today\'s schedule', action: 'ask_schedule' },
        { label: 'Turn on Living Room lights', action: 'toggle_light' },
        { label: 'Add high-priority task', action: 'new_task' },
        { label: 'Explain Alexa Hackathon Compliance', action: 'alexa_info' }
      ],
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
  ]
};

// Seed MongoDB if empty upon first connection
export const seedMongoIfEmpty = async () => {
  const status = getDBStatus();
  if (!status.isConnected) return;

  try {
    const taskCount = await Task.countDocuments();
    if (taskCount === 0) {
      console.log('[Seed] Seeding default tasks to MongoDB...');
      await Task.insertMany(inMemoryStore.tasks.map(({ _id, ...rest }) => rest));
    }

    const devCount = await Device.countDocuments();
    if (devCount === 0) {
      console.log('[Seed] Seeding default devices to MongoDB...');
      await Device.insertMany(inMemoryStore.devices.map(({ _id, ...rest }) => rest));
    }

    const chatCount = await ChatMessage.countDocuments();
    if (chatCount === 0) {
      console.log('[Seed] Seeding initial welcome message to MongoDB...');
      await ChatMessage.insertMany(inMemoryStore.chatMessages.map(({ _id, ...rest }) => rest));
    }
  } catch (err) {
    console.warn('[Seed Error]', err.message);
  }
};

// Task Operations
export const TaskService = {
  async getAll(query = {}) {
    const status = getDBStatus();
    if (status.isConnected) {
      const filter = {};
      if (query.category && query.category !== 'All') filter.category = query.category;
      if (query.completed !== undefined) filter.completed = query.completed === 'true';
      if (query.priority && query.priority !== 'all') filter.priority = query.priority;
      if (query.search) {
        filter.$or = [
          { title: { $regex: query.search, $options: 'i' } },
          { description: { $regex: query.search, $options: 'i' } }
        ];
      }
      return await Task.find(filter).sort({ dueDate: 1, createdAt: -1 });
    }

    // In-memory fallback
    let items = [...inMemoryStore.tasks];
    if (query.category && query.category !== 'All') {
      items = items.filter(t => t.category.toLowerCase() === query.category.toLowerCase());
    }
    if (query.completed !== undefined) {
      const isComp = query.completed === 'true';
      items = items.filter(t => t.completed === isComp);
    }
    if (query.priority && query.priority !== 'all') {
      items = items.filter(t => t.priority.toLowerCase() === query.priority.toLowerCase());
    }
    if (query.search) {
      const term = query.search.toLowerCase();
      items = items.filter(t => t.title.toLowerCase().includes(term) || (t.description && t.description.toLowerCase().includes(term)));
    }
    return items;
  },

  async create(data) {
    const status = getDBStatus();
    if (status.isConnected) {
      const task = new Task(data);
      return await task.save();
    }

    const newTask = {
      _id: 'task-' + Date.now(),
      title: data.title,
      description: data.description || '',
      category: data.category || 'Personal',
      priority: data.priority || 'medium',
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      completed: !!data.completed,
      completedAt: data.completed ? new Date().toISOString() : null,
      source: data.source || 'web',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    inMemoryStore.tasks.unshift(newTask);
    return newTask;
  },

  async update(id, data) {
    const status = getDBStatus();
    if (status.isConnected) {
      return await Task.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    const index = inMemoryStore.tasks.findIndex(t => t._id === id);
    if (index === -1) return null;
    inMemoryStore.tasks[index] = {
      ...inMemoryStore.tasks[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return inMemoryStore.tasks[index];
  },

  async delete(id) {
    const status = getDBStatus();
    if (status.isConnected) {
      return await Task.findByIdAndDelete(id);
    }

    const index = inMemoryStore.tasks.findIndex(t => t._id === id);
    if (index === -1) return null;
    const [deleted] = inMemoryStore.tasks.splice(index, 1);
    return deleted;
  },

  async toggle(id) {
    const status = getDBStatus();
    if (status.isConnected) {
      const task = await Task.findById(id);
      if (!task) return null;
      task.completed = !task.completed;
      task.completedAt = task.completed ? new Date() : null;
      return await task.save();
    }

    const task = inMemoryStore.tasks.find(t => t._id === id);
    if (!task) return null;
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : null;
    task.updatedAt = new Date().toISOString();
    return task;
  }
};

// Device Operations
export const DeviceService = {
  async getAll() {
    const status = getDBStatus();
    if (status.isConnected) {
      return await Device.find().sort({ room: 1, name: 1 });
    }
    return inMemoryStore.devices;
  },

  async updateState(id, newState) {
    const status = getDBStatus();
    if (status.isConnected) {
      const device = await Device.findById(id);
      if (!device) return null;
      device.state = { ...device.state.toObject(), ...newState };
      return await device.save();
    }

    const dev = inMemoryStore.devices.find(d => d._id === id);
    if (!dev) return null;
    dev.state = { ...dev.state, ...newState };
    dev.updatedAt = new Date().toISOString();
    return dev;
  },

  async activateScene(sceneName) {
    const allDevices = await this.getAll();
    const updates = [];

    if (sceneName === 'good_morning') {
      for (const dev of allDevices) {
        if (dev.type === 'light') updates.push(this.updateState(dev._id, { on: true, brightness: 80 }));
        if (dev.type === 'plug') updates.push(this.updateState(dev._id, { on: true, powerUsageWatts: 1100 }));
        if (dev.type === 'thermostat') updates.push(this.updateState(dev._id, { targetTemperature: 72, mode: 'auto' }));
      }
    } else if (sceneName === 'movie_night') {
      for (const dev of allDevices) {
        if (dev.type === 'light') updates.push(this.updateState(dev._id, { on: true, brightness: 15 }));
        if (dev.type === 'lock') updates.push(this.updateState(dev._id, { locked: true }));
        if (dev.type === 'speaker') updates.push(this.updateState(dev._id, { on: true, volume: 65 }));
      }
    } else if (sceneName === 'leave_home') {
      for (const dev of allDevices) {
        if (dev.type === 'light') updates.push(this.updateState(dev._id, { on: false }));
        if (dev.type === 'plug') updates.push(this.updateState(dev._id, { on: false, powerUsageWatts: 0 }));
        if (dev.type === 'lock') updates.push(this.updateState(dev._id, { locked: true }));
        if (dev.type === 'thermostat') updates.push(this.updateState(dev._id, { mode: 'eco', targetTemperature: 66 }));
      }
    }
    await Promise.all(updates);
    return await this.getAll();
  }
};

// Chat History Operations
export const ChatService = {
  async getHistory(limit = 50) {
    const status = getDBStatus();
    if (status.isConnected) {
      return await ChatMessage.find().sort({ createdAt: 1 }).limit(limit);
    }
    return inMemoryStore.chatMessages;
  },

  async addMessage(msg) {
    const status = getDBStatus();
    if (status.isConnected) {
      const doc = new ChatMessage(msg);
      return await doc.save();
    }
    const newMsg = {
      _id: 'msg-' + Date.now(),
      ...msg,
      createdAt: new Date().toISOString(),
    };
    inMemoryStore.chatMessages.push(newMsg);
    return newMsg;
  },

  async clearHistory() {
    const status = getDBStatus();
    if (status.isConnected) {
      await ChatMessage.deleteMany({});
    } else {
      inMemoryStore.chatMessages = [];
    }
    return { success: true, message: 'Chat history cleared' };
  }
};
