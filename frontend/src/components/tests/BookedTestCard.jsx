import React from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Calendar, Clock, MapPin, Hash } from 'lucide-react';

const StatusPill = ({ status }) => {
    const map = {
        'Scheduled': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        'Pending Sample': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
        'Confirmed': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
        'Completed': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
    };
    const cls = map[status] || 'bg-muted text-foreground';
    return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>{status}</span>;
};

const BookedTestCard = ({ result }) => {
    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="bg-card p-5 border border-border rounded-xl flex flex-col sm:flex-row items-start gap-4 group hover:border-primary transition-colors"
        >
            <div className="w-16 h-16 bg-gradient-to-br from-hs-gradient-start to-hs-gradient-end rounded-lg flex items-center justify-center flex-shrink-0">
                <FlaskConical className="text-white" size={28} />
            </div>
            <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                        <h3 className="font-bold text-lg text-foreground">{result.testName}</h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <MapPin size={14} />
                            <span>{result.labName}</span>
                        </div>
                    </div>
                    <StatusPill status={result.status} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar size={14} className="text-primary" />
                        <span className="text-muted-foreground">{result.scheduledDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Clock size={14} className="text-primary" />
                        <span className="text-muted-foreground">{result.scheduledTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm col-span-2 sm:col-span-1">
                        <Hash size={14} className="text-primary" />
                        <span className="text-muted-foreground text-xs">{result.bookingRef}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default BookedTestCard;

