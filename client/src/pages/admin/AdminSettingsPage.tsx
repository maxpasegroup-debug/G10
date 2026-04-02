import { useId, useState } from 'react'

const defaultCourses = ['Piano', 'Guitar', 'Vocal', 'Drums', 'Music Theory'] as const

function coursesToText(lines: readonly string[]) {
  return lines.join('\n')
}

export function AdminSettingsPage() {
  const formId = useId()
  const [academyName, setAcademyName] = useState('G10 AMR Music Academy')
  const [phone, setPhone] = useState('+91 98765 43210')
  const [coursesText, setCoursesText] = useState(() => coursesToText(defaultCourses))
  const [savedHint, setSavedHint] = useState<string | null>(null)

  const handleSave = () => {
    setSavedHint(`Saved · ${academyName}`)
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-lg font-bold text-primary sm:text-xl">Settings</h2>
        <p className="mt-1 text-sm text-primary/65">Basic academy details. Changes stay on this device until you connect a backend.</p>
      </div>

      <div className="space-y-6 rounded-2xl border border-primary/[0.08] bg-white p-5 shadow-[var(--shadow-card)] sm:p-8">
        <div>
          <label htmlFor={`${formId}-name`} className="mb-2 block text-base font-semibold text-primary">
            Academy name
          </label>
          <input
            id={`${formId}-name`}
            type="text"
            value={academyName}
            onChange={(e) => {
              setAcademyName(e.target.value)
              setSavedHint(null)
            }}
            autoComplete="organization"
            className="w-full min-h-[52px] rounded-xl border border-primary/[0.12] bg-white px-4 text-base text-primary outline-none ring-secondary/30 focus:ring-2"
          />
        </div>

        <div>
          <label htmlFor={`${formId}-phone`} className="mb-2 block text-base font-semibold text-primary">
            Phone number
          </label>
          <input
            id={`${formId}-phone`}
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              setSavedHint(null)
            }}
            autoComplete="tel"
            className="w-full min-h-[52px] rounded-xl border border-primary/[0.12] bg-white px-4 text-base text-primary outline-none ring-secondary/30 focus:ring-2"
          />
        </div>

        <div>
          <label htmlFor={`${formId}-courses`} className="mb-2 block text-base font-semibold text-primary">
            Courses list
          </label>
          <p className="mb-2 text-sm text-primary/55">One course per line.</p>
          <textarea
            id={`${formId}-courses`}
            value={coursesText}
            onChange={(e) => {
              setCoursesText(e.target.value)
              setSavedHint(null)
            }}
            rows={8}
            className="w-full resize-y rounded-xl border border-primary/[0.12] bg-white px-4 py-3 font-mono text-base text-primary outline-none ring-secondary/30 focus:ring-2"
            placeholder={'Piano\nGuitar\nVocal'}
          />
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleSave}
            className="min-h-[56px] w-full rounded-xl bg-primary px-8 text-lg font-bold text-white shadow-[var(--shadow-soft)] transition hover:bg-primary-light sm:w-auto sm:min-w-[200px]"
          >
            Save
          </button>
          {savedHint ? (
            <p className="text-center text-base font-medium text-green-700 sm:text-left">{savedHint}</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
