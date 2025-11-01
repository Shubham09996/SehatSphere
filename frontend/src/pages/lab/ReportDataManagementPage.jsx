import React, { useState, useEffect } from 'react'; // NEW: Import useEffect
import api from '../../utils/api'; // NEW: Import api
import { useAuth } from '../../context/AuthContext'; // NEW: Import useAuth
import { toast } from 'react-toastify'; // NEW: Import toast for notifications

const ReportDataManagementPage = () => {
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(''); // For Generate Report section
  const [selectedPatientToUpload, setSelectedPatientToUpload] = useState(''); // NEW: For Upload Reports section
  const [selectedFile, setSelectedFile] = useState(null); // NEW: For Upload Reports section
  const [testName, setTestName] = useState(''); // NEW: For manual report generation
  const [testResults, setTestResults] = useState(''); // NEW: For manual report generation
  const [comments, setComments] = useState(''); // NEW: For manual report generation
  const [isReportGenerated, setIsReportGenerated] = useState(false); // NEW: State for report generation status
  const [patients, setPatients] = useState([]); // State for patients fetched from backend
  const [doctors, setDoctors] = useState([]); // State for doctors fetched from backend
  const [reports, setReports] = useState([]); // State for report history fetched from backend
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [errorPatients, setErrorPatients] = useState(null);
  const [errorDoctors, setErrorDoctors] = useState(null);
  const [errorReports, setErrorReports] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // For report history search

  // Removed mockPatientData and mockDoctorData
  // const mockPatientData = [
  //   { id: 'P001', name: 'John Doe', doctorId: 'D001' },
  //   { id: 'P002', name: 'Jane Smith', doctorId: 'D002' },
  //   { id: 'P003', name: 'Peter Jones', doctorId: 'D001' },
  // ];

  // const mockDoctorData = [
  //   { id: 'D001', name: 'Dr. Sarah Johnson' },
  //   { id: 'D002', name: 'Dr. Michael Brown' },
  // ];

  useEffect(() => {
    const fetchPatientsAndDoctors = async () => {
      if (!user || !user.lab) {
        setErrorPatients('User not authorized or lab ID not found.');
        setErrorDoctors('User not authorized or lab ID not found.');
        setLoadingPatients(false);
        setLoadingDoctors(false);
        return;
      }

      try {
        setLoadingPatients(true);
        const patientsRes = await api.get('/api/labs/patients', { params: { labId: user.lab._id } });
        setPatients(patientsRes.data);
        setLoadingPatients(false);
      } catch (err) {
        console.error('Failed to fetch patients:', err);
        setErrorPatients(err.response?.data?.message || err.message || 'Failed to fetch patients');
        setLoadingPatients(false);
      }

      try {
        setLoadingDoctors(true);
        const doctorsRes = await api.get('/api/labs/doctors', { params: { labId: user.lab._id } }); // Assuming you want doctors associated with the lab or its network
        setDoctors(doctorsRes.data);
        setLoadingDoctors(false);
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
        setErrorDoctors(err.response?.data?.message || err.message || 'Failed to fetch doctors');
        setLoadingDoctors(false);
      }
    };

    const fetchReportHistory = async () => {
      if (!user || !user.lab) {
        setErrorReports('User not authorized or lab ID not found.');
        setLoadingReports(false);
        return;
      }
      setLoadingReports(true);
      try {
        const reportsRes = await api.get('/api/labs/reports', {
          params: {
            labId: user.lab._id,
            search: searchQuery,
          },
        });
        setReports(reportsRes.data);
        setLoadingReports(false);
      } catch (err) {
        console.error('Failed to fetch report history:', err);
        setErrorReports(err.response?.data?.message || err.message || 'Failed to fetch report history');
        setLoadingReports(false);
      }
    };

    fetchPatientsAndDoctors();
    fetchReportHistory();
  }, [user, searchQuery]);

  // NEW: Reset isReportGenerated when any relevant field changes
  useEffect(() => {
    setIsReportGenerated(false);
  }, [selectedPatient, testName, testResults, comments]);

  const handleGenerateReport = async () => {
    if (!selectedPatient || !testName || !testResults) {
      toast.error('Please select a patient, enter test name and results to generate a report.');
      setIsReportGenerated(false);
      return;
    }

    const patient = patients.find(p => p._id === selectedPatient);
    if (!patient) {
      toast.error('Selected patient not found.');
      return;
    }

    try {
      const response = await api.post('/api/labs/reports/generate', {
        labId: user.lab._id,
        patientId: patient._id,
        testName,
        testResults,
        comments,
      });
      toast.success(response.data.message || 'Report generated successfully!');
      console.log('Generated Report Data:', response.data.report); // Log the generated report from backend
      setIsReportGenerated(true); // Set to true after successful generation
    } catch (err) {
      console.error('Failed to generate report:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to generate report');
      setIsReportGenerated(false);
    }
  };

  // NEW: Handle Save Report
  const handleSaveReport = () => {
    if (isReportGenerated) {
      toast.success('Report saved successfully!');
      console.log('Report Saved!');
      // Here you would implement the actual save logic (e.g., API call to backend)
      // After saving, you might want to clear the fields or navigate away
      setSelectedPatient('');
      setTestName('');
      setTestResults('');
      setComments('');
      setIsReportGenerated(false); // Reset after saving
      // Re-fetch report history to show the new report
      const fetchReportHistory = async () => {
        if (!user || !user.lab) return;
        try {
          const reportsRes = await api.get('/api/labs/reports', {
            params: { labId: user.lab._id, search: searchQuery },
          });
          setReports(reportsRes.data);
        } catch (err) {
          console.error('Failed to re-fetch report history:', err);
        }
      };
      fetchReportHistory();
    } else {
      toast.error('Please generate a report first.');
    }
  };

  const handleFileUpload = async () => {
    if (!selectedPatientToUpload || !selectedFile) {
      toast.error('Please select a patient and a file to upload.');
      return;
    }

    const patient = patients.find(p => p._id === selectedPatientToUpload);
    if (!patient) {
      toast.error('Selected patient not found.');
      return;
    }

    const formData = new FormData();
    formData.append('report', selectedFile);
    formData.append('patientId', patient._id);
    formData.append('labId', user.lab._id);
    // You might also need to append doctorId if relevant for the uploaded report

    try {
      const response = await api.post('/api/labs/reports/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(response.data.message || 'Report uploaded successfully!');
      console.log('File uploaded response:', response.data); // Log upload response
      setSelectedPatientToUpload('');
      setSelectedFile(null);
      // Re-fetch report history to show the new report
      const fetchReportHistory = async () => {
        if (!user || !user.lab) return;
        try {
          const reportsRes = await api.get('/api/labs/reports', {
            params: { labId: user.lab._id, search: searchQuery },
          });
          setReports(reportsRes.data);
        } catch (err) {
          console.error('Failed to re-fetch report history:', err);
        }
      };
      fetchReportHistory();
    } catch (err) {
      console.error('Failed to upload file:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to upload file');
    }
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d._id === doctorId);
    return doctor ? doctor.name : 'N/A';
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-background text-foreground">
      {/* === HEADING GRADIENT FIX KIYA HAI (EMOJI KA COLOR NORMAL RAHEGA) === */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        📁 <span className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">Report & Data Management</span>
      </h1>

      {/* Upload Reports Section */}
      <div className="bg-card rounded-lg shadow-md p-6 mb-8 border border-border">
        <h2 className="text-xl font-semibold mb-4">Upload Reports</h2>
        <p className="text-muted-foreground mb-4">
          Upload patient test reports in PDF format.
        </p>
        
        <div className="mb-4">
          <label htmlFor="select-patient-upload" className="block text-sm font-medium text-foreground mb-2">Select Patient:</label>
          <select
            id="select-patient-upload"
            onChange={(e) => setSelectedPatientToUpload(e.target.value)}
            value={selectedPatientToUpload}
            className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle"
            disabled={loadingPatients} // Disable if patients are loading
          >
            <option value="">{loadingPatients ? 'Loading Patients...' : '-- Select a Patient --'}</option>
            {errorPatients ? (
              <option value="" disabled>Error loading patients</option>
            ) : (
              patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.name} (ID: {patient.patientId})
                </option>
              ))
            )}
          </select>
        </div>

        {selectedPatientToUpload && !loadingPatients && (
          <div className="mb-4 p-3 bg-background rounded-md border border-border">
            <p className="text-sm text-muted-foreground">Associated Doctor: <span className="font-medium text-foreground">{getDoctorName(patients.find(p => p._id === selectedPatientToUpload)?.doctor || null)}</span></p>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="block w-full text-sm text-foreground
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-muted file:text-foreground
              hover:file:bg-muted/70 dark:file:bg-muted/30 dark:hover:file:bg-muted/50
            "
          />
          <button 
            onClick={handleFileUpload}
            className="px-4 py-2 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white rounded-md hover:opacity-90 transition-opacity w-full md:w-auto"
          >
            Upload
          </button>
        </div>
      </div>

      {/* Generate Report Section - NEW */}
      <div className="bg-card rounded-lg shadow-md p-6 mb-8 border border-border">
        <h2 className="text-xl font-semibold mb-4">Generate Report</h2>
        <p className="text-muted-foreground mb-4">
          Generate a comprehensive report for the selected patient.
        </p>
        
        <div className="mb-4">
          <label htmlFor="select-patient-generate" className="block text-sm font-medium text-foreground mb-2">Select Patient:</label>
          <select
            id="select-patient-generate"
            onChange={(e) => setSelectedPatient(e.target.value)}
            value={selectedPatient}
            className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle"
            disabled={loadingPatients}
          >
            <option value="">{loadingPatients ? 'Loading Patients...' : '-- Select a Patient --'}</option>
            {errorPatients ? (
              <option value="" disabled>Error loading patients</option>
            ) : (
              patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.name} (ID: {patient.patientId})
                </option>
              ))
            )}
          </select>
        </div>

        {selectedPatient && !loadingPatients && (
          <div className="mb-4 p-3 bg-background rounded-md border border-border">
            <p className="text-sm text-muted-foreground mb-1">Selected Patient: <span className="font-medium text-foreground">{patients.find(p => p._id === selectedPatient)?.name}</span></p>
            <p className="text-sm text-muted-foreground">Associated Doctor: <span className="font-medium text-foreground">{getDoctorName(patients.find(p => p._id === selectedPatient)?.doctor || null)}</span></p>
          </div>
        )}

        {selectedPatient && (
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="test-name" className="block text-sm font-medium text-foreground mb-2">Test Name:</label>
              <input
                type="text"
                id="test-name"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="e.g., Blood Test, X-Ray"
                className="w-full p-3 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle"
              />
            </div>
            <div>
              <label htmlFor="test-results" className="block text-sm font-medium text-foreground mb-2">Test Results:</label>
              <textarea
                id="test-results"
                value={testResults}
                onChange={(e) => setTestResults(e.target.value)}
                rows="5"
                placeholder="Enter detailed test results here..."
                className="w-full p-3 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle"
              ></textarea>
            </div>
            <div>
              <label htmlFor="comments" className="block text-sm font-medium text-foreground mb-2">Comments (Optional):</label>
              <textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows="3"
                placeholder="Add any additional comments or notes..."
                className="w-full p-3 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle"
              ></textarea>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-4">
          <button 
            onClick={handleGenerateReport}
            className="px-4 py-2 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white rounded-md hover:opacity-90 transition-opacity w-full sm:w-auto"
          >
            Generate Report
          </button>
          <button 
            onClick={handleSaveReport}
            disabled={!isReportGenerated} // Disabled until report is generated
            className={`px-4 py-2 rounded-md transition-opacity w-full sm:w-auto ${isReportGenerated ? 'bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
          >
            Save Report
          </button>
        </div>
      </div>

      {/* AI PDF Summarizer Section - Removed */}
      {/* Removed the entire AI PDF Summarizer section as requested. */}

      {/* Report History Section */}
      <div className="bg-card rounded-lg shadow-md p-6 border border-border">
        <h2 className="text-xl font-semibold mb-4">Report History</h2>
        <p className="text-muted-foreground mb-4">
          Search and access all previously uploaded test reports.
        </p>
        <input
          type="text"
          placeholder="Search by Patient ID, Name, or Report Date..."
          className="w-full p-3 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle mb-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {loadingReports ? (
          <p>Loading report history...</p>
        ) : errorReports ? (
          <p className="text-red-500">Error: {errorReports}</p>
        ) : reports.length > 0 ? (
          <ul className="space-y-3">
            {reports.map((report) => (
              <li key={report._id} className="flex justify-between items-center p-3 border border-border rounded-md bg-background">
                <span className="font-medium text-foreground">Report ID: {report._id} - Patient: {report.patient.name} - Test: {report.testName}</span>
                <span className="text-sm text-muted-foreground">Date: {new Date(report.createdAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No report history found.</p>
        )}
        <button className="mt-6 px-4 py-2 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white rounded-md hover:opacity-90 transition-opacity">
          View All History
        </button>
      </div>
    </div>
  );
};

export default ReportDataManagementPage;