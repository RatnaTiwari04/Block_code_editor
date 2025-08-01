import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

// Gemini API configuration - Updated to use environment variable for Create React App
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// Debug logging (remove in production)
console.log('API Key loaded:', GEMINI_API_KEY ? 'Yes' : 'No');
console.log('API Key (first 10 chars):', GEMINI_API_KEY?.substring(0, 10));

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hello! I'm your AI assistant. How can I help you with your block coding today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue.trim();
    setInputValue('');
    setIsTyping(true);

    try {
      // Call Gemini API
      const response = await callGeminiAPI(currentInput);
      const botMessage = {
        id: Date.now() + 1,
        content: response,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage = {
        id: Date.now() + 1,
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const callGeminiAPI = async (message) => {
    // Check if API key exists
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not found. Please check your .env file and ensure REACT_APP_GEMINI_API_KEY is set.');
    }

    const systemPrompt = `You are a helpful AI assistant for a block-based code editor (similar to Scratch). You help users understand:
    - How to use visual programming blocks
    - Code generation from blocks
    - Programming concepts in JavaScript, Python, Java, C++, and C
    - Debugging and troubleshooting
    - Best practices in programming
    
    The editor allows users to drag blocks to build programs visually. Be concise, helpful, and focus on practical coding assistance. If asked about blocks, assume they're visual programming elements.`;

    const requestBody = {
      contents: [{
        parts: [{
          text: `${systemPrompt}\n\nUser question: ${message}`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    console.log('Making API request to:', GEMINI_API_URL);
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('API Response status:', response.status);
    console.log('API Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response data:', data);
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from Gemini API');
    }
  };

  const generateResponse = (message) => {
    if (message.includes('block') || message.includes('drag')) {
      return "Great! You can drag blocks from the left sidebar to start building your program. Try starting with a 'Variable' or 'Print' block!";
    }
    
    if (message.includes('code') || message.includes('generate')) {
      return "The generated code appears in the right panel. You can see it update in real-time as you add and modify blocks!";
    }
    
    if (message.includes('run') || message.includes('execute')) {
      return "Click the '▶️ Run Code' button to execute your program. The output will appear in the console below the code editor.";
    }
    
    if (message.includes('save') || message.includes('project')) {
      return "Don't forget to give your project a title and click '💾 Save Project' to save your work!";
    }
    
    if (message.includes('language') || message.includes('javascript') || message.includes('python')) {
      return "You can switch between different programming languages using the dropdown menu. The blocks will generate code in your selected language!";
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! I'm here to help you with block coding. What would you like to know about the editor?";
    }
    
    if (message.includes('help') || message.includes('how')) {
      return "I can help you with:\n• Using blocks and the canvas\n• Understanding generated code\n• Running and saving projects\n• Switching programming languages\n\nWhat specific help do you need?";
    }
    
    if (message.includes('clear') || message.includes('delete')) {
      return "You can clear all blocks using the 'Clear All' button, or delete individual blocks by selecting them and using the delete option.";
    }
    
    return "That's a great question! I'm here to help you with block coding. Try asking about blocks, code generation, running projects, or any specific features you'd like to know about.";
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      {/* Chat Button */}
      <button 
        className={`chat-button ${isOpen ? 'active' : ''}`}
        onClick={toggleChat}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3.04 1.05 4.35L1 22l5.65-2.05C8.96 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.4 0-2.76-.3-4.03-.85L6 20l.85-1.97C6.3 16.76 6 15.4 6 14c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
            <circle cx="9" cy="12" r="1"/>
            <circle cx="12" cy="12" r="1"/>
            <circle cx="15" cy="12" r="1"/>
          </svg>
        )}
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className="chat-widget">
          <div className="chat-header">
            <div className="chat-avatar">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
              </svg>
            </div>
            <div className="chat-info">
              <h3>Code Assistant</h3>
              <p>Online • Ready to help</p>
            </div>
            <div className="status-dot"></div>
          </div>

          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-avatar">
                  {message.sender === 'bot' ? (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
                    </svg>
                  )}
                </div>
                <div className="message-content">
                  {message.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-avatar">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
                  </svg>
                </div>
                <div className="typing-indicator">
                  <span>AI is typing</span>
                  <div className="typing-dots">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <div className="input-container">
              <textarea
                ref={inputRef}
                className="input-field"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about block coding..."
                rows="1"
              />
              <button 
                className="send-button" 
                onClick={sendMessage}
                disabled={!inputValue.trim()}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;