import React, { useState, useEffect } from 'react';
import { Calendar, Syringe, MapPin, Clock, Info, CheckCircle, ArrowLeft, FlaskConical, ArrowRight, Hospital } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api'; // Import api for fetching hospitals

// Import Step1SelectHospital component
import Step1SelectHospital from '../../components/patient/booking/Step1SelectHospital';
import Step3SelectDateAndSlot from '../../components/patient/booking/Step3SelectDateAndSlot'; // NEW: Import Step3SelectDateAndSlot

// Dummy data
const availableTests = [
    { id: 'blood_test', name: 'Blood Test', description: 'Complete Blood Count, Glucose, Cholesterol' },
    { id: 'urine_test', name: 'Urine Test', description: 'Urinalysis, Culture, Sensitivity' },
    { id: 'xray', name: 'X-Ray', description: 'Chest X-Ray, Bone X-Ray' },
    { id: 'mri', name: 'MRI Scan', description: 'Brain MRI, Spinal MRI' },
];

const availableLocations = [
    { id: 'lab_a', name: 'HealthSphere Lab - City Center' },
    { id: 'lab_b', name: 'HealthSphere Lab - North Wing' },
    { id: 'lab_c', name: 'HealthSphere Lab - South Side' },
];

const availableTimes = [
    '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM',
];

const steps = ["Hospital", "Select Test", "Date & Slot", "Confirm"]; // Updated steps for test booking

