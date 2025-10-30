import React from 'react';
import PatientQueueCard from './PatientQueueCard';

const AppointmentQueue = ({ upNextPatient, waitingPatients }) => {
    return (
        <div className="bg-card p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md h-full">
            <h3 className="font-bold text-lg text-foreground mb-4">Upcoming Queue</h3>
            <div className="space-y-6">
                {upNextPatient && (
                    <div>
                        <h4 className="font-semibold text-muted-foreground mb-2">Up Next</h4>
                        <PatientQueueCard patient={upNextPatient} />
                    </div>
                )}
                
                {waitingPatients && waitingPatients.length > 0 ? (
                     <div>
                        <h4 className="font-semibold text-muted-foreground mb-2">Waiting ({waitingPatients.length})</h4>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                             {waitingPatients.map(p => <PatientQueueCard key={p.id} patient={p} />)}
                        </div>
                    </div>
                ) : (
                    !upNextPatient && <p className="text-sm text-muted-foreground text-center py-8">The queue is empty.</p>
                )}
            </div>
        </div>
    );
};

export default AppointmentQueue;