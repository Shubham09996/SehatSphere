import React from 'react';

const HospitalPharmacyPartnersPage = () => {
    return (
        <div className="flex flex-col gap-4 p-4 md:p-6">
            <div className="flex items-center justify-between">
                {/* === GRADIENT COLORS CHANGE KIYE HAIN === */}
                <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">Linked Pharmacy Partners</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="bg-card p-5 rounded-xl border border-border/70 shadow-sm">
                    <div className="mb-3">
                        <h2 className="font-bold text-xl text-foreground">MediCare Pharmacy</h2>
                        <p className="text-sm text-muted-foreground">Contact: +91 98765 43210</p>
                    </div>
                    <div className="text-muted-foreground text-sm">
                        <p>Address: 123 Health St, City, State</p>
                        <p>Last Order: 2023-10-26</p>
                    </div>
                </div>
                <div className="bg-card p-5 rounded-xl border border-border/70 shadow-sm">
                    <div className="mb-3">
                        <h2 className="font-bold text-xl text-foreground">LifeLink Pharmacy</h2>
                        <p className="text-sm text-muted-foreground">Contact: +91 87654 32109</p>
                    </div>
                    <div className="text-muted-foreground text-sm">
                        <p>Address: 456 Wellness Ave, City, State</p>
                        <p>Last Order: 2023-10-20</p>
                    </div>
                </div>
                <div className="bg-card p-5 rounded-xl border border-border/70 shadow-sm">
                    <div className="mb-3">
                        <h2 className="font-bold text-xl text-foreground">HealthHub Pharmacy</h2>
                        <p className="text-sm text-muted-foreground">Contact: +91 76543 21098</p>
                    </div>
                    <div className="text-muted-foreground text-sm">
                        <p>Address: 789 Care Rd, City, State</p>
                        <p>Last Order: 2023-10-15</p>
                    </div>
                </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm mt-4">
                <div className="mb-4">
                    <h2 className="font-bold text-xl text-foreground">Add New Pharmacy Partner</h2>
                    <p className="text-sm text-muted-foreground">Fill out the form below to link a new pharmacy partner.</p>
                </div>
                <div className="text-muted-foreground text-sm">
                    {/* Placeholder for a form to add new partners */}
                    <form className="grid gap-4">
                        <div className="grid gap-2">
                            <label htmlFor="pharmacyName" className="text-sm font-medium">Pharmacy Name</label>
                            <input id="pharmacyName" type="text" placeholder="Enter pharmacy name" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="contactPerson" className="text-sm font-medium">Contact Person</label>
                            <input id="contactPerson" type="text" placeholder="Enter contact person's name" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="contactNumber" className="text-sm font-medium">Contact Number</label>
                            <input id="contactNumber" type="text" placeholder="Enter contact number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="address" className="text-sm font-medium">Address</label>
                            <textarea id="address" placeholder="Enter address" rows="3" className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"></textarea>
                        </div>
                        {/* Add Partner button par gradient */}
                        <button type="submit" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white h-10 px-4 py-2 mt-4 hover:opacity-90">Add Partner</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HospitalPharmacyPartnersPage;