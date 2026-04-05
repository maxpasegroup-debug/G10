import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { DashboardLegacyRedirect } from './components/auth/DashboardLegacyRedirect'
import { RoleGuard } from './components/auth/RoleGuard'
import { PageFallback } from './components/PageFallback'

const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })))
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })))
const AdmissionsPage = lazy(() => import('./pages/AdmissionsPage').then((m) => ({ default: m.AdmissionsPage })))
const AuthPage = lazy(() => import('./pages/AuthPage').then((m) => ({ default: m.AuthPage })))
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })))
const ClassesPage = lazy(() => import('./pages/ClassesPage').then((m) => ({ default: m.ClassesPage })))
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const FacultyPage = lazy(() => import('./pages/FacultyPage').then((m) => ({ default: m.FacultyPage })))
const GalleryPage = lazy(() => import('./pages/GalleryPage').then((m) => ({ default: m.GalleryPage })))

const AdminLayout = lazy(() =>
  import('./components/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })),
)
const AdminHomePage = lazy(() => import('./pages/admin/adminPages').then((m) => ({ default: m.AdminHomePage })))
const AdminUsersPage = lazy(() =>
  import('./pages/admin/AdminUsersPage').then((m) => ({ default: m.AdminUsersPage })),
)
const AdminStudentsPage = lazy(() =>
  import('./pages/admin/AdminStudentsPage').then((m) => ({ default: m.AdminStudentsPage })),
)
const AdminClassesPage = lazy(() =>
  import('./pages/admin/AdminClassesPage').then((m) => ({ default: m.AdminClassesPage })),
)
const AdminAttendancePage = lazy(() =>
  import('./pages/admin/AdminAttendancePage').then((m) => ({ default: m.AdminAttendancePage })),
)
const AdminPerformancePage = lazy(() =>
  import('./pages/admin/AdminPerformancePage').then((m) => ({ default: m.AdminPerformancePage })),
)
const AdminGalleryAdminPage = lazy(() =>
  import('./pages/admin/AdminGalleryAdminPage').then((m) => ({ default: m.AdminGalleryAdminPage })),
)
const AdminEnquiriesPage = lazy(() =>
  import('./pages/admin/AdminEnquiriesPage').then((m) => ({ default: m.AdminEnquiriesPage })),
)
const AdminSettingsPage = lazy(() =>
  import('./pages/admin/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage })),
)

function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/faculty" element={<FacultyPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/admissions" element={<AdmissionsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route
          path="/admin"
          element={
            <RoleGuard allowedRole="admin">
              <AdminLayout />
            </RoleGuard>
          }
        >
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
        <Route
          path="/student"
          element={
            <RoleGuard allowedRole="student">
              <DashboardPage role="student" />
            </RoleGuard>
          }
        />
        <Route
          path="/parent"
          element={
            <RoleGuard allowedRole="parent">
              <DashboardPage role="parent" />
            </RoleGuard>
          }
        />
        <Route
          path="/teacher"
          element={
            <RoleGuard allowedRole="teacher">
              <DashboardPage role="teacher" />
            </RoleGuard>
          }
        />
        <Route path="/dashboard" element={<DashboardLegacyRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
