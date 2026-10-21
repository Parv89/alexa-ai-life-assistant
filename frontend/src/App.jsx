import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import TaskManager from './components/TaskManager';
import SmartHome from './components/SmartHome';
import ProductivityAnalytics from './components/ProductivityAnalytics';
import AlexaIntegrationModal from './components/AlexaIntegrationModal';
import VoiceAssistantModal from './components/VoiceAssistantModal';
import SettingsModal from './components/SettingsModal';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Data States
  const [tasks, setTasks] = useState([]);
  const [devices, setDevices] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [stats, setStats] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);

  // Loading & Error States
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [tasksError, setTasksError] = useState(null);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Modals & User Preferences
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAlexaModalOpen, setIsAlexaModalOpen] = useState(false);
  const [initialChatPrompt, setInitialChatPrompt] = useState('');
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('alexa_user_name') || 'Executive';
  });

  // Persist user name
  useEffect(() => {
    localStorage.setItem('alexa_user_name', userName);
  }, [userName]);

  // Load all data
  const loadAllData = useCallback(async () => {
    setIsLoadingTasks(true);
    setTasksError(null);

    try {
      const [healthRes, tasksRes, devRes, chatRes, prodRes] = await Promise.allSettled([
        api.getHealth(),
        api.getTasks(),
        api.getDevices(),
        api.getChatHistory(),
        api.getProductivitySummary(),
      ]);

      if (healthRes.status === 'fulfilled') setDbStatus(healthRes.value.database);
      if (tasksRes.status === 'fulfilled') setTasks(tasksRes.value.data || []);
      else setTasksError(tasksRes.reason?.message || 'Error loading tasks');

      if (devRes.status === 'fulfilled') setDevices(devRes.value.data || []);
      if (chatRes.status === 'fulfilled') setChatMessages(chatRes.value.data || []);
      if (prodRes.status === 'fulfilled') setStats(prodRes.value.data);
    } catch (err) {
      console.error('Data loading error:', err);
    } finally {
      setIsLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Task Handlers
  const handleCreateTask = async (taskData) => {
    try {
      const res = await api.createTask(taskData);
      if (res.data) {
        setTasks((prev) => [res.data, ...prev]);
        // Refresh productivity stats
        api.getProductivitySummary().then(p => setStats(p.data)).catch(() => {});
      }
    } catch (err) {
      alert(`Error creating task: ${err.message}`);
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      const res = await api.updateTask(id, taskData);
      if (res.data) {
        setTasks((prev) => prev.map(t => t._id === id ? res.data : t));
        api.getProductivitySummary().then(p => setStats(p.data)).catch(() => {});
      }
    } catch (err) {
      alert(`Error updating task: ${err.message}`);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.deleteTask(id);
      setTasks((prev) => prev.filter(t => t._id !== id));
      api.getProductivitySummary().then(p => setStats(p.data)).catch(() => {});
    } catch (err) {
      alert(`Error deleting task: ${err.message}`);
    }
  };

  const handleToggleTask = async (id) => {
    try {
      // Optimistic update
      setTasks(prev => prev.map(t => t._id === id ? { ...t, completed: !t.completed } : t));
      const res = await api.toggleTask(id);
      if (res.data) {
        setTasks(prev => prev.map(t => t._id === id ? res.data : t));
        api.getProductivitySummary().then(p => setStats(p.data)).catch(() => {});
      }
    } catch (err) {
      // Revert on error
      loadAllData();
    }
  };

  // Smart Home Device Handlers
  const handleUpdateDeviceState = async (id, stateUpdate) => {
    try {
      // Optimistic update
      setDevices(prev => prev.map(d => d._id === id ? { ...d, state: { ...d.state, ...stateUpdate } } : d));
      const res = await api.updateDeviceState(id, stateUpdate);
      if (res.data) {
        setDevices(prev => prev.map(d => d._id === id ? res.data : d));
        api.getProductivitySummary().then(p => setStats(p.data)).catch(() => {});
      }
    } catch (err) {
      console.error('Device update error:', err);
      api.getDevices().then(r => setDevices(r.data)).catch(() => {});
    }
  };

  const handleTriggerScene = async (sceneName) => {
    try {
      const res = await api.activateScene(sceneName);
      if (res.data) {
        setDevices(res.data);
        api.getProductivitySummary().then(p => setStats(p.data)).catch(() => {});
      }
    } catch (err) {
      alert(`Error triggering scene: ${err.message}`);
    }
  };

  // Chat Handlers
  const handleSendMessage = async (text, callback) => {
    setIsChatLoading(true);
    // Optimistic user message append
    const tempUserMsg = {
      _id: 'temp-' + Date.now(),
      sender: 'user',
      text,
      createdAt: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await api.sendChatMessage(text);
      if (res.response) {
        setChatMessages((prev) => [...prev.filter(m => m._id !== tempUserMsg._id), res.userMessage, res.response]);
        
        // If an action was executed (e.g. task created or scene triggered), sync data!
        if (res.actionExecuted) {
          if (res.actionExecuted.type === 'TASK_CREATED') {
            setTasks(prev => [res.actionExecuted.task, ...prev]);
          } else if (res.actionExecuted.type === 'SCENE_ACTIVATED' || res.actionExecuted.type === 'DEVICE_UPDATED') {
            api.getDevices().then(d => setDevices(d.data)).catch(() => {});
          }
          api.getProductivitySummary().then(p => setStats(p.data)).catch(() => {});
        }

        if (callback) callback(res.response.text);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg = {
        _id: 'err-' + Date.now(),
        sender: 'alexa',
        text: `I encountered an issue processing your request: ${err.message}. Please check connection status.`,
        createdAt: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleClearChatHistory = async () => {
    try {
      const res = await api.clearChatHistory();
      if (res.welcomeMessage) {
        setChatMessages([res.welcomeMessage]);
      } else {
        setChatMessages([]);
      }
    } catch (err) {
      alert(`Failed to clear chat: ${err.message}`);
    }
  };

  // Dashboard Prompt Shortcuts
  const handlePromptChat = (promptText) => {
    setInitialChatPrompt(promptText);
    setActiveTab('chat');
  };

  // Voice Command Handler
  const handleVoiceCommand = (commandText, callback) => {
    handleSendMessage(commandText, callback);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      
      {/* Top Navigation */}
      <Navbar
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAlexaModal={() => setIsAlexaModalOpen(true)}
        dbStatus={dbStatus}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab === 'alexa') {
              setIsAlexaModalOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          stats={stats}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Viewport / Dynamic Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <Dashboard
              stats={stats}
              tasks={tasks}
              devices={devices}
              onToggleTask={handleToggleTask}
              onTriggerScene={handleTriggerScene}
              onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
              onNavigateTab={(tab) => {
                if (tab === 'alexa') setIsAlexaModalOpen(true);
                else setActiveTab(tab);
              }}
              onPromptChat={handlePromptChat}
              userName={userName}
            />
          )}

          {activeTab === 'chat' && (
            <ChatInterface
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              onClearHistory={handleClearChatHistory}
              isLoading={isChatLoading}
              initialPrompt={initialChatPrompt}
              onActionClick={(actionObj) => {
                if (actionObj.action === 'view_tasks') setActiveTab('tasks');
                else if (actionObj.action === 'view_home') setActiveTab('home');
                else if (actionObj.action === 'view_analytics') setActiveTab('analytics');
                else if (actionObj.action === 'open_alexa_modal') setIsAlexaModalOpen(true);
                else handleSendMessage(actionObj.label);
              }}
            />
          )}

          {activeTab === 'tasks' && (
            <TaskManager
              tasks={tasks}
              isLoading={isLoadingTasks}
              error={tasksError}
              onCreateTask={handleCreateTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onToggleTask={handleToggleTask}
              onRetry={loadAllData}
            />
          )}

          {activeTab === 'home' && (
            <SmartHome
              devices={devices}
              onUpdateDeviceState={handleUpdateDeviceState}
              onTriggerScene={handleTriggerScene}
              isLoading={isLoadingTasks}
            />
          )}

          {activeTab === 'analytics' && (
            <ProductivityAnalytics
              stats={stats}
              tasks={tasks}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onDispatchVoiceCommand={handleVoiceCommand}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userName={userName}
        setUserName={setUserName}
        dbStatus={dbStatus}
        onRefreshData={loadAllData}
      />

      <AlexaIntegrationModal
        isOpen={isAlexaModalOpen}
        onClose={() => setIsAlexaModalOpen(false)}
      />

    </div>
  );
}