const BookTestAppointmentPage = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [bookingDetails, setBookingDetails] = useState({
        hospital: null, test: null, date: null, time: null, location: null,
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [hospitals, setHospitals] = useState([]); // State for hospitals
    const [loadingHospitals, setLoadingHospitals] = useState(true); // Loading state for hospitals
    const [errorHospitals, setErrorHospitals] = useState(null); // Error state for hospitals

    // Fetch hospitals on component mount
    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                setLoadingHospitals(true);
                const response = await api.get('/api/hospitals'); // Assuming this API exists
                setHospitals(response.data);
            } catch (err) {
                setErrorHospitals(err);
            } finally {
                setLoadingHospitals(false);
            }
        };
        fetchHospitals();
    }, []);

    const handleNextStep = (data) => {
        setBookingDetails(prev => ({ ...prev, ...data }));
        setCurrentStep(prev => prev + 1);
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmitBooking = () => {
        console.log("Submitting test booking:", bookingDetails);
        setIsSubmitted(true);
    };

    const startOver = () => {
        setCurrentStep(1);
        setIsSubmitted(false);
        setBookingDetails({ hospital: null, test: null, date: null, time: null, location: null });
    };

    const variants = {
        enter: { opacity: 0, x: 30 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -30 },
    };

    // Loading and error handling for hospitals
    if (loadingHospitals) {
        return <div className="text-center text-foreground py-12">Loading hospitals...</div>;
    }

    if (errorHospitals) {
        return <div className="text-center text-red-500 py-12">Error loading hospitals: {errorHospitals.message}</div>;
    }

    // Step Components
    const Step1SelectHospitalForTest = ({ onNext, hospitalsData }) => (
        <Step1SelectHospital onNext={onNext} data={hospitalsData} />
    );

    const Step2SelectTest = ({ onNext, onBack }) => { // Added onBack
        const [selectedTestId, setSelectedTestId] = useState(bookingDetails.test?.id || '');

        const handleSelectTest = (e) => {
            const testId = e.target.value;
            const test = availableTests.find(t => t.id === testId);
            setSelectedTestId(testId);
            // onNext({ test }); // Commented out to prevent immediate next step on select
        };

        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Select Your Test</h2>
                <div>
                    <label htmlFor="test" className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2"><Syringe size={16}/> Choose Test</label>
                    <select
                        id="test"
                        value={selectedTestId}
                        onChange={handleSelectTest}
                        className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle"
                        required
                    >
                        <option value="">Select a test</option>
                        {availableTests.map(test => (
                            <option key={test.id} value={test.id}>{test.name}</option>
                        ))}
                    </select>
                    {selectedTestId && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Info size={14}/> {availableTests.find(t => t.id === selectedTestId)?.description}</p>
                    )}
                </div>
                <div className="flex justify-between mt-6">
                    <button
                        onClick={onBack}
                        className="bg-muted text-foreground font-bold py-2 px-4 rounded-lg hover:bg-muted-foreground/20 transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft size={18} /> Back
                    </button>
                    <button
                        onClick={() => handleNextStep({ test: availableTests.find(t => t.id === selectedTestId) })}
                        disabled={!selectedTestId}
                        className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                        Next <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        );
    };

    const Step3SelectDateAndSlotForTest = ({ onNext, onBack, details }) => {
        // Step3SelectDateAndSlot expects a doctor, but we are booking a test.
        // For simplicity, we'll pass a dummy doctor object or adapt the component.
        // Assuming Step3SelectDateAndSlot can work with a hospital and no specific doctor.
        const dummyDoctor = { _id: 'test_lab', user: { name: 'Test Lab' }, specialty: 'Pathology' };
        const adaptedDetails = { ...details, doctor: dummyDoctor };
        
        return <Step3SelectDateAndSlot onNext={onNext} onBack={onBack} details={adaptedDetails} isTestBooking={true} />; // Added isTestBooking prop
    };

    const Step4TestDetails = ({ onNext, onBack }) => { // Renamed from Step3TestDetails
        // Date and time selection removed as it's handled by Step3SelectDateAndSlot
        const handleDetailsSubmit = () => {
            onNext({}); // No data to pass as date/time/location already set
        };

        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Additional Test Information (Optional)</h2>
                <p className="text-muted-foreground mb-4">You can add any specific instructions or notes for the lab here.</p>
                {/* Example: A textarea for notes */}
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2"><Info size={16}/> Special Instructions</label>
                    <textarea
                        id="notes"
                        rows="4"
                        className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle"
                        placeholder="e.g., Fasting required, specific timing preference..."
                    ></textarea>
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        onClick={onBack}
                        className="bg-muted text-foreground font-bold py-2 px-4 rounded-lg hover:bg-muted-foreground/20 transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft size={18} /> Back
                    </button>
                    <button
                        onClick={handleDetailsSubmit}
                        className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                        Review & Confirm <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        );
    };

    const Step5ConfirmTestBooking = ({ details, onSubmit, onBack }) => { // Renamed from Step4ConfirmTestBooking
        const selectedTestDetails = availableTests.find(t => t.id === details.test?.id);
        const selectedHospitalDetails = details.hospital;

        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Confirm Your Test Appointment</h2>
                <div className="bg-muted/30 p-5 rounded-lg border border-border space-y-4">
                    <p className="flex items-center gap-2 text-foreground font-semibold"><FlaskConical size={18}/> Test: <span className="font-normal text-muted-foreground">{selectedTestDetails?.name}</span></p>
                    <p className="flex items-center gap-2 text-foreground font-semibold"><Hospital size={18}/> Hospital: <span className="font-normal text-muted-foreground">{selectedHospitalDetails?.name}</span></p>
                    <p className="flex items-center gap-2 text-foreground font-semibold"><MapPin size={18}/> Location: <span className="font-normal text-muted-foreground">{selectedHospitalDetails?.location}</span></p>
                    <p className="flex items-center gap-2 text-foreground font-semibold"><Calendar size={18}/> Date: <span className="font-normal text-muted-foreground">{details.date}</span></p>
                    <p className="flex items-center gap-2 text-foreground font-semibold"><Clock size={18}/> Time: <span className="font-normal text-muted-foreground">{details.time}</span></p>
                </div>
                <div className="flex justify-between mt-6">
                    <button
                        onClick={onBack}
                        className="bg-muted text-foreground font-bold py-2 px-4 rounded-lg hover:bg-muted-foreground/20 transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft size={18} /> Back
                    </button>
                    <button
                        onClick={onSubmit}
                        className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                        Confirm Booking <CheckCircle size={18} />
                    </button>
                </div>
            </div>
        );
    };

    const Step6SuccessMessage = ({ details, onDone }) => { // Renamed from Step5SuccessMessage
        const selectedTestDetails = availableTests.find(t => t.id === details.test?.id);
        const selectedHospitalDetails = details.hospital;
        return (
            <div className="flex flex-col items-center justify-center text-center bg-card rounded-lg p-8 shadow-lg min-h-[70vh]">
                <CheckCircle size={80} className="text-green-500 mb-6 animate-bounce" />
                <h2 className="text-3xl font-bold text-foreground mb-3">Appointment Booked!</h2>
                <p className="text-lg text-muted-foreground mb-4">Your test appointment has been successfully scheduled.</p>
                <div className="bg-muted/30 p-5 rounded-lg border border-border inline-block text-left max-w-sm space-y-3 mb-6">
                    <p className="flex items-center gap-2 text-foreground font-semibold"><FlaskConical size={18}/> Test: <span className="font-normal text-muted-foreground">{selectedTestDetails?.name}</span></p>
                    <p className="flex items-center gap-2 text-foreground font-semibold"><Hospital size={18}/> Hospital: <span className="font-normal text-muted-foreground">{selectedHospitalDetails?.name}</span></p>
                    <p className="flex items-center gap-2 text-foreground font-semibold"><MapPin size={18}/> Location: <span className="font-normal text-muted-foreground">{selectedHospitalDetails?.location}</span></p>
                    <p className="flex items-center gap-2 text-foreground font-semibold"><Calendar size={18}/> Date: <span className="font-normal text-muted-foreground">{details.date}</span></p>
                    <p className="flex items-center gap-2 text-foreground font-semibold"><Clock size={18}/> Time: <span className="font-normal text-muted-foreground">{details.time}</span></p>
                </div>
                <button
                    onClick={onDone}
                    className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white font-bold py-2 px-5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                    <ArrowLeft size={18} /> View All Appointments
                </button>
            </div>
        );
    };


    if (isSubmitted) {
        return (
            <Step6SuccessMessage details={bookingDetails} onDone={() => navigate('/patient/appointments')} />
        );
    }

    return (
        <div className="flex flex-col gap-8 md:gap-12">
            <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">Book Test Appointment</h1>

            {/* Stepper Display */}
            <div className="w-full flex justify-center">
                <div className="flex items-center space-x-4">
                    {steps.map((step, index) => (
                        <React.Fragment key={step}>
                            <div className={`flex items-center ${index + 1 <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index + 1 <= currentStep ? 'bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white' : 'bg-muted border border-border'}`}>
                                    {index + 1}
                                </div>
                                <span className={`ml-2 hidden sm:block ${index + 1 <= currentStep ? 'font-semibold text-foreground' : 'font-medium'}`}>{step}</span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-1 w-12 h-px ${index + 1 < currentStep ? 'bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end' : 'bg-border'}`}></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 bg-card p-6 rounded-lg shadow-md border border-border">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, type: 'tween' }}
                        className="min-h-[400px] flex flex-col justify-between"
                    >
                        {currentStep === 1 && <Step1SelectHospitalForTest onNext={handleNextStep} hospitalsData={hospitals} />} 
                        {currentStep === 2 && <Step2SelectTest onNext={handleNextStep} onBack={handlePrevStep} />} 
                        {currentStep === 3 && <Step3SelectDateAndSlotForTest onNext={handleNextStep} onBack={handlePrevStep} details={bookingDetails} />} {/* NEW: Date & Slot Selection */}
                        {currentStep === 4 && <Step4TestDetails onNext={handleNextStep} onBack={handlePrevStep} />} 
                        {currentStep === 5 && <Step5ConfirmTestBooking details={bookingDetails} onSubmit={handleSubmitBooking} onBack={handlePrevStep} />} 
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default BookTestAppointmentPage;
