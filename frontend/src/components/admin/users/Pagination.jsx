import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex justify-center items-center gap-2 text-sm">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 disabled:opacity-50"><ChevronLeft size={16}/></button>
            <span>Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong></span>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 disabled:opacity-50"><ChevronRight size={16}/></button>
        </div>
    );
};

export default Pagination;