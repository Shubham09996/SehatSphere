import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit, User, Heart, Shield, FileText, Calendar, Droplets, Phone, Activity, BarChart2, QrCode, Stethoscope, TestTube2, ShieldAlert } from 'lucide-react';
// import { patientProfileData as data } from '../../data/patientProfileData'; // Remove this import
import api from '../../utils/api'; // api.js se import karein
import { toast } from 'react-toastify'; // For notifications
import { useAuth } from '../../context/AuthContext'; // Import useAuth

// Reusable Card Component - Responsive padding added
const InfoCard = ({ icon, title, children, className = '' }) => {
    return (
        <div className={`bg-card p-4 sm:p-6 rounded-2xl border border-border ${className}`}>
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 text-primary p-2 rounded-lg">{icon}</div>
                <h3 className="font-bold text-lg text-foreground">{title}</h3>
            </div>
            {children}
        </div>
    );
};

// Icon mapping for recent activity
const activityIcons = {
    Consultation: <Stethoscope size={16}/>,
    LabReport: <TestTube2 size={16}/>,
    Allergy: <ShieldAlert size={16}/>,
};

const PatientProfilePage = () => {
    const [patientProfile, setPatientProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { patientId } = useParams(); // Retrieve patientId from URL params

    useEffect(() => {
        const fetchPatientProfile = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/api/patients/profile/${patientId}`);
                setPatientProfile(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPatientProfile();
    }, []);

    if (loading) {
        return <div className="text-center text-foreground">Loading patient profile...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">Error loading profile: {error.message}</div>;
    }

    if (!patientProfile) {
        return <div className="text-center text-muted-foreground">No patient profile data found.</div>;
    }

    const data = patientProfile; // Use fetched data as 'data'

    return (
        <div className="space-y-6 md:space-y-8">
            {/* --- Profile Header Card --- */}
            <motion.div 
                className="bg-card p-4 sm:p-6 rounded-2xl border border-border flex flex-col items-center gap-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="w-full flex flex-col sm:flex-row items-center text-center sm:text-left gap-6">
                    {data.personalInfo.pfp ? (
                        <img src={data.personalInfo.pfp} alt={data.personalInfo.name} className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-primary/50 flex-shrink-0"/>
                    ) : (
                        <img src="/uploads/default.jpg" alt={data.personalInfo.name} className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-primary/50 flex-shrink-0"/>
                    )}
                    <div className="flex-1">
                        {/* Responsive font size */}
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{data.personalInfo.name}</h1>
                        <p className="font-mono text-sm text-primary bg-primary/10 px-2 py-1 rounded-md inline-block my-2">{data.personalInfo.patientId}</p>
                        <p className="text-muted-foreground">{data.personalInfo.age} years old • Blood Group: <span className="font-semibold text-red-500">{data.personalInfo.bloodGroup}</span></p>
                        <p className="text-muted-foreground">Gender: <span className="font-semibold text-foreground">{data.gender || 'N/A'}</span></p>

                    </div>
                    <div className="flex-shrink-0 flex flex-col items-center gap-2">
                        <div className="bg-white p-2 rounded-lg border border-border">
                            
                        </div>
                        <span className="text-xs text-muted-foreground">Scan for quick access</span>
                    </div>
                </div>
                {/* Responsive button width */}
                <Link to="/patient/settings/profile" className="w-full sm:w-auto flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg bg-muted text-foreground hover:bg-border">
                    <Edit size={16}/> Edit Profile
                </Link>
            </motion.div>

            {/* --- Main Grid Layout --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* --- Left Column --- */}
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <Link to="/patient/appointments" className="bg-card p-4 rounded-xl border border-border text-center hover:border-primary transition-colors">
                            <Calendar className="mx-auto text-primary" size={24}/>
                            <p className="text-2xl sm:text-3xl font-bold mt-2">{data.quickStats.upcomingAppointments}</p>
                            <p className="text-sm text-muted-foreground">Upcoming</p>
                        </Link>
                         <Link to="/patient/prescriptions" className="bg-card p-4 rounded-xl border border-border text-center hover:border-primary transition-colors">
                            <FileText className="mx-auto text-primary" size={24}/>
                            <p className="text-2xl sm:text-3xl font-bold mt-2">{data.quickStats.activePrescriptions}</p>
                            <p className="text-sm text-muted-foreground">Active Rxs</p>
                        </Link>
                         <Link to="/patient/health-records" className="bg-card p-4 rounded-xl border border-border text-center hover:border-primary transition-colors">
                            <BarChart2 className="mx-auto text-primary" size={24}/>
                            <p className="text-2xl sm:text-3xl font-bold mt-2">{data.quickStats.recordsCount}</p>
                            <p className="text-sm text-muted-foreground">Records</p>
                        </Link>
                    </div>
                    
                    {/* Recent Activity */}
                    <InfoCard icon={<Activity size={20}/>} title="Recent Activity">
                        <div className="space-y-4">
                            {data.recentActivity.map(item => (
                                <div key={item.id} className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-primary">{activityIcons[item.type]}</span>
                                        <p className="font-semibold text-sm sm:text-base">{item.title}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground flex-shrink-0">{new Date(item.date).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    </InfoCard>

                     {/* Vitals */}
                    <InfoCard icon={<Heart size={20}/>} title="Health Vitals">
                         <p className="text-xs text-muted-foreground mb-4">Last checked on {new Date(data.vitals.lastChecked).toDateString()}</p>
                         <div className="grid grid-cols-3 gap-4 text-center">
                            <div><p className="text-muted-foreground text-sm">Blood Pressure</p><p className="font-bold text-lg sm:text-xl">{data.vitals.bloodPressure.value}</p><p className="text-xs font-semibold text-orange-500">{data.vitals.bloodPressure.status}</p></div>
                            <div><p className="text-muted-foreground text-sm">Blood Sugar</p><p className="font-bold text-lg sm:text-xl">{data.vitals.bloodSugar.value}</p><p className="text-xs font-semibold text-green-500">{data.vitals.bloodSugar.status}</p></div>
                            <div><p className="text-muted-foreground text-sm">BMI</p><p className="font-bold text-lg sm:text-xl">{data.vitals.bmi.value}</p><p className="text-xs font-semibold text-green-500">{data.vitals.bmi.status}</p></div>
                         </div>
                    </InfoCard>
                </div>

                {/* --- Right Column --- */}
                <div className="lg:col-span-1 space-y-6 md:space-y-8">
                     <InfoCard icon={<Shield size={20}/>} title="Critical Information">
                        <div>
                            <h4 className="font-semibold text-sm mb-2">Allergies</h4>
                            <div className="flex flex-wrap gap-2">
                                {data.criticalInfo.allergies.map(allergy => <span key={allergy} className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full font-medium">{allergy}</span>)}
                            </div>
                        </div>
                         <div className="mt-4">
                            <h4 className="font-semibold text-sm mb-2">Chronic Conditions</h4>
                             <div className="flex flex-wrap gap-2">
                                {data.criticalInfo.chronicConditions.map(c => <span key={c} className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full font-medium">{c}</span>)}
                            </div>
                        </div>
                     </InfoCard>

                     <InfoCard icon={<Phone size={20}/>} title="Emergency Contact">
                        <p className="font-bold text-lg">{data.personalInfo.emergencyContact?.name || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">{data.personalInfo.emergencyContact?.relation || 'N/A'}</p>
                        {data.personalInfo.emergencyContact && (
                            <a href={`tel:${data.personalInfo.emergencyContact.phone}`} className="mt-4 block w-full text-center font-semibold py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                Call Now
                            </a>
                        )}
                     </InfoCard>
                </div>
            </div>

            {/* --- Prescriptions Section --- */}
            {data.prescriptions && data.prescriptions.length > 0 && (
                <InfoCard icon={<FileText size={20}/>} title="My Prescriptions">
                    <div className="space-y-4">
                        {data.prescriptions.map(prescription => (
                            <div key={prescription._id} className="border-b border-border pb-3 last:border-b-0">
                                <p className="font-semibold text-foreground">{prescription.medicines.map(m => m.name).join(', ')}</p>
                                <p className="text-sm text-muted-foreground">Prescribed by Dr. {prescription.doctor.user.name} on {new Date(prescription.issueDate).toLocaleDateString()}</p>
                                {prescription.prescriptionImage && (
                                    <a href={prescription.prescriptionImage} target="_blank" rel="noopener noreferrer" className="text-primary text-sm mt-1 inline-block hover:underline">
                                        View Prescription Image
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </InfoCard>
            )}

            {/* --- Lab Test Reports Section --- */}
            {data.labTestOrders && data.labTestOrders.length > 0 && (
                <InfoCard icon={<TestTube2 size={20}/>} title="Lab Test Reports">
                    <div className="space-y-4">
                        {data.labTestOrders.map(report => (
                            <div key={report._id} className="border-b border-border pb-3 last:border-b-0">
                                <p className="font-semibold text-foreground">{report.testName} ({report.testType})</p>
                                <p className="text-sm text-muted-foreground">Ordered by {report.labName} on {new Date(report.orderDate).toLocaleDateString()}</p>
                                {report.result && (
                                    <a href={report.result} target="_blank" rel="noopener noreferrer" className="text-primary text-sm mt-1 inline-block hover:underline">
                                        View Report
                                    </a>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">Status: {report.status}</p>
                            </div>
                        ))}
                    </div>
                </InfoCard>
            )}
        </div>
    );
};

export default PatientProfilePage;