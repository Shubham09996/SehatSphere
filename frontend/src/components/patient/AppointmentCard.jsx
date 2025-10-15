import React from 'react';
import { User, Calendar, Clock, MapPin } from 'lucide-react';

// Status ke hisab se badge ka color change karne ke liye helper object
const statusStyles = {
    Upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    Completed: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

const AppointmentCard = ({ appointment, onCancel, onReschedule }) => {
    const { doctor, specialty, hospital, date, time, status } = appointment;

    return (
        <div className="bg-background p-4 rounded-lg border border-border transition-shadow hover:shadow-md">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                {/* Doctor Info */}
                <div className="flex items-center gap-4">
                    <div className="bg-muted p-3 rounded-full">
                        <User className="text-muted-foreground" />
                    </div>
                    <div>
                        <h4 className="font-bold text-foreground text-lg">Dr. {doctor || 'Unknown Doctor'}</h4>
                        <p className="text-sm text-muted-foreground">{specialty || 'N/A'}</p>
                    </div>
                </div>
                {/* Status Badge */}
                <div className="mt-4 sm:mt-0">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[status]}`}>
                        {status}
                    </span>
                </div>
            </div>

            {/* Appointment Details */}
            <div className="border-t border-border my-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{hospital}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{date}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{time}</span>
                </div>
            </div>
            
            {/* Action Buttons */}
            <div className="border-t border-border mt-4 pt-4 flex flex-col sm:flex-row justify-end items-center gap-3">
                {status === 'Upcoming' && (
                    <>
                        <button onClick={() => onReschedule(appointment._id)} className="w-full sm:w-auto text-sm text-muted-foreground font-semibold hover:text-foreground">Reschedule</button>
                        <button onClick={() => onCancel(appointment._id)} className="w-full sm:w-auto text-sm text-red-500 font-semibold hover:text-red-700">Cancel Appointment</button>
                        <button className="w-full sm:w-auto text-sm font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                            View Queue →
                        </button>
                    </>
                )}
                 {status === 'Completed' && (
                    <>
                        <button className="w-full sm:w-auto text-sm text-muted-foreground font-semibold hover:text-foreground">View Prescription</button>
                        <button className="w-full sm:w-auto text-sm font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                           Leave a Review
                        </button>
                    </>
                )}
                 {status === 'Cancelled' && (
                    <p className="text-xs text-muted-foreground">This appointment was cancelled.</p>
                )}
            </div>
        </div>
    );
};

export default AppointmentCard;