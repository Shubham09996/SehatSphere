import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../utils/api';
import { Loader2, User, Cake, Heart, Phone, ListFilter, Stethoscope } from 'lucide-react';

const FamilyMemberProfilePage = () => {
    const { id } = useParams(); // Get family member ID from URL
    const [familyMember, setFamilyMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFamilyMember = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/api/family/${id}`);
                setFamilyMember(res.data);
            } catch (err) {
                console.error('Error fetching family member profile:', err);
                setError(err);
                toast.error(err.response?.data?.message || 'Failed to fetch family member profile.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchFamilyMember();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[200px]">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500">Error: {error.message}</div>;
    }

    if (!familyMember) {
        return <div className="text-center text-muted-foreground">No family member found.</div>;
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-card rounded-lg shadow-md">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">Family Member Profile</h1>
            
            {/* Profile Picture */}
            <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg shadow-sm mb-6">
                <img
                    src={familyMember.profilePicture || '/uploads/default.jpg'}
                    alt={`${familyMember.name}'s profile`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-md mb-4"
                />
                <h2 className="text-xl font-bold text-foreground">{familyMember.name}</h2>
                <p className="text-sm text-muted-foreground">Patient ID: {familyMember.patientId}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Details */}
                <div className="p-4 bg-background rounded-lg shadow-sm space-y-3">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2 mb-3">Personal Details</h3>
                    <p className="text-muted-foreground flex items-center gap-2"><Cake size={18}/> Date of Birth: <span className="text-foreground font-medium">{new Date(familyMember.dob).toLocaleDateString()}</span></p>
                    <p className="text-muted-foreground flex items-center gap-2"><User size={18}/> Gender: <span className="text-foreground font-medium">{familyMember.gender}</span></p>
                    {familyMember.bloodGroup && <p className="text-muted-foreground flex items-center gap-2"><Heart size={18}/> Blood Group: <span className="text-foreground font-medium">{familyMember.bloodGroup}</span></p>}
                </div>

                {/* Emergency Contact */}
                {familyMember.emergencyContact && familyMember.emergencyContact.name && (
                    <div className="p-4 bg-background rounded-lg shadow-sm space-y-3">
                        <h3 className="text-lg font-semibold text-foreground border-b pb-2 mb-3">Emergency Contact</h3>
                        <p className="text-muted-foreground flex items-center gap-2"><User size={18}/> Name: <span className="text-foreground font-medium">{familyMember.emergencyContact.name}</span></p>
                        <p className="text-muted-foreground flex items-center gap-2"><Stethoscope size={18}/> Relation: <span className="text-foreground font-medium">{familyMember.emergencyContact.relation}</span></p>
                        <p className="text-muted-foreground flex items-center gap-2"><Phone size={18}/> Phone: <span className="text-foreground font-medium">{familyMember.emergencyContact.phone}</span></p>
                    </div>
                )}

                {/* Medical History */}
                <div className="p-4 bg-background rounded-lg shadow-sm space-y-3">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2 mb-3">Medical History</h3>
                    <p className="text-muted-foreground flex items-center gap-2"><ListFilter size={18}/> Allergies: <span className="text-foreground font-medium">{familyMember.allergies && familyMember.allergies.length > 0 ? familyMember.allergies.join(', ') : 'None'}</span></p>
                    <p className="text-muted-foreground flex items-center gap-2"><Stethoscope size={18}/> Chronic Conditions: <span className="text-foreground font-medium">{familyMember.chronicConditions && familyMember.chronicConditions.length > 0 ? familyMember.chronicConditions.join(', ') : 'None'}</span></p>
                </div>
            </div>
        </div>
    );
};

export default FamilyMemberProfilePage;
