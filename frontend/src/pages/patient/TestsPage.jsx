import React, { useState } from 'react';
import { Search, FlaskConical, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BookedTestsResults from '../../components/tests/BookedTestsResults';
import TestReportsResults from '../../components/tests/TestReportsResults';

const tabs = [
    { id: 'booked', label: 'Booked Tests', icon: FlaskConical },
    { id: 'reports', label: 'Test Reports', icon: FileText },
];

const TestsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('booked');

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header and Search Bar */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">Diagnostic Tests</h1>
                <p className="text-muted-foreground mt-2">View your booked tests and test reports.</p>
                <div className="relative mt-6 max-w-2xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Search tests, labs, or reference numbers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-card border-2 border-border rounded-full pl-12 pr-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Animated Tabs */}
            <div className="flex justify-center mb-8">
                <div className="flex space-x-2 p-1 bg-muted rounded-full">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {activeTab === tab.id && (
                                <motion.div layoutId="tab-indicator" className="absolute inset-0 bg-background rounded-full shadow-sm" />
                            )}
                            <span className="relative z-10 flex items-center gap-2"><tab.icon size={16}/> {tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Section */}
            <div>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'booked' ? (
                            <BookedTestsResults searchTerm={searchTerm} />
                        ) : (
                            <TestReportsResults searchTerm={searchTerm} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TestsPage;



