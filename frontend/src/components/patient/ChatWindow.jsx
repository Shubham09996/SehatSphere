import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Paperclip, Mic, StopCircle } from 'lucide-react';
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
            <div className={`max-w-xs px-4 py-2 rounded-2xl shadow-md ${isBot ? 'bg-muted rounded-bl-none' : 'bg-primary text-primary-foreground rounded-br-none'}`}>
                <p className="text-sm whitespace-pre-line">{message.text}</p>
                <div className={`mt-1 text-[10px] ${isBot ? 'text-muted-foreground' : 'text-primary-foreground/80'} text-right`}>
                    {timeLabel}
                </div>
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

const ChatWindow = ({
    onClose,
    messages,
    onSendMessage,
    onFileChange,
    onLanguageChange,
    selectedLanguage,
    isTypingExternal,
    onVoiceInputToggle,
    isListening,
    recognizedText,
}) => {
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    useEffect(() => {
        if (typeof isTypingExternal === 'boolean') setIsTyping(isTypingExternal);
    }, [isTypingExternal]);

    useEffect(() => {
        if (recognizedText && !isListening) setInput(recognizedText);
    }, [recognizedText, isListening]);

    const handleSend = () => {
        if (input.trim() || selectedFile) {
            onSendMessage(input.trim(), selectedFile);
            setInput('');
            setSelectedFile(null);
            setPreviewUrl(null);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            onFileChange(file);

            // Image preview (for png/jpg/jpeg)
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = () => setPreviewUrl(reader.result);
                reader.readAsDataURL(file);
            } else {
                setPreviewUrl(null);
            }
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    return (
        <div className="bg-card rounded-xl border border-border shadow-2xl flex flex-col w-full h-full">
            {/* Header */}
            <div className="p-4 flex justify-between items-center border-b border-border">
                <h3 className="font-bold text-lg text-foreground">Health Assistant</h3>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-muted">
                    <X size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map((msg) => (
                    <ChatBubble key={msg.id} message={{ ...msg, onSuggestionClick: (s) => onSendMessage(s) }} />
                ))}
                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5">
                        {[0, 0.1, 0.2].map((d, i) => (
                            <motion.div
                                key={i}
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity, delay: d }}
                                className="w-2 h-2 bg-muted-foreground rounded-full"
                            />
                        ))}
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* File Preview (ChatGPT-style) */}
            {selectedFile && (
                <div className="flex items-center gap-3 bg-muted/30 border-t border-border px-4 py-2 relative">
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="preview"
                            className="w-12 h-12 object-cover rounded-md"
                        />
                    ) : (
                        <div className="w-12 h-12 bg-muted flex items-center justify-center text-muted-foreground text-lg font-semibold rounded-md">
                            📄
                        </div>
                    )}
                    <div className="flex flex-col text-sm text-foreground truncate">
                        <span className="font-semibold truncate max-w-[180px]">{selectedFile.name}</span>
                        <span className="text-xs text-muted-foreground">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                        </span>
                    </div>
                    <button
                        onClick={removeFile}
                        className="absolute right-3 top-2 bg-background border border-border rounded-full p-1 hover:bg-red-500 hover:text-white transition"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}

            {/* Input Area */}
            <div className="flex items-center p-4 border-t border-border bg-background">
                <button onClick={() => fileInputRef.current.click()} className="p-2 text-muted-foreground hover:text-primary">
                    <Paperclip size={20} />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
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
                >
                    {isListening ? <StopCircle size={20} /> : <Mic size={20} />}
                </button>
                <button onClick={handleSend} className="p-2 text-primary m-1 rounded-full hover:bg-primary/10 flex-shrink-0">
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
