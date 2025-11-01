import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import ChatWindow from './ChatWindow';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [isListening, setIsListening] = useState(false);
    const [recognizedText, setRecognizedText] = useState('');
    const navigate = useNavigate();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionRef = useRef(null);

    useEffect(() => {
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';

            recognitionRef.current.onstart = () => setIsListening(true);
            recognitionRef.current.onend = () => setIsListening(false);
            recognitionRef.current.onerror = (e) => {
                console.error('Speech recognition error:', e.error);
                setIsListening(false);
            };
            recognitionRef.current.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript + ' ';
                    }
                }
                if (finalTranscript.trim()) setRecognizedText(finalTranscript.trim());
            };
        }
    }, [selectedLanguage]);

    const onVoiceInputToggle = () => {
        if (!recognitionRef.current) return alert('Speech recognition not supported');
        isListening ? recognitionRef.current.stop() : recognitionRef.current.start();
    };

    const getBotResponse = useCallback(async (userMessage, file, language) => {
        try {
            setIsBotTyping(true);
            const formData = new FormData();
            formData.append('message', userMessage);
            formData.append('language', language);
            if (file) formData.append('file', file);

            const res = await api.post('/api/gemini/chat', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const text = res.data.response;
            if (userMessage.toLowerCase().includes('appointment'))
                return { text, action: () => navigate('/patient/appointments') };
            if (userMessage.toLowerCase().includes('medicine'))
                return { text, action: () => navigate('/patient/medicine-finder') };
            if (userMessage.toLowerCase().includes('record'))
                return { text, action: () => navigate('/patient/health-records') };
            return { text };
        } catch (err) {
            console.error('Chatbot error:', err);
            return { text: 'Sorry, I am having trouble connecting right now.' };
        } finally {
            setSelectedFile(null);
        }
    }, [navigate]);

    const handleSendMessage = (text, file) => {
        if (!text && !file) return;
        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text: file ? `[File: ${file.name}] ${text}` : text,
            createdAt: Date.now(),
        };
        setMessages((prev) => [...prev, userMsg]);

        (async () => {
            const botResp = await getBotResponse(text, file, selectedLanguage);
            const botMsg = {
                id: Date.now() + 1,
                sender: 'bot',
                text: botResp.text,
                createdAt: Date.now(),
            };
            setMessages((prev) => [...prev, botMsg]);
            setTimeout(() => setIsBotTyping(false), 200);

            if (botResp.action) {
                setTimeout(() => {
                    botResp.action();
                    setIsOpen(false);
                }, 1000);
            }
        })();
    };

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            (async () => {
                setIsBotTyping(true);
                const res = await getBotResponse('Hello', null, selectedLanguage);
                setMessages([
                    {
                        id: Date.now(),
                        sender: 'bot',
                        text: res.text,
                        suggestions: ['Book an Appointment', 'Find a Medicine', 'View My Records'],
                    },
                ]);
                setIsBotTyping(false);
            })();
        }
    }, [isOpen, messages.length, getBotResponse, selectedLanguage]);

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white p-4 rounded-full shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <MessageSquare size={24} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                        className="fixed bottom-24 left-4 right-4 z-50 w-auto h-[60vh] md:left-auto md:w-[450px] md:h-[70vh] md:right-6 lg:left-auto lg:w-[500px] lg:h-[80vh] lg:right-6"
                    >
                        <ChatWindow
                            onClose={() => setIsOpen(false)}
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            onFileChange={(file) => setSelectedFile(file)}
                            onLanguageChange={setSelectedLanguage}
                            selectedLanguage={selectedLanguage}
                            isTypingExternal={isBotTyping}
                            onVoiceInputToggle={onVoiceInputToggle}
                            isListening={isListening}
                            recognizedText={recognizedText}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
