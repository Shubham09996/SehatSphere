import React from 'react';

const WeekView = ({ date, appointments }) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const days = Array.from({ length: 7 }, (_, i) => new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i));

    const colors = {
        'New Patient': 'bg-blue-500/80 text-white',
        'Follow-up': 'bg-green-500/80 text-white',
        'Blocked': 'bg-gray-500/80 text-white',
    };

    return (
        <div className="bg-card border border-gray-200 dark:border-gray-700 rounded-xl h-[70vh] flex flex-col">
            <div className="grid grid-cols-7 flex-shrink-0">
                {days.map(day => (
                    <div key={day} className="text-center p-2 border-b border-r border-border">
                        <p className="font-semibold text-sm">{day.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                        <p className="text-2xl font-bold">{day.getDate()}</p>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 flex-1 overflow-y-auto">
                 {days.map((day, dayIndex) => (
                    <div key={day} className={`p-1 border-r border-border ${dayIndex === 6 ? 'border-r-0' : ''}`}>
                       {appointments
                            .filter(apt => new Date(apt.start).toDateString() === day.toDateString())
                            .sort((a,b) => new Date(a.start) - new Date(b.start)) // Convert to Date objects for sorting
                            .map(apt => (
                                <div key={apt.id} className={`p-1.5 rounded-md mb-1 text-xs cursor-pointer ${colors[apt.type] || colors['Blocked']}`}>
                                    <p className="font-bold truncate">{apt.title}</p>
                                    <p className="opacity-80">{new Date(apt.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true})}</p>
                                </div>
                            ))
                       }
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeekView;