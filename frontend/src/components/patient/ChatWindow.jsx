import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Paperclip, Mic, StopCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Reusable Chat Bubble
const ChatBubble = ({ message }) => {
    const isBot = message.sender === 'bot';
    const ts = message.createdAt ? new Date(message.createdAt) : null;
    const timeLabel = ts ? ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    const formatBotMessage = (text) => {
        const parts = [];
        const lines = text.split('\n');
        let currentList = null;

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            const listItemMatch = trimmedLine.match(/^(\d+\.\s*\*\*)(.*?)(\*\*)?$/);

            if (listItemMatch) {
                if (!currentList) {
                    currentList = [];
                    parts.push(<ul key={`ul-${index}`} className="list-inside list-disc pl-5 space-y-2">{currentList}</ul>);
                }
                const listItemText = listItemMatch[2].trim();
                parts.push(<li key={`li-${index}`}><strong className="font-semibold">{listItemMatch[1].replace(/\*\*/g, '')}</strong>{listItemText}</li>);
            } else {
                if (currentList) {
                    currentList = null;
                }
                if (trimmedLine) {
                    parts.push(<p key={`p-${index}`} className="text-sm mb-2 last:mb-0">{trimmedLine}</p>);
                }
            }
        });

        return parts;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
        >
            <div className={`max-w-xs px-4 py-2 rounded-2xl shadow-md ${isBot ? 'bg-muted rounded-bl-none' : 'bg-primary text-primary-foreground rounded-br-none'}`}>
                {isBot ? (
                    <div className="text-sm">
                        {formatBotMessage(message.text)}
                    </div>
                ) : (
                    <p className="text-sm">{message.text}</p>
                )}
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
const ChatWindow = ({ onClose, messages, onSendMessage, onFileChange, onLanguageChange, selectedLanguage, isTypingExternal, onVoiceInputToggle, isListening, recognizedText }) => {
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, isTyping]);

    useEffect(() => {
        if (typeof isTypingExternal === 'boolean') {
            setIsTyping(isTypingExternal);
            return;
        }
        // Fallback behaviour if external control not provided - REMOVED
    }, [messages, isTypingExternal]);

    // Update input field with recognized speech
    useEffect(() => {
        if (recognizedText && !isListening) { // Only update if there's recognized text and we're not actively listening
            setInput(recognizedText);
        }
    }, [recognizedText, isListening]);

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
        <div className="bg-card rounded-xl border border-border shadow-2xl flex flex-col w-full h-full">
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
            <div className="flex items-center p-4 border-t border-border bg-background">
                <button
                    onClick={() => fileInputRef.current.click()}
                    className="p-2 text-muted-foreground hover:text-primary"
                    aria-label="Attach file"
                >
                    <Paperclip size={20} />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileChange}
                    className="hidden"
                    accept="application/pdf,image/jpeg,image/png,image/jpg"
                />
                 <select
                    onChange={(e) => onLanguageChange(e.target.value)}
                    value={selectedLanguage}
                    className="ml-2 p-2 text-sm bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary flex-shrink-0"
                >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                </select>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none min-w-0"
                />
                <button 
                    onClick={onVoiceInputToggle}
                    className={`p-2 m-1 rounded-full flex-shrink-0 ${isListening ? 'text-red-500 hover:bg-red-100' : 'text-muted-foreground hover:bg-muted'}`}
                    aria-label={isListening ? 'Stop recording' : 'Start recording'}
                >
                    {isListening ? <StopCircle size={20} /> : <Mic size={20} />}
                </button>
                <button onClick={handleSend} className="p-2 text-primary m-1 rounded-full hover:bg-primary/10 flex-shrink-0">
                    <Send size={20}/>
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;