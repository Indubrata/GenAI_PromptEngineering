import { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import './AIChatSidebar.css';

export default function AIChatSidebar({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hi! I am your AI career coach. Need help optimizing a specific bullet point?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    // Simulate AI streaming response
    setTimeout(() => {
      setIsTyping(false);
      setMessages([...newMessages, { 
        role: 'ai', 
        content: 'That sounds like a great achievement. To make it more ATS-friendly, try quantifying it. For example: "Increased sales by 15% over 6 months by implementing X."' 
      }]);
    }, 1500);
  };

  return (
    <div className={`ai-chat-sidebar ${isOpen ? 'is-open' : ''}`}>
      <div className="ai-chat-sidebar__header">
        <div className="ai-chat-sidebar__title">
          <Icon icon="ph:robot-bold" width="20" /> AI Coach
        </div>
        <button className="icon-btn" onClick={onClose} aria-label="Close Chat">
          <Icon icon="ph:x-bold" width="20" />
        </button>
      </div>

      <div className="ai-chat-sidebar__messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-bubble chat-bubble--${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {isTyping && (
          <div className="chat-bubble chat-bubble--ai typing-indicator">
            <span></span><span></span><span></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="ai-chat-sidebar__input-area" onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for advice..."
          className="chat-input"
        />
        <button type="submit" className="chat-submit" disabled={!input.trim()}>
          <Icon icon="ph:paper-plane-right-fill" width="20" />
        </button>
      </form>
    </div>
  );
}
