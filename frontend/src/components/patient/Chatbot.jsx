import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';
import ChatWindow from './ChatWindow';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api'; // Import the configured axios instance

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const navigate = useNavigate();

    const getBotResponse = useCallback(async (userMessage) => {
        try {
            setIsBotTyping(true); // Set typing indicator to true before API call
            const response = await api.post('/api/gemini/chat', { message: userMessage });
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
            return { text: 'Sorry, I am having trouble connecting right now. Please try again later.' };
        } finally {
            setIsBotTyping(false); // Set typing indicator to false after API call (success or error)
        }
    }, [navigate]); // Added navigate to dependencies

    const handleSendMessage = (text) => {
        const userMessage = { id: Date.now(), sender: 'user', text, createdAt: Date.now() };
        setMessages(prev => [...prev, userMessage]);

        // Simulate bot thinking and responding
        setIsBotTyping(true);
        setTimeout(async () => { // Made this async to await getBotResponse
            const botResponse = await getBotResponse(text);
            const newBotMessage = {
                id: Date.now() + 1,
                sender: 'bot',
                createdAt: Date.now(),
                ...botResponse
            };
            setMessages(prev => [...prev, newBotMessage]);
            setIsBotTyping(false);
            
            // If the bot response has an action, execute it
            if (botResponse.action) {
                setTimeout(() => {
                     botResponse.action();
                     setIsOpen(false); // Close chat after navigation
                }, 1000);
            }

        }, 1500); // 1.5 second delay
    };

    // Initial welcome message when chat opens for the first time (personalized)
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const fetchWelcomeMessage = async () => {
                setIsBotTyping(true);
                const botResponse = await getBotResponse("Hello"); // Send a dummy message to get initial greeting
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
    }, [isOpen, messages.length, getBotResponse]);

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
                        className="fixed bottom-24 right-6 z-50 w-full max-w-sm"
                    >
                        <ChatWindow 
                            onClose={() => setIsOpen(false)} 
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            isTyping={isBotTyping}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;