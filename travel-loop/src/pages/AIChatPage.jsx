import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import './AIChatPage.css';

// Initialize Gemini (Will need VITE_GEMINI_API_KEY in .env)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

function AIChatPage() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !apiKey) return;

    const userText = input.trim();
    setInput('');
    
    // Add user message to UI
    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Setup Gemini Model
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash-latest"
      }, { apiVersion: 'v1' });

      // Prepare chat history for context
      const chatHistory = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const chat = model.startChat({
        history: chatHistory,
      });

      // Send Message
      const result = await chat.sendMessage(userText);
      const aiResponse = result.response.text();

      setMessages([...newMessages, { role: 'ai', content: aiResponse }]);

    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages([...newMessages, { role: 'ai', content: `**Error:** ${error.message || 'Unknown error occurred while connecting to Gemini.'}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-page-container">
      <div className="chat-header">
        <h1><Sparkles size={28} color="#38BDF8" /> {t('chatWelcomeTitle')}</h1>
        <p>{t('chatWelcomeSub')}</p>
      </div>

      <div className="chat-window">
        
        <div className="chat-messages">
          {messages.length === 0 && (
            <div style={{textAlign: 'center', color: '#94a3b8', marginTop: 'auto', marginBottom: 'auto'}}>
              <Bot size={48} style={{opacity: 0.5, marginBottom: '1rem'}} />
              <p>Start a conversation to plan your next adventure!</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`message-bubble ${msg.role}`}>
              {msg.role === 'ai' ? (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
          ))}

          {isLoading && (
            <div className="typing-indicator">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span style={{marginLeft: '8px'}}>{t('chatTyping')}</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          {!apiKey && (
            <div style={{color: '#ef4444', fontSize: '0.85rem', marginBottom: '0.5rem', textAlign: 'center'}}>
              Warning: VITE_GEMINI_API_KEY is missing from your .env file.
            </div>
          )}
          <form className="chat-input-wrapper" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chatPlaceholder')}
              disabled={isLoading || !apiKey}
            />
            <button type="submit" className="btn-send" disabled={!input.trim() || isLoading || !apiKey}>
              <Send size={18} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default AIChatPage;
