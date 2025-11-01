import React, { useState, useEffect } from 'react'; // NEW: Import useEffect

const ReportDataManagementPage = () => {
  const [selectedPatient, setSelectedPatient] = useState(''); // For Generate Report section
  const [selectedPatientToUpload, setSelectedPatientToUpload] = useState(''); // NEW: For Upload Reports section
  const [selectedFile, setSelectedFile] = useState(null); // NEW: For Upload Reports section
  const [testName, setTestName] = useState(''); // NEW: For manual report generation
  const [testResults, setTestResults] = useState(''); // NEW: For manual report generation
  const [comments, setComments] = useState(''); // NEW: For manual report generation
  const [isReportGenerated, setIsReportGenerated] = useState(false); // NEW: State for report generation status

  const mockPatientData = [
    { id: 'P001', name: 'John Doe', doctorId: 'D001' },
    { id: 'P002', name: 'Jane Smith', doctorId: 'D002' },
    { id: 'P003', name: 'Peter Jones', doctorId: 'D001' },
  ];

  const mockDoctorData = [
    { id: 'D001', name: 'Dr. Sarah Johnson' },
    { id: 'D002', name: 'Dr. Michael Brown' },
  ];

  // NEW: Reset isReportGenerated when any relevant field changes
  useEffect(() => {
    setIsReportGenerated(false);
  }, [selectedPatient, testName, testResults, comments]);

  const handleGenerateReport = () => {
    if (selectedPatient && testName && testResults) {
      const patient = mockPatientData.find(p => p.id === selectedPatient);
      const doctor = mockDoctorData.find(d => d.id === patient?.doctorId);
      alert(`Generating manual report for patient: ${patient?.name} (ID: ${patient?.id})\nTest: ${testName}\nResults: ${testResults}\nComments: ${comments}\nAssociated Doctor: ${doctor?.name}`);
      console.log('Generated Report Data:', {
        patientId: selectedPatient,
        patientName: patient?.name,
        doctorId: doctor?.id,
        doctorName: doctor?.name,
        testName,
        testResults,
        comments,
        date: new Date().toLocaleDateString()
      });
      setIsReportGenerated(true); // Set to true after successful generation
    } else {
      alert('Please select a patient, enter test name and results to generate a report.');
      setIsReportGenerated(false); // Ensure it's false if generation fails
    }
  };

  // NEW: Handle Save Report
  const handleSaveReport = () => {
    if (isReportGenerated) {
      alert('Report saved successfully!');
      console.log('Report Saved!');
      // Here you would implement the actual save logic (e.g., API call to backend)
      // After saving, you might want to clear the fields or navigate away
      setSelectedPatient('');
      setTestName('');
      setTestResults('');
      setComments('');
      setIsReportGenerated(false); // Reset after saving
    } else {
      alert('Please generate a report first.');
    }
  };

  const handleFileUpload = () => {
    if (selectedPatientToUpload && selectedFile) {
      alert(`Uploading file for patient ID: ${selectedPatientToUpload}, File: ${selectedFile.name}`);
      console.log('File uploaded for:', {
        patientId: selectedPatientToUpload,
        patientName: mockPatientData.find(p => p.id === selectedPatientToUpload)?.name,
        doctorId: mockPatientData.find(p => p.id === selectedPatientToUpload)?.doctorId,
        doctorName: mockDoctorData.find(d => d.id === mockPatientData.find(p => p.id === selectedPatientToUpload)?.doctorId)?.name,
        file: selectedFile.name
      });
      // Here you would implement the actual file upload logic, e.g., using FormData and an API call
      setSelectedPatientToUpload('');
      setSelectedFile(null);
    } else {
      alert('Please select a patient and a file to upload.');
    }
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
          >
            <option value="">-- Select a Patient --</option>
            {mockPatientData.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name} (ID: {patient.id})
              </option>
            ))}
          </select>
        </div>

        {selectedPatientToUpload && (
          <div className="mb-4 p-3 bg-background rounded-md border border-border">
            <p className="text-sm text-muted-foreground">Associated Doctor: <span className="font-medium text-foreground">{mockDoctorData.find(d => d.id === mockPatientData.find(p => p.id === selectedPatientToUpload)?.doctorId)?.name || 'N/A'}</span></p>
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
          >
            <option value="">-- Select a Patient --</option>
            {mockPatientData.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name} (ID: {patient.id})
              </option>
            ))}
          </select>
        </div>

        {selectedPatient && (
          <div className="mb-4 p-3 bg-background rounded-md border border-border">
            <p className="text-sm text-muted-foreground mb-1">Selected Patient: <span className="font-medium text-foreground">{mockPatientData.find(p => p.id === selectedPatient)?.name}</span></p>
            <p className="text-sm text-muted-foreground">Associated Doctor: <span className="font-medium text-foreground">{mockDoctorData.find(d => d.id === mockPatientData.find(p => p.id === selectedPatient)?.doctorId)?.name || 'N/A'}</span></p>
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
        />
        <ul className="space-y-3">
          <li className="flex justify-between items-center p-3 border border-border rounded-md bg-background">
            <span className="font-medium text-foreground">Report ID: #PDF001 - John Doe - Blood Test</span>
            <span className="text-sm text-muted-foreground">2023-10-20</span>
          </li>
          <li className="flex justify-between items-center p-3 border border-border rounded-md bg-background">
            <span className="font-medium text-foreground">Report ID: #PDF002 - Jane Smith - MRI Scan</span>
            <span className="text-sm text-muted-foreground">2023-09-15</span>
          </li>
        </ul>
        <button className="mt-6 px-4 py-2 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white rounded-md hover:opacity-90 transition-opacity">
          View All History
        </button>
      </div>
    </div>
  );
};

export default ReportDataManagementPage;