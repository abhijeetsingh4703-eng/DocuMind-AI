"use client";
import { useState, useRef, useEffect } from "react";
import "./globals.css";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hello! I am DocuMind AI. Upload a document to get started, and then ask me anything about it!" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setMessages([...messages, { role: "user", content: userMessage }]);
    setInputValue("");
    setIsTyping(true);
    
    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: "ai", content: data.response || data.detail || "Error occurred." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", content: "Error connecting to the backend. Is it running?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append("file", file);
      
      try {
        const response = await fetch("http://localhost:8000/upload", {
          method: "POST",
          body: formData,
        });
        
        const data = await response.json();
        
        if (response.ok) {
           setMessages(prev => [...prev, { role: "ai", content: `Successfully processed "${file.name}". You can now ask questions about it.` }]);
        } else {
           setMessages(prev => [...prev, { role: "ai", content: `Failed to process: ${data.detail}` }]);
        }
      } catch (error) {
        setMessages(prev => [...prev, { role: "ai", content: "Error uploading file. Make sure the backend server is running." }]);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="brand">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          DocuMind AI
        </div>
        
        <label className="upload-zone">
          <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleFileUpload} disabled={isUploading} />
          <div className="upload-icon">📄</div>
          <div style={{ fontWeight: 500, marginBottom: '8px' }}>
            {isUploading ? "Processing PDF..." : "Upload Document"}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Drag and drop a PDF, or click to browse
          </div>
        </label>

        <div style={{ flex: 1 }}></div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
          Powered by Llama 3 & LangChain
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-area">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.content}
            </div>
          ))}
          {isTyping && (
             <div className="message ai" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <span style={{ animation: 'bounce 1s infinite' }}>●</span>
                <span style={{ animation: 'bounce 1s infinite 0.2s' }}>●</span>
                <span style={{ animation: 'bounce 1s infinite 0.4s' }}>●</span>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <form className="input-box" onSubmit={handleSendMessage}>
            <input 
              type="text" 
              placeholder="Ask anything about your document..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" className="send-button" disabled={!inputValue.trim() || isTyping}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes bounce {
            0%, 100% { transform: translateY(0); opacity: 0.5; }
            50% { transform: translateY(-4px); opacity: 1; }
          }
        `}} />
      </div>
    </div>
  );
}
