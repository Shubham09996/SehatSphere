import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { bookedTests } from '../../data/testsData';
import BookedTestCard from './BookedTestCard';

const BookedTestsResults = ({ searchTerm }) => {
    const searchResults = useMemo(() => {
        if (!searchTerm.trim()) {
            // Show all booked tests when no search term
            return bookedTests;
        }

        return bookedTests.filter(test =>
            test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            test.labName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            test.bookingRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
            test.status.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <motion.div 
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
            {searchResults.length > 0 ? (
                searchResults.map(result => <BookedTestCard key={result.id} result={result} />)
            ) : (
                <div className="text-center py-12 bg-card rounded-lg text-muted-foreground">
                    {searchTerm.trim() 
                        ? `No booked tests found for "${searchTerm}".`
                        : 'No booked tests available.'
                    }
                </div>
            )}
        </motion.div>
    );
};

export default BookedTestsResults;

