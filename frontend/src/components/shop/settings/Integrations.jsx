import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Zap, CheckCircle } from 'lucide-react';
import api from '../../../utils/api'; // api.js se import karein

const Integrations = () => {
    const { isPremium } = useOutletContext();
    const [tata1mgIntegrated, setTata1mgIntegrated] = useState(false);
    const [pharmeasyIntegrated, setPharmEasyIntegrated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const shopId = '652a209b78a7c2a71f09c693'; // Replace with actual shop ID from context/auth

    useEffect(() => {
        const fetchIntegrationSettings = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/shops/${shopId}/settings/integrations`);
                const { tata1mgIntegrated, pharmeasyIntegrated } = response.data.integrations;
                setTata1mgIntegrated(tata1mgIntegrated);
                setPharmEasyIntegrated(pharmeasyIntegrated);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (isPremium) {
            fetchIntegrationSettings();
        }
    }, [shopId, isPremium]);

    const handleConnectTata1mg = async () => {
        setSaving(true);
        setSaveSuccess(false);
        try {
            await api.put(`/shops/${shopId}/settings/integrations`, { tata1mgIntegrated: !tata1mgIntegrated });
            setTata1mgIntegrated(prev => !prev);
            setSaveSuccess(true);
        } catch (err) {
            setError(err);
        } finally {
            setSaving(false);
            setTimeout(() => setSaveSuccess(false), 3000);
        }
    };

    const handleConnectPharmEasy = async () => {
        setSaving(true);
        setSaveSuccess(false);
        try {
            await api.put(`/shops/${shopId}/settings/integrations`, { pharmeasyIntegrated: !pharmeasyIntegrated });
            setPharmEasyIntegrated(prev => !prev);
            setSaveSuccess(true);
        } catch (err) {
            setError(err);
        } finally {
            setSaving(false);
            setTimeout(() => setSaveSuccess(false), 3000);
        }
    };

    if (!isPremium) {
        return (
             <div className="text-center bg-card p-8 rounded-2xl border-2 border-dashed border-border shadow-sm">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Zap size={32} className="text-primary"/>
                </div>
                <h1 className="text-2xl font-bold text-foreground">Unlock API Integrations</h1>
                <p className="text-muted-foreground mt-2 mb-6">Upgrade to Premium to connect with platforms like 1mg & PharmEasy, automate stock, and more.</p>
                <button className="font-semibold py-3 px-6 rounded-lg bg-primary text-primary-foreground">Upgrade to Premium</button>
            </div>
        );
    }
    
    return (
         <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
             <h3 className="font-bold text-lg text-foreground mb-4">API Integrations (Premium)</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-3"><img src="https://onemg.gumlet.io/image/upload/v1631894338/1mg_logo_square_mark_blue.png" className="h-8 w-8" alt="Tata 1mg"/> <span className="font-semibold">Tata 1mg</span></div>
                    {tata1mgIntegrated ? (
                        <div className="flex items-center gap-2 text-sm font-semibold text-green-500"><CheckCircle size={16}/> Connected</div>
                    ) : (
                        <button 
                            className="font-semibold py-1 px-3 text-sm rounded-lg border border-border hover:bg-border"
                            onClick={handleConnectTata1mg}
                            disabled={saving}
                        >
                            {saving ? 'Connecting...' : 'Connect'}
                        </button>
                    )}
                </div>
                 <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-3"><img src="https://assets.pharmeasy.in/web-assets/dist/fca22bc9.png" className="h-8 w-8" alt="PharmEasy"/> <span className="font-semibold">PharmEasy</span></div>
                    {pharmeasyIntegrated ? (
                        <div className="flex items-center gap-2 text-sm font-semibold text-green-500"><CheckCircle size={16}/> Connected</div>
                    ) : (
                        <button 
                            className="font-semibold py-1 px-3 text-sm rounded-lg border border-border hover:bg-border"
                            onClick={handleConnectPharmEasy}
                            disabled={saving}
                        >
                            {saving ? 'Connecting...' : 'Connect'}
                        </button>
                    )}
                </div>
             </div>
            {saveSuccess && <p className="text-green-500 text-sm mt-4">Integration status updated successfully!</p>}
         </div>
    );
};
export default Integrations;