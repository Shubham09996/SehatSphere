import React from 'react';
import { Ticket, Calendar, FileText, Award } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, detail, link, progress, colorClass }) => (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[11rem]">
        <div>
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-muted-foreground">{title}</h3>
                <Icon className="text-muted-foreground" />
            </div>
            
            {progress !== undefined ? (
                <div>
                    <div className="flex justify-between items-baseline mb-1">
                        {/* Adjusted font size to prevent overflow */}
                        <span className="font-bold text-xl sm:text-2xl text-foreground">{value}</span>
                        <span className="text-sm text-muted-foreground">{detail}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div className={`${colorClass} h-2 rounded-full`} style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            ) : (
                <p className="font-bold text-3xl sm:text-4xl text-foreground">{value}</p>
            )}
        </div>

        <div className="mt-4">
            <a href="#" className="text-sm font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                {link}
            </a>
        </div>
    </div>
);

const DashboardStats = ({ stats }) => {
    if (!stats) {
        return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-foreground">Loading stats...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
                icon={Ticket} 
                title="Current Token" 
                value={stats.currentToken} 
                detail={stats.currentTokenDetail}
                link="We'll notify you 10 mins before"
                progress={stats.currentTokenProgress}
                colorClass="bg-blue-500"
            />
            <StatCard 
                icon={Calendar} 
                title="Appointments" 
                value={stats.appointmentsCount} 
                link="View all →"
            />
            <StatCard 
                icon={FileText} 
                title="Prescriptions" 
                value={stats.prescriptionsCount} 
                link="View prescriptions →"
            />
            <StatCard 
                icon={Award} 
                title="Reward Points" 
                value={stats.rewardPoints} 
                link="Redeem rewards →"
            />
        </div>
    );
};

export default DashboardStats;
