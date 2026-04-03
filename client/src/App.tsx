import { Navigate, Route, Routes } from 'react-router-dom'
import { AboutPage } from './pages/AboutPage'
import { AdmissionsPage } from './pages/AdmissionsPage'
import { AuthPage } from './pages/AuthPage'
import { ContactPage } from './pages/ContactPage'
import { ClassesPage } from './pages/ClassesPage'
import { AdminLayout } from './components/admin/AdminLayout'
import { DashboardLegacyRedirect } from './components/auth/DashboardLegacyRedirect'
import { RequireRole } from './components/auth/RequireRole'
import { DashboardPage } from './pages/DashboardPage'
import { FacultyPage } from './pages/FacultyPage'
import { GalleryPage } from './pages/GalleryPage'
import { LandingPage } from './pages/LandingPage'
import { AdminHomePage } from './pages/admin/adminPages'
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage'
import { AdminEnquiriesPage } from './pages/admin/AdminEnquiriesPage'
import { AdminAttendancePage } from './pages/admin/AdminAttendancePage'
import { AdminGalleryAdminPage } from './pages/admin/AdminGalleryAdminPage'
import { AdminPerformancePage } from './pages/admin/AdminPerformancePage'
import { AdminClassesPage } from './pages/admin/AdminClassesPage'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'
import { AdminStudentsPage } from './pages/admin/AdminStudentsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/classes" element={<ClassesPage />} />
      <Route path="/faculty" element={<FacultyPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/admissions" element={<AdmissionsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminHomePage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="students" element={<AdminStudentsPage />} />
        <Route path="classes" element={<AdminClassesPage />} />
        <Route path="attendance" element={<AdminAttendancePage />} />
        <Route path="performance" element={<AdminPerformancePage />} />
        <Route path="gallery" element={<AdminGalleryAdminPage />} />
        <Route path="enquiries" element={<AdminEnquiriesPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
      <Route path="/student" element={<RequireRole allowedRole="student"><DashboardPage role="student" /></RequireRole>} />
      <Route path="/parent" element={<RequireRole allowedRole="parent"><DashboardPage role="parent" /></RequireRole>} />
      <Route path="/teacher" element={<RequireRole allowedRole="teacher"><DashboardPage role="teacher" /></RequireRole>} />
      <Route path="/dashboard" element={<DashboardLegacyRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
