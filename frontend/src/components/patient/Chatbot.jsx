import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Mic, StopCircle } from 'lucide-react'; // Import Mic and StopCircle
import ChatWindow from './ChatWindow';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api'; // Import the configured axios instance

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [isListening, setIsListening] = useState(false); // New state for voice input
    const navigate = useNavigate();

    // Speech Recognition API setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionRef = useRef(null);

    useEffect(() => {
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false; // Listen for single utterance
            recognitionRef.current.interimResults = true; // Show interim results
            recognitionRef.current.lang = selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';

            recognitionRef.current.onstart = () => {
                setIsListening(true);
            };

            recognitionRef.current.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }
                // Update the input field with the transcribed text
                // We need a way to pass this back to ChatWindow input
                // For now, let's just log it
                console.log('Interim:', interimTranscript);
                console.log('Final:', finalTranscript);

                // If there's final transcript, set it to the input field
                if (finalTranscript) {
                    // This will be passed to ChatWindow to update its input
                    setRecognizedText(finalTranscript.trim());
                }
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };
        }
    }, [SpeechRecognition, selectedLanguage]); // Re-initialize if language changes

    const onVoiceInputToggle = () => {
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            if (recognitionRef.current) {
                recognitionRef.current.start();
            } else {
                alert('Speech recognition is not supported in this browser.');
            }
        }
    };

    const [recognizedText, setRecognizedText] = useState(''); // New state to hold recognized text

    useEffect(() => {
        if (recognizedText) {
            // When recognizedText is updated, we need to pass it to ChatWindow's input.
            // This will be handled by ChatWindow's useEffect and setInput
        }
    }, [recognizedText]);

    const getBotResponse = useCallback(async (userMessage, file, language) => {
        try {
            setIsBotTyping(true); // Set typing indicator to true before API call
            const formData = new FormData();
            formData.append('message', userMessage);
            formData.append('language', language);
            if (file) {
                formData.append('file', file);
            }

            const response = await api.post('/api/gemini/chat', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const data = response.data; // Axios automatically parses JSON

            // Basic keyword-based actions for navigation, can be enhanced with NLU from Gemini if needed
            if (userMessage.toLowerCase().includes('appointment')) {
                return { text: data.response, action: () => navigate('/patient/appointments') };
            }
            if (userMessage.toLowerCase().includes('medicine') || userMessage.toLowerCase().includes('find')) {
                return { text: data.response, action: () => navigate('/patient/medicine-finder') };
            }
            if (userMessage.toLowerCase().includes('record') || userMessage.toLowerCase().includes('report')) {
                return { text: data.response, action: () => navigate('/patient/health-records') };
            }
            return { text: data.response };
        } catch (error) {
            console.error('Error fetching chatbot response:', error);
            const errorMessage = error.response?.data?.error || 'Sorry, I am having trouble connecting right now. Please try again later.';
            return { text: errorMessage };
        } finally {
            // setIsBotTyping(false); // Removed: now handled in handleSendMessage after render
            setSelectedFile(null); // Clear file input after sending
        }
    }, [navigate]); // Added navigate to dependencies

    const handleSendMessage = (text) => {
        if (!text && !selectedFile) {
            return; // Don't send empty messages without a file
        }
        let messageText = text;
        if (selectedFile) {
            messageText = `[File: ${selectedFile.name}] ${text}`.trim();
        }
        const userMessage = { id: Date.now(), sender: 'user', text: messageText, createdAt: Date.now() };
        setMessages(prev => [...prev, userMessage]);

        // Simulate bot thinking and responding
        setIsBotTyping(true);
        // Removed setTimeout to keep typing indicator until response
        (async () => {
            const botResponse = await getBotResponse(text, selectedFile, selectedLanguage);
            const newBotMessage = {
                id: Date.now() + 1,
                sender: 'bot',
                createdAt: Date.now(),
                ...botResponse
            };
            setMessages(prev => [...prev, newBotMessage]);
            // Add a small delay to ensure message renders before hiding typing indicator
            setTimeout(() => setIsBotTyping(false), 200);
            
            // If the bot response has an action, execute it
            if (botResponse.action) {
                setTimeout(() => {
                     botResponse.action();
                     setIsOpen(false); // Close chat after navigation
                }, 1000);
            }

        })();
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Initial welcome message when chat opens for the first time (personalized)
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const fetchWelcomeMessage = async () => {
                setIsBotTyping(true);
                const botResponse = await getBotResponse("Hello", null, selectedLanguage);
                setMessages([
                    { 
                        id: Date.now(), 
                        sender: 'bot', 
                        text: botResponse.text,
                        suggestions: ['Book an Appointment', 'Find a Medicine', 'View My Records']
                    }
                ]);
                setIsBotTyping(false);
            };
            fetchWelcomeMessage();
        }
    }, [isOpen, messages.length, getBotResponse, selectedLanguage]);

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white p-4 rounded-full shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <MessageSquare size={24} />
            </motion.button>

            {/* Chat Window */}
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
                            isTyping={isBotTyping}
                            onFileChange={handleFileChange}
                            onLanguageChange={setSelectedLanguage}
                            selectedLanguage={selectedLanguage}
                            onVoiceInputToggle={onVoiceInputToggle} // Pass the toggle function
                            isListening={isListening} // Pass the listening state
                            recognizedText={recognizedText} // Pass recognized text
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;