import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../../utils/api'; // api.js se import karein
import { useLocation } from 'react-router-dom'; // Import useLocation

// Import New and Redesigned Step Components
import BookingStepper from '../../components/patient/booking/BookingStepper';
import Step1SelectHospital from '../../components/patient/booking/Step1SelectHospital';
import Step2SelectDepartment from '../../components/patient/booking/Step2SelectDepartment';
import Step2aSelectDoctor from '../../components/patient/booking/Step2aSelectDoctor';
import Step3SelectDateAndSlot from '../../components/patient/booking/Step3SelectDateAndSlot';
import Step4Confirmation from '../../components/patient/booking/Step4Confirmation';
import Step5Success from '../../components/patient/booking/Step5Success';

const steps = ["Hospital", "Department", "Date & Slot", "Confirm"];

const BookAppointmentPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isFollowUp, setIsFollowUp] = useState(false);
    const [hospitals, setHospitals] = useState([]); // New state for hospitals
    const [loadingHospitals, setLoadingHospitals] = useState(true);
    const [errorHospitals, setErrorHospitals] = useState(null);
    const location = useLocation(); // Initialize useLocation
    const [bookingDetails, setBookingDetails] = useState({
        hospital: null, department: null, doctor: null,
        date: null, time: null, token: null, forFamilyMemberId: null, // Add forFamilyMemberId
    });

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                setLoadingHospitals(true);
                const response = await api.get('/api/hospitals');
                setHospitals(response.data);
                console.log('Fetched hospitals (BookAppointmentPage):', response.data);
            } catch (err) {
                setErrorHospitals(err);
            } finally {
                setLoadingHospitals(false);
            }
        };

        fetchHospitals();
    }, []);

    // Effect to read forFamilyMemberId from URL on component mount
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const familyMemberId = queryParams.get('forFamilyMemberId');
        if (familyMemberId) {
            setBookingDetails(prev => ({ ...prev, forFamilyMemberId: familyMemberId }));
        }
    }, [location.search]);

    if (loadingHospitals) {
        return <div className="text-center text-foreground">Loading hospitals...</div>;
    }

    if (errorHospitals) {
        return <div className="text-center text-red-500">Error loading hospitals: {errorHospitals.message}</div>;
    }

    const variants = {
        enter: { opacity: 0, x: 30 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -30 },
    };

    const handleNextStep = (data) => {
        setBookingDetails(prev => {
            const newDetails = { ...prev, ...data };
            return newDetails;
        });
        // Step transition logic refined
        if (currentStep === 1) { // After selecting hospital, go to department
            setCurrentStep(2);
        } else if (currentStep === 2) { // After selecting department, always go to select doctor
            setCurrentStep(2.5); // Ensure we always go to Step2aSelectDoctor
        } else if (currentStep === 2.5) { // After selecting doctor, go to date & slot
            setCurrentStep(3);
        } else if (currentStep === 3) { // After selecting date & slot, go to confirmation
            setCurrentStep(4);
        } else if (currentStep === 4) { // After confirmation, go to success
            setCurrentStep(5);
        }
    };

    const handlePrevStep = () => {
        if (currentStep === 5) return; // Can't go back from success screen
        if (currentStep === 4) setCurrentStep(3);
        else if (currentStep === 3) setCurrentStep(2.5);
        else if (currentStep === 2.5) setCurrentStep(2);
        else if (currentStep === 2) setCurrentStep(1);
    };
    
    const startOver = () => {
        setCurrentStep(1);
        setIsFollowUp(false);
        setBookingDetails({ hospital: null, department: null, doctor: null, date: null, time: null, token: null, forFamilyMemberId: null }); // Reset forFamilyMemberId
    };
    
    const progressStep = currentStep === 2.5 ? 1.5 : Math.floor(currentStep);

    // If booking is successful, show a full-page success message
    if (currentStep === 5) {
        return (
             <motion.div key={5} variants={variants} initial="enter" animate="center" transition={{ duration: 0.5 }}>
                <Step5Success details={bookingDetails} onDone={startOver} />
             </motion.div>
        );
    }
    
    return (
        <div className="flex flex-col gap-8 md:gap-12 min-h-[70vh]">
            {/* Left Column: Stepper */}
            <div className="w-full">
                <BookingStepper steps={steps} currentStep={progressStep} isFollowUp={isFollowUp} />
            </div>

            {/* Right Column: Step Content */}
            <div className="flex-1">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, type: 'tween' }}
                    >
                        {currentStep === 1 && <Step1SelectHospital onNext={handleNextStep} data={hospitals} isFollowUp={isFollowUp} setIsFollowUp={setIsFollowUp} />}
                        {currentStep === 2 && <Step2SelectDepartment onNext={handleNextStep} details={bookingDetails} onBack={handlePrevStep} />}
                        {currentStep === 2.5 && <Step2aSelectDoctor onNext={handleNextStep} details={bookingDetails} onBack={handlePrevStep} />}
                        {currentStep === 3 && <Step3SelectDateAndSlot onNext={handleNextStep} details={bookingDetails} onBack={handlePrevStep} />}
                        {currentStep === 4 && <Step4Confirmation onNext={handleNextStep} details={bookingDetails} onBack={handlePrevStep} forFamilyMemberId={bookingDetails.forFamilyMemberId} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default BookAppointmentPage;