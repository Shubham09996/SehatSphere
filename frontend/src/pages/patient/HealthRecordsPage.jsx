import React, { useState, useMemo } from 'react';
import { healthRecordsData, vitalsData } from '../../data/healthRecordsData';
import { motion, AnimatePresence } from 'framer-motion';
import { ListFilter, Stethoscope, TestTube2, ShieldAlert, Syringe } from 'lucide-react';
import RecordDetailModal from '../../components/patient/RecordDetailModal';

// ... VitalsChart component remains in your codebase but is not used on this page ...

// Timeline Item Component
const TimelineItem = ({ record, isLast, onViewDetails }) => {
    const icons = {
        Consultation: <Stethoscope />, LabReport: <TestTube2 />,
        Allergy: <ShieldAlert />, Vaccination: <Syringe />,
    };
    
    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                {/* === ICON PAR GRADIENT LAGAYA HAI === */}
                <div className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white p-2 rounded-full z-10">
                    {icons[record.type] || <Stethoscope />}
                </div>
                {!isLast && <div className="w-px flex-1 bg-border -mt-1"></div>}
            </div>
            <motion.div className="flex-1 pb-8 md:w-11/12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="p-4 bg-card border border-border rounded-xl">
                    <p className="text-xs text-muted-foreground">{new Date(record.date).toDateString()}</p>
                    <h3 className="font-bold text-foreground mt-1">{record.title}</h3>
                    {record.type === 'Consultation' && <p className="text-sm text-muted-foreground mt-2 truncate">{record.details.summary}</p>}
                    <div className="mt-4">
                        {/* === VIEW DETAILS PAR GRADIENT LAGAYA HAI === */}
                        <button 
                            onClick={() => onViewDetails(record)} 
                            className="text-sm font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text"
                        >
                            View Details →
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};


const HealthRecordsPage = () => {
    const [filter, setFilter] = useState('All');
    const [selectedRecord, setSelectedRecord] = useState(null);
    const filters = ['All', 'Consultation', 'Lab Report', 'Allergy', 'Vaccination'];

    const filteredRecords = useMemo(() => {
        if (filter === 'All') return healthRecordsData;
        return healthRecordsData.filter(rec => rec.type.replace(/ /g, '') === filter.replace(/ /g, ''));
    }, [filter]);

    return (
        <div className="space-y-8 overflow-x-hidden">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">My Health Records</h1>
                <p className="text-muted-foreground mt-1">A chronological timeline of your health journey.</p>
            </div>

            <div>
                <div className="flex flex-wrap gap-2 mb-6 justify-center sm:justify-start">
                    {filters.map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-card'}`}>
                            {f}
                        </button>
                    ))}
                </div>
                <div>
                    {filteredRecords.length > 0 ? (
                        filteredRecords
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map((record, index) => (
                                <TimelineItem 
                                    key={record.id} 
                                    record={record} 
                                    isLast={index === filteredRecords.length - 1} 
                                    onViewDetails={setSelectedRecord}
                                />
                            ))
                    ) : (
                         <div className="text-center py-12 bg-card rounded-lg border border-dashed">
                             <h3 className="text-lg font-semibold text-foreground">No records found</h3>
                         </div>
                    )}
                </div>
            </div>

            {selectedRecord && (
                <RecordDetailModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
            )}
        </div>
    );
};

export default HealthRecordsPage;