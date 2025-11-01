import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { testReports } from '../../data/testsData';
import TestReportCard from './TestReportCard';

const TestReportsResults = ({ searchTerm }) => {
    const searchResults = useMemo(() => {
        if (!searchTerm.trim()) {
            // Show all test reports when no search term
            return testReports;
        }

        return testReports.filter(report =>
            report.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.labName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.summary.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
            {searchResults.length > 0 ? (
                searchResults.map(result => <TestReportCard key={result.id} result={result} />)
            ) : (
                <div className="md:col-span-2 text-center py-12 bg-card rounded-lg text-muted-foreground">
                    {searchTerm.trim() 
                        ? `No test reports found for "${searchTerm}".`
                        : 'No test reports available.'
                    }
                </div>
            )}
        </motion.div>
    );
};

export default TestReportsResults;

