import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, MapPin, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const TestReportCard = ({ result }) => {
    const getValueStatus = (value, range) => {
        // Simple heuristic: if value is less than range start or greater than range end, it's abnormal
        // This is a simplified version - actual implementation would depend on the test type
        const rangeNum = range.replace(/[<>\s]/g, '');
        if (range.includes('<')) {
            const threshold = parseFloat(rangeNum);
            const valueNum = parseFloat(value);
            if (valueNum >= threshold) return 'high';
        } else if (range.includes('>')) {
            const threshold = parseFloat(rangeNum);
            const valueNum = parseFloat(value);
            if (valueNum <= threshold) return 'low';
        } else if (range.includes('-')) {
            const [min, max] = range.split('-').map(v => parseFloat(v.trim()));
            const valueNum = parseFloat(value);
            if (valueNum < min) return 'low';
            if (valueNum > max) return 'high';
        }
        return 'normal';
    };

    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 group hover:border-primary transition-colors"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-hs-gradient-start to-hs-gradient-end rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="text-white" size={20} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg text-foreground">{result.testName}</h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <MapPin size={12} />
                            <span>{result.labName}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar size={12} />
                    <span>{result.reportedOn}</span>
                </div>
            </div>

            {result.summary && (
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {result.summary}
                </p>
            )}

            <div className="border-t border-border pt-4">
                <h4 className="text-sm font-semibold text-foreground mb-3">Results:</h4>
                <div className="space-y-2">
                    {result.results.map((res, idx) => {
                        const status = getValueStatus(res.value, res.range);
                        const StatusIcon = status === 'high' ? TrendingUp : status === 'low' ? TrendingDown : Minus;
                        const statusColor = status === 'high' || status === 'low' ? 'text-amber-500' : 'text-emerald-500';
                        
                        return (
                            <div key={idx} className="flex items-center justify-between p-2 bg-background rounded-md">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">{res.name}</p>
                                    <p className="text-xs text-muted-foreground">{res.range}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <StatusIcon size={14} className={statusColor} />
                                    <span className="text-sm font-semibold text-foreground">{res.value}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-auto pt-2">
                <a 
                    href={result.fileUrl} 
                    className="inline-flex items-center justify-center gap-2 w-full font-bold py-2.5 px-4 rounded-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90 transition-opacity"
                >
                    <Download size={16} /> Download Report
                </a>
            </div>
        </motion.div>
    );
};

export default TestReportCard;

