import React from 'react';
import { BrainCircuit, Users, DollarSign } from 'lucide-react';
import { shopData } from '../../../data/shopData';
import LockedFeatureCard from './LockedFeatureCard';

const PremiumInsights = ({ isPremium }) => {
    const { aiStockForecast, topCustomers, profitability } = shopData;

    if (!isPremium) {
        return (
            <LockedFeatureCard title="Premium Insights">
                {/* Dummy content for blurring */}
                 <div className="space-y-2">
                    <div className="h-12 bg-muted rounded-md"></div>
                    <div className="h-12 bg-muted rounded-md"></div>
                    <div className="h-12 bg-muted rounded-md"></div>
                </div>
            </LockedFeatureCard>
        );
    }

    return (
        <div className="space-y-8">
            <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2"><BrainCircuit className="text-primary"/> AI Stock Forecast</h3>
                {aiStockForecast.map(item => (
                    <div key={item.medicineName} className="text-sm p-2 rounded-md hover:bg-muted">
                        <p className="font-semibold">{item.medicineName}</p>
                        <p className="text-xs text-orange-500">Est. Run Out: <span className="font-bold">{item.runOutEstimate}</span></p>
                    </div>
                ))}
            </div>
            <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2"><Users className="text-primary"/> Patient Loyalty</h3>
                <p className="text-xs text-muted-foreground mb-2">Top Customers (This Month)</p>
                {topCustomers.map(item => (
                    <div key={item.name} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-muted">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-muted-foreground font-bold">{item.spend}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PremiumInsights;