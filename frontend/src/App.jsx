import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './components/patient/PublicLayout.jsx';
import PatientDashboardLayout from './components/patient/PatientDashboardLayout.jsx';
import DoctorDashboardLayout from './components/doctor/DoctorDashboardLayout.jsx';
import ShopDashboardLayout from './components/shop/ShopDashboardLayout.jsx';
import AdminDashboardLayout from './components/admin/AdminDashboardLayout.jsx'; 
import HospitalDashboardLayout from './components/hospital/HospitalDashboardLayout.jsx'; // NEW: Import HospitalDashboardLayout

// Public Pages
import FeaturesPage from './pages/FeaturesPage.jsx';
import RolesPage from './pages/RolesPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'; // NEW: Import ForgotPasswordPage
import ResetPasswordPage from './pages/ResetPasswordPage.jsx'; // NEW: Import ResetPasswordPage
import PatientOnboardingPage from './pages/patient/PatientOnboardingPage.jsx'; // Import new onboarding page
import PrivateRoute from './components/PrivateRoute.jsx'; // Import PrivateRoute

// Patient Pages (all of them)
import PatientDashboardPage from './pages/patient/PatientDashboardPage.jsx';
import AppointmentsPage from './pages/patient/AppointmentsPage.jsx';
import BookAppointmentPage from './pages/patient/BookAppointmentPage.jsx';
import PrescriptionsPage from './pages/patient/PrescriptionsPage.jsx';
import MedicineFinderPage from './pages/patient/MedicineFinderPage.jsx';
import MedicineDetailPage from './pages/patient/MedicineDetailPage.jsx';
import HealthRecordsPage from './pages/patient/HealthRecordsPage.jsx';
import BillingPage from './pages/patient/BillingPage.jsx';
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
import SchedulePage from './pages/doctor/SchedulePage.jsx'; // NEW: Schedule page import
import MyPatientsPage from './pages/doctor/MyPatientsPage.jsx';
import DoctorPrescriptionsPage from './pages/doctor/DoctorPrescriptionsPage.jsx'; 
import DoctorSettingsPage from './pages/doctor/DoctorSettingsPage.jsx';
import DoctorProfileSettings from './components/doctor/settings/DoctorProfileSettings.jsx';
import ConsultationSettings from './components/doctor/settings/ConsultationSettings.jsx';
import DoctorProfilePage from './pages/doctor/DoctorProfilePage.jsx';
import DoctorNotificationsPage from './pages/doctor/DoctorNotificationsPage.jsx';

// shop pages
import ShopDashboardPage from './pages/shop/ShopDashboardPage.jsx';
import ShopOrdersPage from './pages/shop/ShopOrdersPage.jsx';
import ShopInventoryPage from './pages/shop/ShopInventoryPage.jsx'; 
import ShopBillingPage from './pages/shop/ShopBillingPage.jsx';
import SalesAnalyticsChart from './components/shop/widgets/SalesAnalyticsChart.jsx';
import ShopAnalyticsPage from './pages/shop/ShopAnalyticsPage.jsx';
import ShopSettingsPage from './pages/shop/ShopSettingsPage.jsx';
import PlanAndBilling from './components/shop/settings/PlanAndBilling.jsx'; 
import StaffManagement from './components/shop/settings/StaffManagement.jsx'; 
import Integrations from './components/shop/settings/Integrations.jsx';
import ShopProfileSettings from './components/shop/settings/ShopProfileSettings.jsx';
import ShopNotificationsPage from './pages/shop/ShopNotificationsPage.jsx';
import ShopProfilePage from './pages/shop/ShopProfilePage.jsx'; 

// Admin pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import UserManagementPage from './pages/admin/UserManagementPage.jsx';
import HospitalManagementPage from './pages/admin/HospitalManagementPage.jsx';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage.jsx'; 
import AdminSecurityPage from './pages/admin/AdminSecurityPage.jsx';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage.jsx';
import AdminProfilePage from './pages/admin/AdminProfilePage.jsx'; 
import AddHospitalPage from './pages/admin/hospitals/AddHospitalPage.jsx'; // Import AddHospitalPage
import AddUserPage from './pages/admin/users/AddUserPage.jsx'; // Import AddUserPage
import AdminProfileSettings from './components/admin/settings/AdminProfileSettings.jsx'; // Import AdminProfileSettings
import HospitalDashboardPage from './pages/hospital/HospitalDashboardPage.jsx'; // NEW: Import HospitalDashboardPage
import HospitalTotalPatientsPage from './pages/hospital/HospitalTotalPatientsPage.jsx'; // NEW: Total Patients Page
import HospitalStaffManagementPage from './pages/hospital/HospitalStaffManagementPage.jsx'; // NEW: Staff Management Page
import HospitalOperationsManagementPage from './pages/hospital/HospitalOperationsManagementPage.jsx'; // NEW: Operations Management Page
import HospitalAnalyticsFraudPage from './pages/hospital/HospitalAnalyticsFraudPage.jsx'; // NEW: Analytics & Fraud Page
import HospitalPharmacyPartnersPage from './pages/hospital/HospitalPharmacyPartnersPage.jsx'; // NEW: Pharmacy Partners Page
import HospitalNotificationsPage from './pages/hospital/HospitalNotificationsPage.jsx'; // NEW: Notifications Page
import HospitalProfilePage from './pages/hospital/HospitalProfilePage.jsx'; // NEW: Profile Page

