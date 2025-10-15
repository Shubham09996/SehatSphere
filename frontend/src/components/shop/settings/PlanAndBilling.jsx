import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import api from '../../../utils/api'; // api.js se import karein

const PlanAndBilling = () => {
    const [currentPlan, setCurrentPlan] = useState('Free');
    const [price, setPrice] = useState('0');
    const [nextBillingDate, setNextBillingDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [upgrading, setUpgrading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Dummy shop ID for now
    const shopId = '652a209b78a7c2a71f09c693'; // Replace with actual shop ID from context/auth

    useEffect(() => {
        const fetchSubscriptionData = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/shops/${shopId}/subscription`);
                const { plan, price, nextBillingDate } = response.data.subscription;
                setCurrentPlan(plan);
                setPrice(price);
                setNextBillingDate(nextBillingDate);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptionData();
    }, [shopId]);

    const handleManagePlan = async () => {
        setUpgrading(true);
        setSaveSuccess(false);
        try {
            // Implement actual plan upgrade logic here
            // For now, it's a dummy upgrade to Premium
            await api.put(`/shops/${shopId}/subscription`, { plan: 'Premium' });
            setCurrentPlan('Premium');
            setPrice('999'); // Example price for premium
            setNextBillingDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()); // 30 days from now
            setSaveSuccess(true);
        } catch (err) {
            setError(err);
        } finally {
            setUpgrading(false);
            setTimeout(() => setSaveSuccess(false), 3000);
        }
    };

    if (loading) return <div className="text-center py-4">Loading subscription details...</div>;
    if (error) return <div className="text-center py-4 text-red-500">Error: {error.message}</div>;

    return (
        <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h3 className="font-bold text-lg text-foreground">Current Plan</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-2xl bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">{currentPlan} Tier</span>
                        {currentPlan === 'Premium' && <Star className="text-yellow-500 fill-yellow-500" />}
                    </div>
                </div>
                <button 
                    className="font-semibold py-2 px-4 rounded-lg border border-border hover:bg-muted self-start sm:self-center"
                    onClick={handleManagePlan}
                    disabled={upgrading}
                >
                    {upgrading ? 'Upgrading...' : 'Manage Plan'}
                </button>
            </div>
            <div className="border-t border-border my-4"></div>
            <div className="text-sm space-y-2">
                <p><span className="text-muted-foreground">Monthly Price:</span> <span className="font-semibold text-foreground">₹{price}</span></p>
                <p><span className="text-muted-foreground">Next Billing Date:</span> <span className="font-semibold text-foreground">{nextBillingDate ? new Date(nextBillingDate).toDateString() : 'N/A'}</span></p>
            </div>
            {saveSuccess && <p className="text-green-500 text-sm mt-2">Plan updated successfully!</p>}
        </div>
    );
};

export default PlanAndBilling;