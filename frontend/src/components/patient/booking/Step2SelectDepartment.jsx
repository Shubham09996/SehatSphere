import React from 'react';
import * as LucideIcons from 'lucide-react';
import { motion } from 'framer-motion';

const Step2SelectDepartment = ({ onNext, details, onBack }) => {
    // Dynamic icon rendering
    const renderIcon = (iconName) => {
        console.log('Hospital details in Step2SelectDepartment:', details.hospital);
        console.log('DEBUG: Departments received in Step2SelectDepartment:', details.hospital.departments, 'Type:', typeof details.hospital.departments); // Add this line
        const Icon = LucideIcons[iconName] || LucideIcons['Stethoscope'];
        return <Icon className="text-primary mb-2" size={32} />;
    };
    return (
        <div className="bg-card p-6 rounded-xl shadow-md">
            <LucideIcons.ArrowLeft size={18} onClick={onBack} className="cursor-pointer text-muted-foreground mb-4"/>
            <h2 className="text-2xl font-bold text-foreground">Select a Department</h2>
            <p className="text-muted-foreground mb-6">At <span className="font-semibold text-primary">{details.hospital.name}</span></p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {details.hospital.departments[0] && details.hospital.departments[0].split(', ').map((dept, index) => (
                    <motion.div key={dept || index} onClick={() => onNext({ department: { id: dept, name: dept, icon: 'Stethoscope' } })}
                        className="flex flex-col items-center justify-center p-6 border border-border rounded-lg cursor-pointer hover:bg-muted text-center"
                        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}>
                        {renderIcon('Stethoscope')}
                        <h3 className="font-semibold text-foreground">{dept}</h3>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
export default Step2SelectDepartment;