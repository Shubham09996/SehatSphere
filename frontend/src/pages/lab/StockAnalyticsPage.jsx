import React from 'react';

const StockAnalyticsPage = () => {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-background text-foreground">
      <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text mb-6">📦 Stock Analytics (Inventory)</h1>

      {/* Kit/Reagent Inventory Section */}
      <div className="bg-card rounded-lg shadow-md p-6 mb-8 border border-border">
        <h2 className="text-xl font-semibold mb-4">Kit/Reagent Inventory</h2>
        <p className="text-muted-foreground mb-4">
          Manage and track test kits, chemicals, and other lab supplies.
        </p>
        {/* Placeholder for inventory list */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-background border border-border rounded-lg shadow-sm">
            <thead>
              <tr className="w-full bg-muted text-foreground uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Item Name</th>
                <th className="py-3 px-6 text-left">Quantity</th>
                <th className="py-3 px-6 text-left">Unit</th>
                <th className="py-3 px-6 text-left">Expiry Date</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground text-sm font-light">
              <tr className="border-b border-border hover:bg-muted/50">
                <td className="py-3 px-6 text-left">COVID-19 Test Kit</td>
                <td className="py-3 px-6 text-left">150</td>
                <td className="py-3 px-6 text-left">Boxes</td>
                <td className="py-3 px-6 text-left">2025-12-31</td>
                <td className="py-3 px-6 text-left">
                  <button className="px-3 py-1 mr-2 bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white rounded-md hover:opacity-90 transition-opacity">Edit</button>
                  <button className="px-3 py-1 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90">Delete</button>
                </td>
              </tr>
              <tr className="border-b border-border hover:bg-muted/50">
                <td className="py-3 px-6 text-left">Blood Culture Bottles</td>
                <td className="py-3 px-6 text-left">200</td>
                <td className="py-3 px-6 text-left">Vials</td>
                <td className="py-3 px-6 text-left">2024-11-01</td>
                <td className="py-3 px-6 text-left">
                  <button className="px-3 py-1 mr-2 bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white rounded-md hover:opacity-90 transition-opacity">Edit</button>
                  <button className="px-3 py-1 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90">Delete</button>
                </td>
              </tr>
              <tr className="border-b border-border hover:bg-muted/50">
                <td className="py-3 px-6 text-left">Glucose Reagent</td>
                <td className="py-3 px-6 text-left">50</td>
                <td className="py-3 px-6 text-left">Litres</td>
                <td className="py-3 px-6 text-left">2025-06-30</td>
                <td className="py-3 px-6 text-left">
                  <button className="px-3 py-1 mr-2 bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white rounded-md hover:opacity-90 transition-opacity">Edit</button>
                  <button className="px-3 py-1 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button className="mt-6 px-4 py-2 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white rounded-md hover:opacity-90 transition-opacity">
          Add New Item
        </button>
      </div>

      {/* Low Stock Alerts Section */}
      <div className="bg-card rounded-lg shadow-md p-6 border border-border">
        <h2 className="text-xl font-semibold mb-4">Low Stock Alerts</h2>
        <p className="text-muted-foreground mb-4">
          Receive automatic alerts when supply levels are low.
        </p>
        <ul className="space-y-3">
          {/* CRITICAL ALERT - Adjusted to fit theme */}
          <li className="flex justify-between items-center p-3 border border-red-500 bg-destructive/20 rounded-md">
            <span className="font-medium text-destructive">Critical: Glucose Reagent (50 Litres left)</span>
            <button className="px-3 py-1 bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white rounded-md hover:opacity-90 transition-colors">Order Now!</button>
          </li>
          {/* WARNING ALERT - Adjusted to fit theme */}
          <li className="flex justify-between items-center p-3 border border-yellow-500 bg-yellow-500/20 rounded-md">
            <span className="font-medium text-yellow-300">Warning: Blood Culture Bottles (200 Vials left)</span>
            <button className="px-3 py-1 bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white rounded-md hover:opacity-90 transition-colors">Reorder Soon</button>
          </li>
        </ul>
        <button className="mt-6 px-4 py-2 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white rounded-md hover:opacity-90 transition-opacity">
          View All Alerts
        </button>
      </div>
    </div>
  );
};

export default StockAnalyticsPage;