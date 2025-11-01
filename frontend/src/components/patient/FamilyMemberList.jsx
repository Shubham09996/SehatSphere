import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../utils/api';
import { User, Calendar, FileText, Loader2, PlusCircle } from 'lucide-react';

const FamilyMemberList = () => {
    const [familyMembers, setFamilyMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFamilyMembers = async () => {
            try {
                setLoading(true);
                const res = await api.get('/api/family/my-family-members');
                setFamilyMembers(res.data);
            } catch (err) {
                console.error('Error fetching family members:', err);
                setError(err);
                toast.error(err.response?.data?.message || 'Failed to fetch family members.');
            } finally {
                setLoading(false);
            }
        };

        fetchFamilyMembers();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500">Error: {error.message}</div>;
    }

    return (
        <div className="bg-card p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-foreground mb-4">My Family Members ({familyMembers.length}/6)</h2>
            {
                familyMembers.length === 0 ? (
                    <p className="text-muted-foreground">No family members added yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {familyMembers.map(member => (
                            <div key={member._id} className="border border-border p-4 rounded-lg flex flex-col gap-3 bg-background">
                                {member.profilePicture && (
                                    <img 
                                        src={member.profilePicture}
                                        alt={`${member.name}'s profile`}
                                        className="w-16 h-16 rounded-full object-cover self-center mb-4"
                                    />
                                )}
                                <div className="flex items-center gap-2">
                                    <User size={20} className="text-primary" />
                                    <h3 className="font-semibold text-lg text-foreground">{member.name}</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">Patient ID: {member.patientId}</p>
                                <p className="text-sm text-muted-foreground">Gender: {member.gender}</p>
                                {/* Add more details if needed */}

                                <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-dashed border-border">
                                    <Link 
                                        to={`/patient/book-appointment?forFamilyMemberId=${member._id}`}
                                        className="flex items-center gap-1 text-primary hover:underline text-sm"
                                    >
                                        <Calendar size={16} /> Book Appt.
                                    </Link>
                                    <Link 
                                        to={`/patient/family-member-profile/${member._id}`}
                                        className="flex items-center gap-1 text-primary hover:underline text-sm"
                                    >
                                        <User size={16} /> View Profile
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
            {familyMembers.length < 6 && (
                <div className="mt-6">
                    <Link 
                        to="/patient/add-family-member"
                        className="flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end hover:from-hs-gradient-end hover:to-hs-gradient-start focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-foreground"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Family Member
                    </Link>
                </div>
            )}
        </div>
    );
};

export default FamilyMemberList;
