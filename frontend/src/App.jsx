import React, { useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import PublicLayout from './components/patient/PublicLayout.jsx';
import PatientDashboardLayout from './components/patient/PatientDashboardLayout.jsx';
import DoctorDashboardLayout from './components/doctor/DoctorDashboardLayout.jsx';
import ShopDashboardLayout from './components/shop/ShopDashboardLayout.jsx';
import AdminDashboardLayout from './components/admin/AdminDashboardLayout.jsx';
import HospitalDashboardLayout from './components/hospital/HospitalDashboardLayout.jsx';

// Public Pages
import FeaturesPage from './pages/FeaturesPage.jsx';
import RolesPage from './pages/RolesPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import PatientOnboardingPage from './pages/patient/PatientOnboardingPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import BookTestAppointmentPage from './pages/patient/BookTestAppointmentPage.jsx'; // NEW: Import BookTestAppointmentPage
import AddFamilyMemberPage from './pages/patient/AddFamilyMemberPage.jsx'; // NEW: Import AddFamilyMemberPage
import FamilyMemberProfilePage from './pages/patient/FamilyMemberProfilePage.jsx'; // NEW: Import FamilyMemberProfilePage

// Patient Pages
import PatientDashboardPage from './pages/patient/PatientDashboardPage.jsx';
import AppointmentsPage from './pages/patient/AppointmentsPage.jsx';
import BookAppointmentPage from './pages/patient/BookAppointmentPage.jsx';
import PrescriptionsPage from './pages/patient/PrescriptionsPage.jsx';
import MedicineFinderPage from './pages/patient/MedicineFinderPage.jsx';
import MedicineDetailPage from './pages/patient/MedicineDetailPage.jsx';
import HealthRecordsPage from './pages/patient/HealthRecordsPage.jsx';
import BillingPage from './pages/patient/BillingPage.jsx';
import TestsPage from './pages/patient/TestsPage.jsx';
import PatientProfilePage from './pages/patient/PatientProfilePage.jsx';
import NotificationsPage from './pages/patient/NotificationsPage.jsx';
import SettingsPage from './pages/patient/SettingsPage.jsx';
import MyTokenPage from './pages/patient/MyTokenPage.jsx';
import DonatePage from './pages/patient/DonatePage.jsx';
import HowToUsePage from './pages/patient/HowToUsePage.jsx';
import ProfileSettings from './components/patient/settings/ProfileSettings.jsx';
import SecuritySettings from './components/patient/settings/SecuritySettings.jsx';
import NotificationSettings from './components/patient/settings/NotificationSettings.jsx';

// Doctor Pages
import DoctorDashboardPage from './pages/doctor/DoctorDashboardPage.jsx';
import SchedulePage from './pages/doctor/SchedulePage.jsx';
import MyPatientsPage from './pages/doctor/MyPatientsPage.jsx';
import DoctorPrescriptionsPage from './pages/doctor/DoctorPrescriptionsPage.jsx';
import DoctorSettingsPage from './pages/doctor/DoctorSettingsPage.jsx';
import DoctorProfileSettings from './components/doctor/settings/DoctorProfileSettings.jsx';
import ConsultationSettings from './components/doctor/settings/ConsultationSettings.jsx';
import DoctorProfilePage from './pages/doctor/DoctorProfilePage.jsx';
import DoctorNotificationsPage from './pages/doctor/DoctorNotificationsPage.jsx';
import PrescriptionWriter from './components/doctor/prescriptions/PrescriptionWriter.jsx'; // NEW: Import PrescriptionWriter

// Shop Pages
import ShopDashboardPage from './pages/shop/ShopDashboardPage.jsx';
import ShopOrdersPage from './pages/shop/ShopOrdersPage.jsx';
import ShopInventoryPage from './pages/shop/ShopInventoryPage.jsx';
import ShopBillingPage from './pages/shop/ShopBillingPage.jsx';
import ShopAnalyticsPage from './pages/shop/ShopAnalyticsPage.jsx';
import ShopSettingsPage from './pages/shop/ShopSettingsPage.jsx';
import PlanAndBilling from './components/shop/settings/PlanAndBilling.jsx';
import StaffManagement from './components/shop/settings/StaffManagement.jsx';
import Integrations from './components/shop/settings/Integrations.jsx';
import ShopProfileSettings from './components/shop/settings/ShopProfileSettings.jsx';
import ShopNotificationsPage from './pages/shop/ShopNotificationsPage.jsx';
import ShopProfilePage from './pages/shop/ShopProfilePage.jsx';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import UserManagementPage from './pages/admin/UserManagementPage.jsx';
import HospitalManagementPage from './pages/admin/HospitalManagementPage.jsx';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage.jsx';
import AdminSecurityPage from './pages/admin/AdminSecurityPage.jsx';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage.jsx';
import AdminProfilePage from './pages/admin/AdminProfilePage.jsx';
import AddHospitalPage from './pages/admin/hospitals/AddHospitalPage.jsx';
import AddUserPage from './pages/admin/users/AddUserPage.jsx';
import AdminProfileSettings from './components/admin/settings/AdminProfileSettings.jsx';

// Hospital Pages
import HospitalDashboardPage from './pages/hospital/HospitalDashboardPage.jsx';
import HospitalTotalPatientsPage from './pages/hospital/HospitalTotalPatientsPage.jsx';
import HospitalStaffManagementPage from './pages/hospital/HospitalStaffManagementPage.jsx';
import HospitalOperationsManagementPage from './pages/hospital/HospitalOperationsManagementPage.jsx';
import HospitalAnalyticsFraudPage from './pages/hospital/HospitalAnalyticsFraudPage.jsx';
import HospitalPharmacyPartnersPage from './pages/hospital/HospitalPharmacyPartnersPage.jsx';
import HospitalNotificationsPage from './pages/hospital/HospitalNotificationsPage.jsx';
import HospitalProfilePage from './pages/hospital/HospitalProfilePage.jsx';
import HospitalOnboardingPage from './pages/hospital/HospitalOnboardingPage.jsx'; // NEW: Import HospitalOnboardingPage

// Lab Pages and Components
import LabDashboardLayout from './components/lab/LabDashboardLayout.jsx';
import LabDashboardPage from './pages/lab/LabDashboardPage.jsx';
import LabProfilePage from './pages/lab/LabProfilePage.jsx';
import LabNotificationsPage from './pages/lab/LabNotificationsPage.jsx';
import ReportDataManagementPage from './pages/lab/ReportDataManagementPage.jsx'; // NEW: Import ReportDataManagementPage
import StockAnalyticsPage from './pages/lab/StockAnalyticsPage.jsx'; // NEW: Import StockAnalyticsPage
import TestOrderManagementPage from './pages/lab/TestOrderManagementPage.jsx'; // NEW: Import TestOrderManagementPage

function App() {
  const { setAuthDataFromRedirect, user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const processedRedirectRef = useRef(false);

  console.log('App.jsx - Current location.pathname:', location.pathname); // NEW: Log current path

  // 🧩 Step 1: Process token & userInfo from URL (after signup/login redirect)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userInfo = params.get('userInfo');

    if (token && userInfo && !processedRedirectRef.current) {
      setAuthDataFromRedirect(token, userInfo);
      processedRedirectRef.current = true;

      // remove token & userInfo from URL
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete('token');
      cleanUrl.searchParams.delete('userInfo');
      window.history.replaceState({}, document.title, cleanUrl.toString());
    }
  }, [location.search, setAuthDataFromRedirect]);

  // 🧩 Step 2: Redirect user once context updates
  useEffect(() => {
    // Ensure user is logged in, not loading, and it's the immediate redirect after initial auth.
    if (!loading && user && processedRedirectRef.current) {
      let redirectPath;
      if (user.isNewUser && user.role?.toLowerCase() === 'patient') {
        redirectPath = `/patient-onboarding/${user._id}`;
      } else if (user.isNewUser && user.role?.toLowerCase() === 'hospital') { // NEW: Redirect new Hospital users to onboarding
        redirectPath = `/hospital/onboarding/${user._id}`;
      } else {
        redirectPath = `/${user.role?.toLowerCase()}/dashboard`;
      }
      navigate(redirectPath, { replace: true });
      processedRedirectRef.current = false; // Reset to allow public route access after initial dashboard redirect
    }
  }, [user, loading, navigate]);

  // 🧩 Step 3: Protect routes for unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      const isPublicRoute = [
        '/', '/features', '/roles', '/about',
        '/login', '/signup', '/forgot-password', '/reset-password', '/patient-onboarding'
      ].some(route => location.pathname === route || location.pathname.startsWith(route + '/'));

      if (!isPublicRoute) {
        navigate('/login', { replace: true });
      }
    }
  }, [user, loading, navigate, location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Route>

        {/* --- PATIENT --- */}
        <Route element={<PrivateRoute allowedRoles={['Patient']} />}>
          <Route path="/patient" element={<PatientDashboardLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<PatientDashboardPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="book-appointment" element={<BookAppointmentPage />} />
            <Route path="prescriptions" element={<PrescriptionsPage />} />
            <Route path="medicine-finder" element={<MedicineFinderPage />} />
            <Route path="medicine-finder/:medicineId" element={<MedicineDetailPage />} />
            <Route path="health-records" element={<HealthRecordsPage />} />
            <Route path="my-token" element={<MyTokenPage />} />
            <Route path="donate" element={<DonatePage />} />
            <Route path="how-to-use" element={<HowToUsePage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="tests" element={<TestsPage />} />
            <Route path="profile" element={<PatientProfilePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />}>
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<ProfileSettings />} />
              <Route path="security" element={<SecuritySettings />} />
              <Route path="notifications" element={<NotificationSettings />} />
            </Route>
            <Route path="book-test-appointment" element={<BookTestAppointmentPage />} /> {/* NEW: Book Test Appointment page nested */} 
            <Route path="add-family-member" element={<AddFamilyMemberPage />} /> {/* NEW: Add Family Member page nested */} 
            <Route path="family-member-profile/:id" element={<FamilyMemberProfilePage />} /> {/* NEW: Family Member Profile page nested */} 
          </Route>
          <Route path="patient-onboarding/:userId" element={<PatientOnboardingPage />} />
        </Route>

        {/* --- DOCTOR --- */}
        <Route element={<PrivateRoute allowedRoles={['Doctor']} />}>
          <Route path="/doctor" element={<DoctorDashboardLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DoctorDashboardPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="patients" element={<MyPatientsPage />} />
            <Route path="prescriptions" element={<DoctorPrescriptionsPage />} />
            <Route path="profile" element={<DoctorProfilePage />} />
            <Route path="notifications" element={<DoctorNotificationsPage />} />
            <Route path="prescriptions/new" element={<PrescriptionWriter />} /> {/* New route for PrescriptionWriter */}
            <Route path="settings" element={<DoctorSettingsPage />}>
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<DoctorProfileSettings />} />
              <Route path="consultation" element={<ConsultationSettings />} />
              <Route path="security" element={<SecuritySettings />} />
              <Route path="notifications" element={<NotificationSettings />} />
            </Route>
          </Route>
        </Route>

        {/* --- SHOP --- */}
        <Route path="/shop" element={<ShopDashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ShopDashboardPage />} />
          <Route path="orders" element={<ShopOrdersPage />} />
          <Route path="inventory" element={<ShopInventoryPage />} />
          <Route path="billing" element={<ShopBillingPage />} />
          <Route path="analytics" element={<ShopAnalyticsPage />} />
          <Route path="notifications" element={<ShopNotificationsPage />} />
          <Route path="profile" element={<ShopProfilePage />} />
          <Route path="settings" element={<ShopSettingsPage />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<ShopProfileSettings />} />
            <Route path="billing" element={<PlanAndBilling />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="integrations" element={<Integrations />} />
          </Route>
        </Route>

        {/* --- ADMIN --- */}
        <Route element={<PrivateRoute allowedRoles={['Admin']} />}>
          <Route path="/admin" element={<AdminDashboardLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="users/add" element={<AddUserPage />} />
            <Route path="hospitals" element={<HospitalManagementPage />} />
            <Route path="hospitals/add" element={<AddHospitalPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="security" element={<AdminSecurityPage />} />
            <Route path="notifications" element={<AdminNotificationsPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="profile/settings" element={<AdminProfileSettings />} />
          </Route>
        </Route>

        {/* --- HOSPITAL --- */}
        <Route path="/hospital-onboarding/:userId" element={<HospitalOnboardingPage />} /> {/* NEW: Hospital Onboarding Page outside any dashboard layout */}
        <Route element={<PrivateRoute allowedRoles={['Hospital']} />}>
          <Route path="/hospital" element={<HospitalDashboardLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<HospitalDashboardPage />} />
            <Route path="patients" element={<HospitalTotalPatientsPage />} />
            <Route path="staff-management" element={<HospitalStaffManagementPage />} />
            <Route path="operations" element={<HospitalOperationsManagementPage />} />
            <Route path="pharmacy-partners" element={<HospitalPharmacyPartnersPage />} />
            <Route path="analytics-fraud" element={<HospitalAnalyticsFraudPage />} />
            <Route path="notifications" element={<HospitalNotificationsPage />} />
            <Route path="profile" element={<HospitalProfilePage />} />
          </Route>
        </Route>

        {/* --- LAB --- */}
        <Route element={<PrivateRoute allowedRoles={['Lab']} />}> {/* Assuming 'Lab' is the role for Lab users */}
          <Route path="/lab" element={<LabDashboardLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<LabDashboardPage />} />
            <Route path="profile" element={<LabProfilePage />} />
            <Route path="notifications" element={<LabNotificationsPage />} />
            <Route path="report-data-management" element={<ReportDataManagementPage />} />
            <Route path="stock-analytics" element={<StockAnalyticsPage />} />
            <Route path="test-order-management" element={<TestOrderManagementPage />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
