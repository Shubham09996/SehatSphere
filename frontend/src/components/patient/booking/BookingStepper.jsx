import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const BookingStepper = ({ steps, currentStep, isFollowUp }) => {
    let displaySteps = [...steps];
    if (isFollowUp) {
        displaySteps.splice(2, 0, "Select Doctor");
    }

    return (
        <div className="p-6 bg-card rounded-xl border border-border">
            <h2 className="font-bold text-lg mb-6">Booking Progress</h2>
            <div className="relative">
                {/* Dotted line connecting steps */}
                <div className="absolute left-4 top-4 h-full border-l-2 border-dashed border-border"></div>

                {displaySteps.map((step, index) => {
                    const stepNumber = isFollowUp && index >= 2 ? (index === 2 ? 2.5 : index + 0.5) : index + 1;
                    const isCompleted = currentStep > stepNumber;
                    const isActive = currentStep === stepNumber;

                    return (
                        <div key={index} className="relative flex items-start mb-8">
                            <div className={`z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isActive ? 'border-primary bg-primary/20' : isCompleted ? 'border-green-500 bg-green-500' : 'border-border bg-muted'}`}>
                               {isCompleted ? <Check className="text-white" size={16}/> : <span className={`font-bold ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>{index + 1}</span>}
                            </div>
                            <div className="ml-4">
                                <h3 className={`font-semibold ${isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>{step}</h3>
                                <p className="text-sm text-muted-foreground">{isActive ? 'Please complete this step' : isCompleted ? 'Completed' : 'Pending'}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BookingStepper;