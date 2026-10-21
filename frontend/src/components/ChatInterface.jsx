import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Trash2, 
  Sparkles, 
  Bot, 
  User, 
  CheckCircle2, 
  Home, 
  ArrowRight,
  RefreshCw,
  Info
} from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export default function ChatInterface({ 
  messages = [], 
  onSendMessage, 
  onClearHistory, 
  isLoading, 
  onActionClick,
  initialPrompt = ''
}) {
  const [inputText, setInputText] = useState('');
  const [autoSpeak, setAutoSpeak] = useState(false);
  const messagesEndRef = useRef(null);

  const {
    isSupported: speechSupported,
    isListening,
    transcript,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
    speak,
  } = useSpeechRecognition();

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // When speech transcript changes, sync with input
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  // Handle initial prompt from dashboard
  useEffect(() => {
    if (initialPrompt) {
      setInputText(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const query = inputText.trim();
    setInputText('');
    resetTranscript();

    onSendMessage(query, (replyText) => {
      if (autoSpeak && replyText) {
        speak(replyText);
      }
    });
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
      if (transcript.trim()) {
        handleSubmit();
      }
    } else {
      startListening();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[550px] max-w-5xl mx-auto glass-panel overflow-hidden border-[rgba(0,240,255,0.2)] animate-fade-in shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900/80 border-b border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center p-0.5 shadow-[0_0_12px_rgba(0,240,255,0.4)]">
            <Bot size={20} className="text-white" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-950 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Alexa AI Assistant</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                Intent Engine v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Context-Aware Life Assistant & Smart Space Controller</p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {/* Auto-Speak Toggle */}
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              autoSpeak 
                ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]' 
                : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
            }`}
            title="Read assistant replies using Web Speech Synthesis"
          >
            {autoSpeak ? <Volume2 size={14} className="text-cyan-400" /> : <VolumeX size={14} />}
            <span className="hidden sm:inline">Voice Speech</span>
          </button>

          {/* Clear History */}
          <button
            onClick={onClearHistory}
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-rose-950/40 hover:text-rose-400 text-slate-400 border border-slate-700/60 hover:border-rose-500/30 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              <Sparkles size={28} />
            </div>
            <h3 className="text-base font-bold text-white">How may I assist you today?</h3>
            <p className="text-xs text-slate-400 max-w-md">
              Ask about your schedule, create new tasks, control simulated smart devices, or request a complete life briefing.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isAlexa = msg.sender === 'alexa';
            return (
              <div
                key={msg._id || index}
                className={`flex gap-3 max-w-3xl ${isAlexa ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                  isAlexa 
                    ? 'bg-gradient-to-tr from-cyan-500 to-purple-600 text-white shadow-[0_0_10px_rgba(0,240,255,0.3)]' 
                    : 'bg-slate-800 border border-slate-700 text-cyan-300'
                }`}>
                  {isAlexa ? <Sparkles size={14} /> : <User size={14} />}
                </div>

                {/* Message Bubble */}
                <div className={`space-y-2 max-w-[85%] ${isAlexa ? 'text-left' : 'text-right'}`}>
                  <div className={`inline-block p-4 rounded-2xl text-sm leading-relaxed text-left ${
                    isAlexa
                      ? 'bg-slate-900/90 text-slate-100 border border-slate-800 shadow-md'
                      : 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white border border-purple-400/30 shadow-lg'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    
                    {/* Alexa Action Executed Card */}
                    {isAlexa && msg.metadata?.type === 'TASK_CREATED' && (
                      <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
                        <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-emerald-200">Task Synced to Database</p>
                          <p className="text-slate-400">"{msg.metadata.task?.title}" ({msg.metadata.task?.priority} priority)</p>
                        </div>
                      </div>
                    )}

                    {isAlexa && msg.metadata?.type === 'SCENE_ACTIVATED' && (
                      <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex items-center gap-2.5 text-xs text-cyan-300">
                        <Home size={16} className="text-cyan-400 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-cyan-200">Smart Home Scene Triggered</p>
                          <p className="text-slate-400">Virtual IoT endpoints updated to: {msg.metadata.scene}</p>
                        </div>
                      </div>
                    )}

                    {/* Speech Speak Button on Alexa Bubble */}
                    {isAlexa && (
                      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-mono text-[10px] uppercase text-cyan-400/70">
                          {msg.intent || 'Verified Response'}
                        </span>
                        <button
                          onClick={() => speak(msg.text)}
                          className="hover:text-cyan-300 flex items-center gap-1 transition-colors"
                          title="Play audio speech"
                        >
                          <Volume2 size={12} />
                          <span>Speak</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Suggested Actions Chips */}
                  {isAlexa && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestedActions.map((act, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => {
                            if (onActionClick) onActionClick(act);
                            else setInputText(act.label);
                          }}
                          className="text-xs px-3 py-1 rounded-full bg-slate-900/80 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-1"
                        >
                          <span>{act.label}</span>
                          <ArrowRight size={11} className="opacity-60" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Timestamp */}
                  <p className="text-[10px] text-slate-500 font-mono px-1">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </p>
                </div>
              </div>
            );
          })
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 items-center mr-auto animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-slate-900 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Sparkles size={14} className="animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-cyan-300 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Alexa is evaluating intent & executing directives...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Warning if speech error occurs */}
      {speechError && (
        <div className="px-4 py-2 bg-rose-950/50 border-t border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
          <Info size={14} className="flex-shrink-0" />
          <span>{speechError}</span>
        </div>
      )}

      {/* Voice Listening Active Waveform Bar */}
      {isListening && (
        <div className="px-6 py-2.5 bg-cyan-950/60 border-t border-cyan-500/40 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="audio-waveform">
              <span className="audio-bar"></span>
              <span className="audio-bar"></span>
              <span className="audio-bar"></span>
              <span className="audio-bar"></span>
              <span className="audio-bar"></span>
            </div>
            <span className="text-xs font-semibold text-cyan-300 font-mono">
              Listening... Speak your command (e.g. "Add task finalize hackathon presentation")
            </span>
          </div>

          <button
            onClick={stopListening}
            className="text-xs font-semibold text-rose-300 hover:text-white px-2.5 py-1 rounded-md bg-rose-900/40 border border-rose-700/50"
          >
            Stop
          </button>
        </div>
      )}

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2 sm:gap-3">
        {/* Mic Toggle Button */}
        <button
          type="button"
          onClick={toggleMic}
          disabled={!speechSupported}
          className={`p-3 rounded-xl border transition-all ${
            isListening 
              ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse' 
              : speechSupported
                ? 'bg-slate-800/80 hover:bg-cyan-950/40 border-slate-700 hover:border-cyan-500/40 text-cyan-400'
                : 'bg-slate-800/30 border-slate-800 text-slate-600 cursor-not-allowed'
          }`}
          title={speechSupported ? (isListening ? 'Stop listening' : 'Start voice input') : 'Voice input not supported in this browser'}
          aria-label="Voice input microphone"
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Alexa: 'What is my schedule?', 'Add task...', 'Turn on lights'..."
          className="input-field flex-1"
          disabled={isLoading}
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="btn-primary px-4 py-2.5"
          aria-label="Send message"
        >
          <Send size={16} />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>

    </div>
  );
}
