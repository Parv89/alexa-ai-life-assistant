import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Radio,
  ArrowRight
} from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export default function VoiceAssistantModal({ 
  isOpen, 
  onClose, 
  onDispatchVoiceCommand 
}) {
  const [lastAlexaReply, setLastAlexaReply] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    isSupported,
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    speak,
  } = useSpeechRecognition();

  // Auto-start listening on open
  useEffect(() => {
    if (isOpen && isSupported) {
      setLastAlexaReply('');
      resetTranscript();
      startListening();
    }
    return () => {
      stopListening();
    };
  }, [isOpen, isSupported]);

  if (!isOpen) return null;

  const handleSendTranscript = (textToSend) => {
    const query = textToSend || transcript;
    if (!query.trim()) return;

    setIsProcessing(true);
    stopListening();

    onDispatchVoiceCommand(query.trim(), (reply) => {
      setIsProcessing(false);
      setLastAlexaReply(reply);
      speak(reply);
    });
  };

  const handleManualStopAndSend = () => {
    if (transcript.trim()) {
      handleSendTranscript(transcript);
    } else {
      stopListening();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel w-full max-w-lg p-6 sm:p-8 flex flex-col items-center text-center space-y-6 border-[rgba(0,240,255,0.4)] shadow-[0_30px_90px_rgba(0,0,0,0.8)] relative animate-fade-in">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold mb-2">
            <Radio size={12} className="animate-pulse" />
            <span>Alexa Voice Interface</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">Voice Command Portal</h2>
        </div>

        {/* Glowing Alexa Halo Ring with interactive states */}
        <div className="py-4">
          <div 
            onClick={isListening ? handleManualStopAndSend : startListening}
            className={`w-32 h-32 rounded-full cursor-pointer flex items-center justify-center transition-all duration-500 alexa-halo ${
              isListening ? 'listening scale-105' : 'hover:scale-105'
            }`}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-inner">
              {isListening ? (
                <div className="audio-waveform scale-125">
                  <span className="audio-bar"></span>
                  <span className="audio-bar"></span>
                  <span className="audio-bar"></span>
                  <span className="audio-bar"></span>
                  <span className="audio-bar"></span>
                </div>
              ) : isProcessing ? (
                <Sparkles size={32} className="text-cyan-200 animate-spin" />
              ) : (
                <Mic size={32} className="text-white" />
              )}
            </div>
          </div>
        </div>

        {/* Status text */}
        <div className="space-y-1 max-w-sm">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            {isListening 
              ? 'Listening... Speak your command' 
              : isProcessing 
                ? 'Processing Intent with Alexa Engine...' 
                : lastAlexaReply 
                  ? 'Directive Executed' 
                  : 'Tap ring to begin speaking'}
          </p>

          {/* Transcript / Result Box */}
          <div className="min-h-[50px] p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center">
            {transcript ? (
              <p className="text-sm font-semibold text-white italic">"{transcript}"</p>
            ) : lastAlexaReply ? (
              <p className="text-xs text-cyan-300 leading-relaxed font-sans">{lastAlexaReply}</p>
            ) : (
              <p className="text-xs text-slate-500">
                {isSupported ? 'e.g., "What are my tasks today?", "Turn on lights"' : 'Speech recognition not supported in this browser'}
              </p>
            )}
          </div>
        </div>

        {/* Warning if speech error */}
        {error && (
          <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/50 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-3 w-full">
          {isListening ? (
            <button
              onClick={handleManualStopAndSend}
              className="btn-primary w-full text-xs"
            >
              <span>Done Speaking (Execute)</span>
            </button>
          ) : (
            <button
              onClick={startListening}
              className="btn-primary w-full text-xs"
            >
              <Mic size={15} />
              <span>Listen Again</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="btn-secondary text-xs px-4"
          >
            Close
          </button>
        </div>

        {/* Quick Suggested Queries */}
        <div className="w-full pt-3 border-t border-slate-800/80 text-left space-y-1.5">
          <p className="text-[11px] font-mono text-slate-400 uppercase font-bold">Suggested Voice Commands:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {[
              'What are my urgent tasks?',
              'Add task test voice assistant',
              'Activate Movie Night scene',
              'Give me my daily briefing',
            ].map((cmd, i) => (
              <button
                key={i}
                onClick={() => handleSendTranscript(cmd)}
                className="text-left text-[11px] p-2 rounded-lg bg-slate-900/60 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all flex items-center justify-between"
              >
                <span>"{cmd}"</span>
                <ArrowRight size={11} className="opacity-50" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
