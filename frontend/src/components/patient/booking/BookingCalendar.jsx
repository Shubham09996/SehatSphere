import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BookingCalendar = ({ onDateSelect, getDayStatus, initialDate, onMonthChange }) => {
    const [currentDate, setCurrentDate] = useState(initialDate || new Date());
    const [selectedDay, setSelectedDay] = useState(initialDate.getDate());

    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']; // Changed to unique abbreviations

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const calendarDays = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dateString = date.toISOString().split('T')[0];
        const status = getDayStatus(dateString);

        const statusClasses = {
            green: 'bg-green-200 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-300',
            orange: 'bg-orange-200 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 hover:bg-orange-300',
            red: 'bg-red-200 dark:bg-red-900/40 text-red-700 dark:text-red-400 cursor-not-allowed',
            disabled: 'text-muted-foreground/30 cursor-not-allowed'
        };

        calendarDays.push(
            <button key={day} 
                onClick={() => {
                    if (status !== 'disabled' && status !== 'red') {
                        onDateSelect(dateString);
                        setSelectedDay(day);
                    }
                }}
                disabled={status === 'disabled' || status === 'red'}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors font-semibold ${statusClasses[status]} ${selectedDay === day ? 'ring-2 ring-primary' : ''}`}>
                {day}
            </button>
        );
    }

    const changeMonth = (offset) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
        setCurrentDate(newDate);
        setSelectedDay(null); // Reset selection on month change
        if (onMonthChange) {
            onMonthChange(newDate.getMonth(), newDate.getFullYear());
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-muted"><ChevronLeft size={20}/></button>
                <h3 className="font-semibold text-lg">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-muted"><ChevronRight size={20}/></button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-sm text-center text-muted-foreground">
                {daysOfWeek.map(day => <div key={day} className="w-10 font-medium">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2 mt-2">
                {calendarDays}
            </div>
        </div>
    );
};

export default BookingCalendar;