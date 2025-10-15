import React from 'react';
import { AlertTriangle } from 'lucide-react';

const SystemAlerts = ({ systemAlerts }) => (
    <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
        <h3 className="font-bold text-lg text-foreground mb-4">System Alerts</h3>
        <div className="space-y-3">
            {systemAlerts.map(alert => (
                 <div key={alert._id} className={`p-3 rounded-lg flex items-start gap-3 ${alert.severity === 'High' ? 'bg-red-500/10' : 'bg-orange-500/10'}`}>
                     <AlertTriangle className={`mt-0.5 flex-shrink-0 ${alert.severity === 'High' ? 'text-red-500' : 'text-orange-500'}`} size={16}/>
                    <div>
                         <p className="font-semibold text-foreground text-sm">{alert.category} Warning</p>
                         <p className="text-xs text-muted-foreground">{alert.message}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
export default SystemAlerts;