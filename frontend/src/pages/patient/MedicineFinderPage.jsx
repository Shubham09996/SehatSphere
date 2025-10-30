import React, { useState } from 'react';
import { Search, Globe, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import OnlineResults from '../../components/medicine-finder/OnlineResults';
import OfflineResults from '../../components/medicine-finder/OfflineResults';

const tabs = [
    { id: 'online', label: 'Online Search', icon: Globe },
    { id: 'offline', label: 'Offline Shops', icon: Store },
];

const MedicineFinderPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('online');

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header and Search Bar */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">Find Your Medicine</h1>
                <p className="text-muted-foreground mt-2">Search online platforms or find in nearby affiliated stores.</p>
                <div className="relative mt-6 max-w-2xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Search for any medicine..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        // === IS LINE MEIN FOCUS KA COLOR CHANGE KIYA HAI ===
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
                        {activeTab === 'online' ? (
                            <OnlineResults searchTerm={searchTerm} />
                        ) : (
                            <OfflineResults searchTerm={searchTerm} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MedicineFinderPage;