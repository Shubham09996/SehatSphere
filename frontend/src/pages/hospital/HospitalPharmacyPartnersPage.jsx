import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const HospitalPharmacyPartnersPage = () => {
    const [pharmacyPartners, setPharmacyPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newPartner, setNewPartner] = useState({
        pharmacyName: '',
        contactPerson: '',
        contactNumber: '',
        address: '',
    });

    useEffect(() => {
        const fetchPharmacyPartners = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/api/hospitals/pharmacy-partners');
                setPharmacyPartners(data);
                toast.success('Pharmacy partners loaded successfully!');
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                toast.error(err.response?.data?.message || err.message);
                setPharmacyPartners([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPharmacyPartners();
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setNewPartner((prev) => ({ ...prev, [id]: value }));
    };

    const handleAddPartner = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/api/hospitals/pharmacy-partners', newPartner);
            setPharmacyPartners((prev) => [...prev, { ...newPartner, id: prev.length + 1 }]); // Add with a temporary ID
            setNewPartner({ pharmacyName: '', contactPerson: '', contactNumber: '', address: '' });
            toast.success(data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };

    if (loading) {
        return <div className="flex flex-col gap-4 p-4 md:p-6 text-center text-foreground">Loading pharmacy partners...</div>;
    }

    if (error) {
        return <div className="flex flex-col gap-4 p-4 md:p-6 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="flex flex-col gap-4 p-4 md:p-6">
            <div className="flex items-center justify-between">
                {/* === GRADIENT COLORS CHANGE KIYE HAIN === */}
                <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">Linked Pharmacy Partners</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pharmacyPartners.map((partner) => (
                    <div key={partner.id} className="bg-card p-5 rounded-xl border border-border/70 shadow-sm">
                        <div className="mb-3">
                            <h2 className="font-bold text-xl text-foreground">{partner.name}</h2>
                            <p className="text-sm text-muted-foreground">Contact: {partner.contact}</p>
                        </div>
                        <div className="text-muted-foreground text-sm">
                            <p>Address: {partner.address}</p>
                            <p>Last Order: {partner.lastOrder}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm mt-4">
                <div className="mb-4">
                    <h2 className="font-bold text-xl text-foreground">Add New Pharmacy Partner</h2>
                    <p className="text-sm text-muted-foreground">Fill out the form below to link a new pharmacy partner.</p>
                </div>
                <div className="text-muted-foreground text-sm">
                    <form onSubmit={handleAddPartner} className="grid gap-4">
                        <div className="grid gap-2">
                            <label htmlFor="pharmacyName" className="text-sm font-medium">Pharmacy Name</label>
                            <input id="pharmacyName" type="text" placeholder="Enter pharmacy name" value={newPartner.pharmacyName} onChange={handleInputChange} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="contactPerson" className="text-sm font-medium">Contact Person</label>
                            <input id="contactPerson" type="text" placeholder="Enter contact person's name" value={newPartner.contactPerson} onChange={handleInputChange} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="contactNumber" className="text-sm font-medium">Contact Number</label>
                            <input id="contactNumber" type="text" placeholder="Enter contact number" value={newPartner.contactNumber} onChange={handleInputChange} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="address" className="text-sm font-medium">Address</label>
                            <textarea id="address" placeholder="Enter address" rows="3" value={newPartner.address} onChange={handleInputChange} required className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"></textarea>
                        </div>
                        <button type="submit" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white h-10 px-4 py-2 mt-4 hover:opacity-90">Add Partner</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HospitalPharmacyPartnersPage;