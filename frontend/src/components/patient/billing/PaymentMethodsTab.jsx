import React from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

const PaymentMethodsTab = ({ methods }) => (
    <div className="bg-card p-6 rounded-xl border border-border">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-foreground">Saved Payment Methods</h3>
             
             {/* === IS BUTTON KO FIX KIYA HAI === */}
             <button className="flex items-center gap-2 text-sm font-semibold">
                <span className="text-primary"><PlusCircle size={16}/></span>
                <span className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                    Add New
                </span>
             </button>
        </div>
        <div className="space-y-3">
              {methods.map(method => (
                  <div key={method.id} className="flex justify-between items-center bg-muted p-4 rounded-lg">
                      <div className="flex items-center gap-4">
                          {/* You can add card logos here */}
                          <div className="font-bold text-foreground">{method.type}</div>
                          <div>
                              <p className="font-semibold text-foreground">**** **** **** {method.last4}</p>
                              <p className="text-xs text-muted-foreground">Expires {method.expiry}</p>
                          </div>
                      </div>
                      <button className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                  </div>
              ))}
        </div>
    </div>
);

export default PaymentMethodsTab;