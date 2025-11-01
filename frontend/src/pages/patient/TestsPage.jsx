import React from 'react';
import { FlaskConical, FileText, Download } from 'lucide-react';
import { bookedTests, testReports } from '../../data/testsData';

const StatusPill = ({ status }) => {
    const map = {
        'Scheduled': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        'Pending Sample': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
        'Confirmed': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
        'Completed': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
    };
    const cls = map[status] || 'bg-muted text-foreground';
    return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>{status}</span>;
};

const TestsPage = () => {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                    <span className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                        Diagnostic Tests
                    </span>
                    <FlaskConical size={26} />
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">View your booked tests and downloaded reports</p>
            </div>

            {/* Booked Tests */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <FlaskConical size={20} /> Booked Tests
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left text-muted-foreground border-b border-border">
                                <th className="py-3 pr-4">Test</th>
                                <th className="py-3 pr-4">Lab</th>
                                <th className="py-3 pr-4">Date</th>
                                <th className="py-3 pr-4">Time</th>
                                <th className="py-3 pr-4">Status</th>
                                <th className="py-3 pr-4">Ref</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookedTests.map(t => (
                                <tr key={t.id} className="border-b border-border/50 last:border-b-0">
                                    <td className="py-3 pr-4 font-medium text-foreground">{t.testName}</td>
                                    <td className="py-3 pr-4">{t.labName}</td>
                                    <td className="py-3 pr-4">{t.scheduledDate}</td>
                                    <td className="py-3 pr-4">{t.scheduledTime}</td>
                                    <td className="py-3 pr-4"><StatusPill status={t.status} /></td>
                                    <td className="py-3 pr-4 text-muted-foreground">{t.bookingRef}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Test Reports */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <FileText size={20} /> Test Reports
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {testReports.map(r => (
                        <div key={r.id} className="bg-background border border-border rounded-xl p-4 flex flex-col gap-3">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-semibold text-foreground">{r.testName}</p>
                                    <p className="text-xs text-muted-foreground">{r.labName}</p>
                                </div>
                                <span className="text-xs text-muted-foreground">{r.reportedOn}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{r.summary}</p>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-xs">
                                    <thead>
                                        <tr className="text-left text-muted-foreground">
                                            <th className="py-1 pr-3">Parameter</th>
                                            <th className="py-1 pr-3">Value</th>
                                            <th className="py-1 pr-3">Reference</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {r.results.map((res, idx) => (
                                            <tr key={idx} className="border-t border-border/50">
                                                <td className="py-1 pr-3">{res.name}</td>
                                                <td className="py-1 pr-3 font-medium text-foreground">{res.value}</td>
                                                <td className="py-1 pr-3 text-muted-foreground">{res.range}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-end">
                                <a href={r.fileUrl} className="inline-flex items-center gap-2 text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90">
                                    <Download size={16} /> Download
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestsPage;



