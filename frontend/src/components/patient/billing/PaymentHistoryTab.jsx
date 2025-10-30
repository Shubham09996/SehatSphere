import React from 'react';
import { CheckCircle } from 'lucide-react';

const PaymentHistoryTab = ({ history }) => (
    <div className="bg-card p-6 rounded-xl border border-border">
        <h3 className="font-bold text-lg text-foreground mb-4">Transaction History</h3>
        <div className="space-y-4">
            {history.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-muted p-3 rounded-lg">
                    <div>
                        <p className="font-semibold text-foreground">₹{item.amount.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">{item.method}</p>
                    </div>
                     <div>
                        <p className="text-sm text-muted-foreground">{new Date(item.date).toDateString()}</p>
                        <p className="text-xs font-semibold text-green-500 flex items-center gap-1 justify-end"><CheckCircle size={12}/> {item.status}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default PaymentHistoryTab;