import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './SpeechToTextDemo.css';

export default function SpeechToTextDemo() {
  const [savedNotes, setSavedNotes] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const languages = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'hi-IN', name: 'Hindi (India)', flag: '🇮🇳' },
    { code: 'gu-IN', name: 'Gujarati (India)', flag: '🇮🇳' },
    { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
    { code: 'de-DE', name: 'German', flag: '🇩🇪' },
    { code: 'zh-CN', name: 'Chinese (Mandarin)', flag: '🇨🇳' },
    { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦' }
  ];

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="container">
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <h2>Browser Not Supported</h2>
          <p>Your browser doesn't support speech recognition.</p>
          <p className="error-hint">Please use Chrome, Edge, or Safari for the best experience.</p>
        </div>
      </div>
    );
  }

  const handleStartRecording = () => {
    resetTranscript();
    SpeechRecognition.startListening({ 
      continuous: true, 
      language: selectedLanguage 
    });
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    SpeechRecognition.stopListening();
    setIsRecording(false);
  };

  const handleSaveNote = () => {
    if (transcript.trim()) {
      const newNote = {
        id: Date.now(),
        text: transcript,
        timestamp: new Date().toLocaleString(),
        language: languages.find(l => l.code === selectedLanguage)?.name || selectedLanguage
      };
      setSavedNotes([newNote, ...savedNotes]);
      resetTranscript();
    }
  };

  const handleDeleteNote = (id) => {
    setSavedNotes(savedNotes.filter(note => note.id !== id));
  };

  const handleClear = () => {
    resetTranscript();
  };

  const handleExportNotes = () => {
    const text = savedNotes.map(note => 
      `[${note.timestamp}] [${note.language}]\n${note.text}\n\n`
    ).join('---\n\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `executive-notes-${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">🎤</div>
            <div>
              <h1 className="app-title">Executive Voice Notes</h1>
              <p className="app-subtitle">Professional Speech-to-Text Solution</p>
            </div>
          </div>
          <div className="status-badge">
            <span className={`status-dot ${listening ? 'recording' : ''}`}></span>
            <span className="status-text">{listening ? 'Recording' : 'Ready'}</span>
          </div>
        </div>
      </header>

      <div className="container">
        {/* Main Recording Panel */}
        <div className="card main-card">
          <div className="card-header">
            <h2 className="card-title">Recording Panel</h2>
            <select 
              value={selectedLanguage} 
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="language-select"
              disabled={listening}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Control Buttons */}
          <div className="controls-grid">
            {!isRecording ? (
              <button onClick={handleStartRecording} className="btn btn-start">
                <svg className="btn-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
                Start Recording
              </button>
            ) : (
              <button onClick={handleStopRecording} className="btn btn-stop">
                <svg className="btn-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" />
                </svg>
                Stop Recording
              </button>
            )}
            <button onClick={handleClear} disabled={!transcript} className="btn btn-secondary">
              Clear
            </button>
            <button onClick={handleSaveNote} disabled={!transcript} className="btn btn-primary">
              💾 Save Note
            </button>
          </div>

          {/* Transcript Display */}
          <div className="transcript-container">
            <label className="transcript-label">Live Transcript:</label>
            <div className="transcript-box">
              {transcript || <span className="transcript-placeholder">Start speaking to see your words appear here in real-time...</span>}
            </div>
            {transcript && (
              <div className="word-count">
                Words: {transcript.split(' ').filter(w => w.trim()).length} | 
                Characters: {transcript.length}
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div className="info-panel">
            <div className="info-icon">💡</div>
            <div className="info-content">
              <h3>Quick Guide:</h3>
              <p>Select your language → Click Start → Speak clearly → Stop → Save your note</p>
            </div>
          </div>
        </div>

        {/* Saved Notes Section */}
        <div className="card notes-card">
          <div className="card-header">
            <div className="notes-header-left">
              <h2 className="card-title">Saved Notes</h2>
              <span className="notes-count">{savedNotes.length}</span>
            </div>
            {savedNotes.length > 0 && (
              <button onClick={handleExportNotes} className="btn btn-export">
                📥 Export All
              </button>
            )}
          </div>

          {savedNotes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No notes yet</h3>
              <p>Your saved voice notes will appear here</p>
            </div>
          ) : (
            <div className="notes-list">
              {savedNotes.map((note) => (
                <div key={note.id} className="note-item">
                  <div className="note-header">
                    <div className="note-meta">
                      <span className="note-time">🕐 {note.timestamp}</span>
                      <span className="note-lang">🌐 {note.language}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="btn-delete"
                      title="Delete note"
                    >
                      🗑️
                    </button>
                  </div>
                  <p className="note-text">{note.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="footer-info">
          <div className="feature-badges">
            <span className="badge">✅ Real-time Transcription</span>
            <span className="badge">🌍 Multi-language Support</span>
            <span className="badge">💾 Auto-save Feature</span>
            <span className="badge">📱 Mobile Ready</span>
          </div>
          <p className="browser-info">
            Browser: {navigator.userAgent.includes('Chrome') ? '✅ Chrome' : 
                     navigator.userAgent.includes('Safari') ? '✅ Safari' : 
                     navigator.userAgent.includes('Edge') ? '✅ Edge' : '⚠️ Other'}
          </p>
        </div>
      </div>
    </div>
  );
}