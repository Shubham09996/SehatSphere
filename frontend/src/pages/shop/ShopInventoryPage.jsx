import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { inventoryData as initialInventory } from '../../data/inventoryData';
import { Plus, Search, Package, AlertTriangle, XCircle, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';
import AddMedicineModal from '../../components/shop/inventory/AddMedicineModal'; // NEW: Import the modal component

const ShopInventoryPage = () => {
    const [inventory, setInventory] = useState(initialInventory);
    const [searchTerm, setSearchTerm] = useState('');
    // NEW: State to control the modal's visibility
    const [isModalOpen, setIsModalOpen] = useState(false);

    const stats = useMemo(() => ({
        totalProducts: inventory.length,
        lowStock: inventory.filter(p => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold).length,
        outOfStock: inventory.filter(p => p.stockQuantity === 0).length,
    }), [inventory]);

    const categoryData = useMemo(() => {
        const counts = inventory.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [inventory]);
    
    const COLORS = ['hsl(var(--primary))', '#00C49F', '#FFBB28', '#FF8042'];

    // NEW: Function to handle adding a new medicine
    const handleAddMedicine = (newMedicineData) => {
        const newMedicine = {
            id: `MED${String(inventory.length + 1).padStart(3, '0')}`, // Generate a simple unique ID
            ...newMedicineData,
        };
        setInventory(prevInventory => [newMedicine, ...prevInventory]);
        setIsModalOpen(false); // Close modal on success
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                    Inventory Management
                </h1>
                <p className="text-muted-foreground mt-1">Track, manage, and analyze your medicine stock.</p>
            </div>

            {/* Stock Overview Section (no changes) */}
            <motion.div 
                className="bg-card p-6 rounded-xl border border-border/70 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center gap-3 mb-4">
                    <PieChartIcon className="text-primary"/>
                    <h3 className="font-bold text-lg text-foreground">Stock Overview</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* --- Left Side: Stats --- */}
                    <div className="space-y-4 my-auto">
                        <div className="bg-muted p-4 rounded-lg flex items-center gap-4">
                            <Package size={24} className="text-blue-500 flex-shrink-0"/>
                            <div>
                                <p className="text-2xl font-bold">{stats.totalProducts}</p>
                                <p className="text-xs text-muted-foreground">Total Products</p>
                            </div>
                        </div>
                         <div className="bg-muted p-4 rounded-lg flex items-center gap-4">
                            <AlertTriangle size={24} className="text-orange-500 flex-shrink-0"/>
                            <div>
                                <p className="text-2xl font-bold">{stats.lowStock}</p>
                                <p className="text-xs text-muted-foreground">Low on Stock</p>
                            </div>
                        </div>
                         <div className="bg-muted p-4 rounded-lg flex items-center gap-4">
                            <XCircle size={24} className="text-red-500 flex-shrink-0"/>
                            <div>
                                <p className="text-2xl font-bold">{stats.outOfStock}</p>
                                <p className="text-xs text-muted-foreground">Out of Stock</p>
                            </div>
                        </div>
                    </div>

                    {/* --- Right Side: Chart (Responsive) --- */}
                    <div className="w-full h-64">
                        {/* Pie Chart for Desktop */}
                        <div className="hidden md:block w-full h-full">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5}>
                                        {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                    <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Bar Chart for Mobile/Tablet */}
                        <div className="block md:hidden w-full h-full">
                            <ResponsiveContainer>
                                <BarChart data={categoryData} layout="vertical" margin={{top: 5, right: 20, left: 20, bottom: 5}}>
                                     <XAxis type="number" hide />
                                     <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} fontSize={12} width={80}/>
                                     <Tooltip />
                                     <Bar dataKey="value" barSize={20}>
                                        {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                     </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </motion.div>
            
            {/* Main Table Section */}
            <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                 <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                    <h3 className="font-bold text-lg text-foreground">All Medicines</h3>
                    <div className="flex gap-2">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input type="text" placeholder="Search medicine..." onChange={e => setSearchTerm(e.target.value)} className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm"/>
                        </div>
                        {/* UPDATED: onClick handler to open the modal */}
                        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 font-semibold py-2 px-4 rounded-lg bg-primary text-primary-foreground text-sm"><Plus size={16}/> Add New</button>
                    </div>
                </div>
                 <div className="h-[50vh] overflow-auto border border-border rounded-lg">
                    <table className="w-full text-left">
                        <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm text-xs text-muted-foreground uppercase z-10">
                             <tr>
                                {/* NEW: Added Image column header */}
                                <th className="p-3"></th> 
                                <th className="p-3">Product Name</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">Price</th>
                                <th className="p-3">Quantity</th>
                                <th className="p-3">Status</th>
                             </tr>
                        </thead>
                        <tbody>
                             {inventory.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => {
                                const isLow = item.stockQuantity > 0 && item.stockQuantity <= item.lowStockThreshold;
                                const isOut = item.stockQuantity === 0;
                                return (
                                    <tr key={item.id} className="border-b border-border hover:bg-muted cursor-pointer">
                                        {/* NEW: Added Image cell */}
                                        <td className="p-3">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded-md border border-border"/>
                                            ) : (
                                                <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center text-muted-foreground border border-border">
                                                    <Package size={16}/>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3 font-semibold text-foreground">{item.name}</td>
                                        <td className="p-3 text-muted-foreground">{item.category}</td>
                                        <td className="p-3 text-muted-foreground">₹{item.price.toFixed(2)}</td>
                                        <td className="p-3 font-bold">{item.stockQuantity}</td>
                                        <td className="p-3">
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isOut ? 'bg-red-100 text-red-800' : isLow ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                                                {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                                            </span>
                                        </td>
                                    </tr>
                                )
                             })}
                        </tbody>
                    </table>
                 </div>
            </div>

            {/* NEW: Render the Add Medicine Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <AddMedicineModal 
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onAddMedicine={handleAddMedicine}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ShopInventoryPage;