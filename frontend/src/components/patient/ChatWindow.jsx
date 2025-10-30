import React, { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import { motion } from 'framer-motion';

// Reusable Chat Bubble
const ChatBubble = ({ message }) => {
    const isBot = message.sender === 'bot';
    const ts = message.createdAt ? new Date(message.createdAt) : null;
    const timeLabel = ts ? ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
        >
            <div className={`max-w-xs px-4 py-2 rounded-2xl ${isBot ? 'bg-muted rounded-bl-none' : 'bg-primary text-primary-foreground rounded-br-none'}`}>
                <p className="text-sm">{message.text}</p>
                <div className={`mt-1 text-[10px] ${isBot ? 'text-muted-foreground' : 'text-primary-foreground/80'} text-right`}>{timeLabel}</div>
                 {message.suggestions && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {message.suggestions.map((s, i) => (
                             <button 
                                key={i}
                                onClick={() => message.onSuggestionClick(s)}
                                className="px-3 py-1 text-xs font-semibold bg-background border border-border rounded-full hover:bg-primary/10"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// Main Chat Window
const ChatWindow = ({ onClose, messages, onSendMessage, isTypingExternal }) => {
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, isTyping]);

    useEffect(() => {
        if (typeof isTypingExternal === 'boolean') {
            setIsTyping(isTypingExternal);
            return;
        }
        // Fallback behaviour if external control not provided
        if (messages.length > 0 && messages[messages.length - 1].sender === 'user') {
            setIsTyping(true);
            const timer = setTimeout(() => setIsTyping(false), 1400);
            return () => clearTimeout(timer);
        }
    }, [messages, isTypingExternal]);

    const handleSend = () => {
        if (input.trim()) {
            onSendMessage(input.trim());
            setInput('');
        }
    };
    
    const handleSuggestionClick = (suggestion) => {
        onSendMessage(suggestion);
    };

    return (
        <div className="bg-card rounded-xl border border-border shadow-2xl flex flex-col h-[60vh]">
            {/* Header */}
            <div className="p-4 flex justify-between items-center border-b border-border">
                <h3 className="font-bold text-lg text-foreground">Health Assistant</h3>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-muted"><X size={20}/></button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map(msg => <ChatBubble key={msg.id} message={{ ...msg, onSuggestionClick: handleSuggestionClick }}/>)}
                {isTyping && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex items-center gap-1.5">
                        <motion.div animate={{y: [0,-4,0]}} transition={{duration:0.8, repeat: Infinity}} className="w-2 h-2 bg-muted-foreground rounded-full"/>
                        <motion.div animate={{y: [0,-4,0]}} transition={{duration:0.8, repeat: Infinity, delay: 0.1}} className="w-2 h-2 bg-muted-foreground rounded-full"/>
                        <motion.div animate={{y: [0,-4,0]}} transition={{duration:0.8, repeat: Infinity, delay: 0.2}} className="w-2 h-2 bg-muted-foreground rounded-full"/>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2 bg-muted rounded-lg">
                    <input 
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none"
                    />
                    <button onClick={handleSend} className="p-2 text-primary m-1 rounded-full hover:bg-primary/10">
                        <Send size={20}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;