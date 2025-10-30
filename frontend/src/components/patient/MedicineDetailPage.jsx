import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { medicinesData } from '../../data/medicinesData';
import { ArrowLeft, CheckCircle, AlertTriangle, Info, Pill } from 'lucide-react';

const DetailSection = ({ icon: Icon, title, children }) => (
    <div className="mt-6">
        <div className="flex items-center gap-2 mb-2">
            <Icon className="text-primary" size={20} />
            <h3 className="font-semibold text-lg text-foreground">{title}</h3>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">{children}</p>
    </div>
);

const MedicineDetailPage = () => {
    const { medicineId } = useParams();
    const medicine = medicinesData.find(m => m.id === medicineId);

    const substitutes = useMemo(() => {
        if (!medicine) return [];
        return medicinesData.filter(m => 
            m.genericName === medicine.genericName &&
            m.strength === medicine.strength &&
            m.id !== medicine.id
        );
    }, [medicine]);

    if (!medicine) {
        return <div className="text-center py-20">Medicine not found.</div>;
    }

    return (
        <div className="max-w-5xl mx-auto">
            <Link to="/patient/medicine-finder" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft size={16}/> Back to Search
            </Link>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column: Image & Primary Info */}
                <div className="bg-card p-6 rounded-xl border border-border">
                    <div className="h-64 bg-muted flex items-center justify-center rounded-lg p-4 mb-6">
                         <img src={medicine.image} alt={medicine.brandName} className="max-h-full object-contain"/>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">{medicine.brandName}</h1>
                    <p className="text-muted-foreground mt-1">{medicine.strength} • {medicine.type}</p>
                    <p className="text-sm text-muted-foreground">by {medicine.manufacturer}</p>
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-3xl font-bold text-primary">₹{medicine.price.toFixed(2)}</p>
                        <button className="font-bold py-2.5 px-6 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Add to Cart</button>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="bg-card p-6 rounded-xl border border-border">
                    <DetailSection icon={Pill} title="Description">
                        {medicine.description}
                    </DetailSection>
                     <DetailSection icon={CheckCircle} title="How to Use">
                        {medicine.usage}
                    </DetailSection>
                    <DetailSection icon={Info} title="Common Side Effects">
                        {medicine.sideEffects}
                    </DetailSection>
                    <DetailSection icon={AlertTriangle} title="Precautions & Warnings">
                        {medicine.precautions}
                    </DetailSection>
                </div>
            </div>

            {/* Substitutes Section */}
            {substitutes.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Substitutes & Alternatives</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {substitutes.map(sub => (
                            <Link key={sub.id} to={`/patient/medicine-finder/${sub.id}`} className="block p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors">
                                <h4 className="font-bold text-foreground">{sub.brandName}</h4>
                                <p className="text-sm text-muted-foreground">{sub.manufacturer}</p>
                                <p className="text-lg font-bold text-primary mt-2">₹{sub.price.toFixed(2)}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicineDetailPage;