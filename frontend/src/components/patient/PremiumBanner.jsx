import React from 'react';
import { Award } from 'lucide-react';

const PremiumBanner = () => {
    return (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 dark:border-yellow-600 text-yellow-800 dark:text-yellow-200 p-3 rounded-lg flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center">
                <Award size={24} className="text-yellow-600 dark:text-yellow-500 mr-3 flex-shrink-0" />
                <div>
                    <h3 className="font-bold text-sm sm:text-base">Try Premium for 7 days free!</h3>
                    <p className="text-xs sm:text-sm">Get priority tokens and reduce wait time by 60%</p>
                </div>
            </div>
            <button className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors text-sm flex-shrink-0">
                Start Trial
            </button>
        </div>
    );
};

export default PremiumBanner;