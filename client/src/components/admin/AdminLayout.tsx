import { useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useSiteSettings } from '../../context/SettingsContext'
import { AdminHeader } from './AdminHeader'
import { AdminSidebar } from './AdminSidebar'

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Home',
  '/admin/users': 'Users',
  '/admin/students': 'Students',
  '/admin/classes': 'Classes',
  '/admin/attendance': 'Attendance',
  '/admin/performance': 'Performance',
  '/admin/gallery': 'Gallery',
  '/admin/enquiries': 'Enquiries',
  '/admin/settings': 'Site content',
}

export function AdminLayout() {
  const location = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { settings, loading: settingsLoading } = useSiteSettings()
  const academy = settings?.academy_name?.trim() || ''
  const brandName = settingsLoading && !academy ? '…' : academy || 'Academy'

  const pageTitle = useMemo(() => {
    const path = location.pathname.replace(/\/$/, '') || '/admin'
    return PAGE_TITLES[path] ?? 'Admin'
  }, [location.pathname])

  return (
    <div className="min-h-dvh bg-[#f4f6f8] font-sans text-primary">
      {/* Mobile overlay */}
      {mobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-label="Close menu"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-[#0B2A4A] shadow-lg transition-transform duration-200 md:translate-x-0 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="border-b border-white/10 px-4 py-5">
          <p
            className="text-lg font-bold tracking-wide text-[#D4AF37]"
            style={{ fontFamily: 'var(--font-brand), Georgia, serif' }}
          >
            {brandName}
          </p>
          <p className="mt-1 text-sm font-medium text-white/70">Admin</p>
        </div>
        <AdminSidebar onNavigate={() => setMobileNavOpen(false)} />
      </aside>

      <div className="flex min-h-dvh flex-col md:pl-[260px]">
        <AdminHeader
          title={pageTitle}
          onMenuClick={() => setMobileNavOpen(true)}
        />
        <main className="flex-1 bg-white p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
