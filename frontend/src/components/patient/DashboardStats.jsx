import React from 'react';
import { Ticket, Calendar, FileText, Award } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link

const StatCard = ({ icon: Icon, title, value, detail, link, progress, colorClass, to }) => (
    <div className="bg-card p-4 sm:p-6 rounded-lg sm:rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[9rem] sm:min-h-[11rem]">
        <div>
            <div className="flex justify-between items-start mb-3 sm:mb-4">
                <h3 className="font-semibold text-xs sm:text-sm text-muted-foreground truncate pr-2">{title}</h3>
                <Icon className="text-muted-foreground flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            
            {progress !== undefined ? (
                <div>
                    <div className="flex justify-between items-baseline mb-1 gap-2">
                        {/* Adjusted font size to prevent overflow */}
                        <span className="font-bold text-lg sm:text-xl lg:text-2xl text-foreground truncate">{value}</span>
                        <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">{detail}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 dark:bg-gray-700 mt-2">
                        <div className={`${colorClass} h-1.5 sm:h-2 rounded-full`} style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            ) : (
                <p className="font-bold text-2xl sm:text-3xl lg:text-4xl text-foreground">{value}</p>
            )}
        </div>

        <div className="mt-3 sm:mt-4">
            {to ? (
                <Link to={to} className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text block truncate">
                    {link}
                </Link>
            ) : (
                <span className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text block truncate">
                    {link}
                </span>
            )}
        </div>
    </div>
);

const DashboardStats = ({ stats }) => {
    if (!stats) {
        return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-foreground">Loading stats...</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
                to="/patient/appointments"
            />
            <StatCard 
                icon={FileText} 
                title="Prescriptions" 
                value={stats.prescriptionsCount} 
                link="View all →"
                to="/patient/prescriptions"
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
