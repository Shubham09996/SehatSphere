import React from 'react';
import { useState, useEffect } from 'react';
import api from '../../utils/api';

const MyTokenPage = () => {
    const mockTokenData = {
        tokenNumber: 'P00123',
        status: 'Active',
        estimatedWaitTime: '15 minutes',
        clinicName: 'City General Hospital',
        doctorName: 'Dr. Emily White',
        lastUpdated: '2025-10-14 10:30 AM'
    };

    const [currentToken, setCurrentToken] = useState(null);
    const [tokenHistory, setTokenHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTokenData = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/appointments/myappointments');
                const allAppointments = response.data;

                // Align 'now' and 'today' comparison with backend logic
                const nowLocal = new Date();
                const today = new Date(Date.UTC(nowLocal.getFullYear(), nowLocal.getMonth(), nowLocal.getDate()));
                const currentTimeString = `${String(nowLocal.getHours()).padStart(2, '0')}:${String(nowLocal.getMinutes()).padStart(2, '0')}`;

                const upcoming = [];
                const history = [];

                allAppointments.forEach(appt => {
                    // Create a full Date object for comparison, similar to backend
                    const apptFullDateTime = new Date(`${appt.date}T${appt.time}:00`);

                    let isUpcoming = false;
                    if (apptFullDateTime.getTime() > nowLocal.getTime()) {
                        isUpcoming = true;
                    }

                    const formattedAppt = {
                        _id: appt._id,
                        tokenNumber: appt.tokenNumber,
                        status: appt.status,
                        estimatedWaitTime: 'N/A', // Calculated later
                        clinicName: appt.hospital?.name || 'N/A',
                        doctorName: appt.doctor?.user?.name ? `Dr. ${appt.doctor.user.name}` : 'Unknown Doctor',
                        specialty: appt.doctor?.specialty || 'N/A',
                        date: new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        time: new Date(`2000-01-01T${appt.time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
                        lastUpdated: new Date(appt.updatedAt).toLocaleString(),
                        originalDate: appt.date,
                        originalTime: appt.time,
                    };

                    if (isUpcoming && ['Pending', 'Confirmed', 'Now Serving', 'Up Next', 'Waiting'].includes(appt.status)) {
                        upcoming.push(formattedAppt);
                    } else {
                        history.push(formattedAppt);
                    }
                });

                // Sort upcoming appointments to get the closest one as current token
                upcoming.sort((a, b) => {
                    const dateA = new Date(`${a.originalDate}T${a.originalTime}`);
                    const dateB = new Date(`${b.originalDate}T${b.originalTime}`);
                    return dateA.getTime() - dateB.getTime();
                });

                if (upcoming.length > 0) {
                    const nextAppt = upcoming[0];
                    // Use the already created apptFullDateTime or reconstruct for clarity
                    const appointmentDateTimeForDiff = new Date(`${nextAppt.originalDate}T${nextAppt.originalTime}:00`);
                    const timeDiffMinutes = Math.round((appointmentDateTimeForDiff.getTime() - nowLocal.getTime()) / (1000 * 60));
                    nextAppt.estimatedWaitTime = timeDiffMinutes > 0 ? `+${timeDiffMinutes} min` : '-';
                    setCurrentToken(nextAppt);
                } else {
                    setCurrentToken(null);
                }
                setTokenHistory(history);
            } catch (err) {
                setError(err);
                console.error("Error fetching token data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTokenData();
    }, []);

    if (loading) {
        return <div className="text-center py-12 text-foreground">Loading token data...</div>;
    }

    if (error) {
        return <div className="text-center py-12 text-red-500">Error loading token data: {error.message}</div>;
    }

    return (
        <div className="text-foreground min-h-screen">
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">My Token</h1>

            <div className="bg-card p-6 rounded-lg shadow-lg mb-8 border border-border">
                <h2 className="text-2xl font-semibold mb-4">Current Token Information</h2>
                {currentToken ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Token Number:</p>
                            <p className="text-2xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">{currentToken.tokenNumber}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status:</p>
                            <p className={`text-base font-semibold ${currentToken.status === 'Pending' || currentToken.status === 'Confirmed' ? 'text-yellow-500' : 'text-green-500'}`}>{currentToken.status}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Estimated Wait Time:</p>
                            <p className="text-base font-semibold">{currentToken.estimatedWaitTime}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Clinic:</p>
                            <p className="text-base font-semibold">{currentToken.clinicName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Doctor:</p>
                            <p className="text-base font-semibold">{currentToken.doctorName} ({currentToken.specialty})</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Appointment Date & Time:</p>
                            <p className="text-base font-semibold">{currentToken.date} • {currentToken.time}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Last Updated:</p>
                            <p className="text-base font-semibold">{currentToken.lastUpdated}</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-4 text-muted-foreground">No active token found.</div>
                )}
            </div>

            <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
                <h2 className="text-2xl font-semibold mb-4">Token History</h2>
                <ul className="space-y-3">
                    {tokenHistory.length > 0 ? (
                        tokenHistory.map((token, index) => (
                            <li key={token._id || index} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                                <span className="text-sm">Token: {token.tokenNumber} - {token.doctorName} ({token.status})</span>
                                <span className="text-sm text-muted-foreground">{token.date}</span>
                            </li>
                        ))
                    ) : (
                        <div className="text-center py-4 text-muted-foreground">No token history found.</div>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default MyTokenPage;

