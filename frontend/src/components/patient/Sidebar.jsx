import React, { useState } from 'react';
import { Home, Calendar, FileText, Pill, BarChart2, CreditCard, Settings, LifeBuoy } from 'lucide-react';

const NavLink = ({ icon: Icon, text, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            active 
                ? 'bg-gradient-to-r from-[#0096C7] to-[#2A9D8F] text-white shadow-md' 
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
        }`}
    >
        <Icon size={22} />
        <span className="font-semibold">{text}</span>
    </button>
);

const Sidebar = () => {
    const [activeLink, setActiveLink] = useState('Health Records');

    const navItems = [
        { icon: Home, text: 'Dashboard' },
        { icon: Calendar, text: 'Appointments' },
        { icon: FileText, text: 'Prescriptions' },
        { icon: Pill, text: 'Medicine Finder' },
        { icon: BarChart2, text: 'Health Records' },
        { icon: CreditCard, text: 'Billing' },
        { icon: Settings, text: 'Settings' }
    ];

    return (
        <aside className="w-64 h-full bg-[#111827] text-white flex flex-col p-4">
            <div className="flex items-center space-x-2 mb-10 px-2">
                <div className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end p-2 rounded-md">
                    <span className="text-white font-bold text-lg">H</span>
                </div>
                <span className="text-xl font-semibold">HealthSphere</span>
            </div>

            <nav className="flex-1 flex flex-col space-y-2">
                {navItems.map(item => (
                    <NavLink 
                        key={item.text}
                        icon={item.icon}
                        text={item.text}
                        active={activeLink === item.text}
                        onClick={() => setActiveLink(item.text)}
                    />
                ))}
            </nav>

            <div className="mt-auto bg-gray-800 rounded-lg p-4 text-center">
                <LifeBuoy size={32} className="mx-auto text-gray-400 mb-2" />
                <h3 className="font-bold text-white">Need Help?</h3>
                <p className="text-sm text-gray-400 mt-1">Contact support 24/7</p>
                <button className="mt-4 text-sm font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                    Get Support
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;