// Placeholder for other pages
const Placeholder = ({ title }) => (
    <div className="bg-card p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground mt-2">This is a placeholder page for {title}.</p>
    </div>
);


function App() {
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
          <Route path="/forgot-password" element={<ForgotPasswordPage />} /> {/* NEW: Forgot password route */}
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} /> {/* NEW: Reset password route */}
        </Route>

        {/* --- PATIENT DASHBOARD ROUTES --- */}
        <Route element={<PrivateRoute allowedRoles={['Patient']} />}>
          <Route path="/patient" element={<PatientDashboardLayout />}>
            {/* All patient routes are correctly configured here */}
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
            <Route path="profile" element={<PatientProfilePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />}>
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<ProfileSettings />} />
                <Route path="security" element={<SecuritySettings />} />
                <Route path="notifications" element={<NotificationSettings />} />
            </Route>
          </Route>
          <Route path="patient-onboarding/:userId" element={<PatientOnboardingPage />} /> {/* New onboarding route */}
        </Route>

        {/* --- DOCTOR DASHBOARD ROUTES --- */}
        <Route element={<PrivateRoute allowedRoles={['Doctor']} />}>
          <Route path="/doctor" element={<DoctorDashboardLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DoctorDashboardPage />} />
            
            {/* UPDATED: Functional route for Schedule Page */}
            <Route path="schedule" element={<SchedulePage />} />

            <Route path="patients" element={<MyPatientsPage />} />
            <Route path="prescriptions" element={<DoctorPrescriptionsPage />} />
            <Route path="profile" element={<DoctorProfilePage />} />
            <Route path="notifications" element={<DoctorNotificationsPage />} />

            <Route path="settings" element={<DoctorSettingsPage />}>
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<DoctorProfileSettings />} />
              <Route path="consultation" element={<ConsultationSettings />} />
              <Route path="security" element={<SecuritySettings />} />
              <Route path="notifications" element={<NotificationSettings />} />
            </Route>
          </Route>
        </Route>

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

        {/* --- NEW: ADMIN DASHBOARD ROUTES --- */}
        <Route element={<PrivateRoute allowedRoles={['Admin']} />}>
          <Route path="/admin" element={<AdminDashboardLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="users/add" element={<AddUserPage />} /> {/* New route for adding users */}
            <Route path="hospitals" element={<HospitalManagementPage />} />
            <Route path="hospitals/add" element={<AddHospitalPage />} /> {/* New route for adding hospitals */}
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="security" element={<AdminSecurityPage />} />
            <Route path="notifications" element={<AdminNotificationsPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="profile/settings" element={<AdminProfileSettings />} /> {/* New route for admin profile settings */}
          </Route>
        </Route>

        {/* --- NEW: HOSPITAL DASHBOARD ROUTES --- */}
        <Route element={<PrivateRoute allowedRoles={['Hospital']} />}> {/* Assuming 'Hospital' is the role name */}
          <Route path="/hospital" element={<HospitalDashboardLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<HospitalDashboardPage />} />
            <Route path="patients" element={<HospitalTotalPatientsPage />} /> {/* NEW: Total Patients Route */}
            <Route path="staff-management" element={<HospitalStaffManagementPage />} /> {/* NEW: Staff Management Route */}
            <Route path="operations" element={<HospitalOperationsManagementPage />} /> {/* NEW: Operations Management Route */}
            <Route path="pharmacy-partners" element={<HospitalPharmacyPartnersPage />} /> {/* NEW: Pharmacy Partners Route */}
            <Route path="analytics-fraud" element={<HospitalAnalyticsFraudPage />} /> {/* NEW: Analytics & Fraud Route */}
            <Route path="notifications" element={<HospitalNotificationsPage />} /> {/* NEW: Notifications Route */}
            <Route path="profile" element={<HospitalProfilePage />} /> {/* NEW: Profile Route */}
          </Route>
        </Route>

      </Routes>
    </div>
  );
}

export default App;