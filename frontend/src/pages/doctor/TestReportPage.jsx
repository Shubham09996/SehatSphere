import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Calendar, FlaskConical } from 'lucide-react';
import api from '../../utils/api';

const TestReportPage = () => {
    const [testReports, setTestReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [testTypeFilter, setTestTypeFilter] = useState('All');
    const [timeFilter, setTimeFilter] = useState('All');
    
    // Test types filter options
    const testTypes = [
        'All',
        'Blood Test',
        'Urine Analysis',
        'X-Ray',
        'MRI Scan',
        'CT Scan',
        'Ultrasound',
        'ECG',
        'Thyroid Panel',
        'Lipid Profile',
        'Liver Function Test',
        'Kidney Function Test'
    ];
    
    // Time filter options
    const timeFilters = [
        'All',
        'Today',
        'Yesterday',
        'Last 7 Days',
        'Last 30 Days',
        'This Week',
        'This Month'
    ];

    useEffect(() => {
        const fetchTestReports = async () => {
            try {
                setLoading(true);
                const doctorProfileId = localStorage.getItem('doctorProfileId');
                if (!doctorProfileId) {
                    // If no doctor profile ID, use mock data
                    setTestReports(generateMockData());
                    setLoading(false);
                    return;
                }
                
                // Fetch test reports from API
                // You may need to adjust this endpoint based on your backend
                try {
                    const response = await api.get(`/api/doctors/test-reports/${doctorProfileId}`);
                    if (response.data && response.data.testReports) {
                        setTestReports(response.data.testReports);
                    } else {
                        setTestReports([]);
                    }
                } catch (apiError) {
                    // If API endpoint doesn't exist (404) or fails, use mock data
                    console.warn('API endpoint not available, using mock data:', apiError.message);
                    setTestReports(generateMockData());
                }
            } catch (err) {
                console.error('Error fetching test reports:', err);
                // Use mock data as fallback
                setTestReports(generateMockData());
            } finally {
                setLoading(false);
            }
        };

        fetchTestReports();
    }, []);

    // Generate mock test report data
    const generateMockData = () => {
        const testTypes = ['Blood Test', 'Urine Analysis', 'X-Ray', 'MRI Scan', 'CT Scan', 'Ultrasound', 'ECG', 'Thyroid Panel', 'Lipid Profile'];
        const patientNames = ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Brown', 'Sarah Wilson', 'David Lee', 'Lisa Anderson'];
        const statuses = ['Completed', 'Pending', 'In Progress'];
        
        const mockReports = [];
        const now = new Date();
        
        for (let i = 0; i < 15; i++) {
            const daysAgo = Math.floor(Math.random() * 30);
            const reportDate = new Date(now);
            reportDate.setDate(reportDate.getDate() - daysAgo);
            
            mockReports.push({
                _id: `test_${i + 1}`,
                testId: `TR${String(i + 1).padStart(6, '0')}`,
                patientName: patientNames[Math.floor(Math.random() * patientNames.length)],
                testName: testTypes[Math.floor(Math.random() * testTypes.length)],
                testType: testTypes[Math.floor(Math.random() * testTypes.length)],
                date: reportDate.toISOString(),
                status: statuses[Math.floor(Math.random() * statuses.length)]
            });
        }
        
        return mockReports.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    // Filter reports based on search query and filters
    useEffect(() => {
        let filtered = [...testReports];

        // Apply search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(report =>
                report.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                report.testName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                report.testId?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply test type filter
        if (testTypeFilter !== 'All') {
            filtered = filtered.filter(report => report.testType === testTypeFilter);
        }

        // Apply time filter
        if (timeFilter !== 'All') {
            const now = new Date();
            filtered = filtered.filter(report => {
                const reportDate = new Date(report.date);
                switch (timeFilter) {
                    case 'Today':
                        return reportDate.toDateString() === now.toDateString();
                    case 'Yesterday':
                        const yesterday = new Date(now);
                        yesterday.setDate(yesterday.getDate() - 1);
                        return reportDate.toDateString() === yesterday.toDateString();
                    case 'Last 7 Days':
                        const sevenDaysAgo = new Date(now);
                        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                        return reportDate >= sevenDaysAgo;
                    case 'Last 30 Days':
                        const thirtyDaysAgo = new Date(now);
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                        return reportDate >= thirtyDaysAgo;
                    case 'This Week':
                        const startOfWeek = new Date(now);
                        startOfWeek.setDate(now.getDate() - now.getDay());
                        startOfWeek.setHours(0, 0, 0, 0);
                        return reportDate >= startOfWeek;
                    case 'This Month':
                        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                        return reportDate >= startOfMonth;
                    default:
                        return true;
                }
            });
        }

        setFilteredReports(filtered);
    }, [testReports, searchQuery, testTypeFilter, timeFilter]);

    const handleDownload = (reportId) => {
        // Implement download functionality
        console.log('Downloading report:', reportId);
        // You can call an API to download the report PDF
    };

    const handleView = (reportId) => {
        // Implement view functionality
        console.log('Viewing report:', reportId);
        // You can navigate to a detailed view or open a modal
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading test reports...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-8">
                <p>Error loading test reports: {error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                    Test Reports
                </h1>
                <p className="text-muted-foreground mt-1">View and manage all test reports for your patients</p>
            </div>

            {/* Search and Filters Section */}
            <div className="bg-card p-4 sm:p-6 rounded-lg sm:rounded-xl border border-border shadow-sm">
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by patient name, test name, or test ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle text-foreground placeholder:text-muted-foreground"
                        />
                    </div>

                    {/* Filters Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Test Type Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Test Type
                            </label>
                            <select
                                value={testTypeFilter}
                                onChange={(e) => setTestTypeFilter(e.target.value)}
                                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle text-foreground"
                            >
                                {testTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* Days/Weeks Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Time Period
                            </label>
                            <select
                                value={timeFilter}
                                onChange={(e) => setTimeFilter(e.target.value)}
                                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle text-foreground"
                            >
                                {timeFilters.map(filter => (
                                    <option key={filter} value={filter}>{filter}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{filteredReports.length}</span> of{' '}
                    <span className="font-semibold text-foreground">{testReports.length}</span> test reports
                </p>
            </div>

            {/* Test Reports Table */}
            <div className="bg-card rounded-lg sm:rounded-xl border border-border shadow-sm overflow-hidden">
                {filteredReports.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Test ID
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Patient Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Test Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Test Type
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-background divide-y divide-border">
                                {filteredReports.map((report) => (
                                    <tr key={report._id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-foreground">
                                            {report.testId || report._id?.slice(-8)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground">
                                            {report.patientName || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground">
                                            <div className="flex items-center gap-2">
                                                <FlaskConical className="w-4 h-4 text-primary" />
                                                {report.testName || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                                            {report.testType || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                                            {report.date ? new Date(report.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            }) : 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                report.status === 'Completed' 
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                                    : report.status === 'Pending'
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                                            }`}>
                                                {report.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleView(report._id)}
                                                    className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                                                    title="View Report"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    <span className="hidden sm:inline">View</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDownload(report._id)}
                                                    className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                                                    title="Download Report"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    <span className="hidden sm:inline">Download</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <FlaskConical className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground text-lg font-semibold">No test reports found</p>
                        <p className="text-muted-foreground text-sm mt-2">
                            {searchQuery || testTypeFilter !== 'All' || timeFilter !== 'All'
                                ? 'Try adjusting your search or filters'
                                : 'No test reports available at this time'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestReportPage;
