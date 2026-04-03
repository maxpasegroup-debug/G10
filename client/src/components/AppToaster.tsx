import { Toaster } from 'react-hot-toast'

/** Global toast host — theme aligned with G10 admin/public UI */
export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      containerStyle={{ top: 16, zIndex: 10000 }}
      gutter={10}
      toastOptions={{
        duration: 4000,
        className: '!font-sans !text-sm !font-medium',
        style: {
          background: 'var(--white)',
          color: 'var(--primary-blue)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-soft)',
          border: '1px solid rgba(11, 42, 74, 0.1)',
          maxWidth: 'min(calc(100vw - 2rem), 380px)',
          padding: '14px 16px',
        },
        success: {
          iconTheme: { primary: 'var(--gold)', secondary: '#ffffff' },
        },
        error: {
          duration: 5500,
          iconTheme: { primary: '#dc2626', secondary: '#ffffff' },
        },
      }}
    />
  )
}
