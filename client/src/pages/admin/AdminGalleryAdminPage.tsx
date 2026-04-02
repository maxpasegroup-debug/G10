import { useEffect, useId, useRef, useState } from 'react'

type GalleryImage = { id: string; url: string }

function newImageId() {
  return `g-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function AdminGalleryAdminPage() {
  const uploadId = useId()
  const fileRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<GalleryImage[]>([])
  const imagesRef = useRef(images)
  imagesRef.current = images

  useEffect(() => {
    return () => {
      for (const img of imagesRef.current) {
        if (img.url.startsWith('blob:')) URL.revokeObjectURL(img.url)
      }
    }
  }, [])

  const openPicker = () => fileRef.current?.click()

  const onFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files
    if (!list?.length) return
    const added: GalleryImage[] = []
    for (let i = 0; i < list.length; i++) {
      const file = list[i]
      if (!file.type.startsWith('image/')) continue
      added.push({ id: newImageId(), url: URL.createObjectURL(file) })
    }
    if (added.length) setImages((prev) => [...added, ...prev])
    e.target.value = ''
  }

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id)
      if (target?.url.startsWith('blob:')) URL.revokeObjectURL(target.url)
      return prev.filter((img) => img.id !== id)
    })
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-primary sm:text-xl">Gallery photos</h2>
          <p className="mt-1 text-sm text-primary/65">Upload images and remove any you don&apos;t need.</p>
        </div>
        <div>
          <input
            ref={fileRef}
            id={uploadId}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={onFilesSelected}
          />
          <button
            type="button"
            onClick={openPicker}
            className="min-h-[56px] w-full rounded-xl bg-secondary px-8 text-lg font-bold text-primary shadow-[0_4px_12px_rgba(212,175,55,0.3)] transition hover:bg-secondary-hover sm:w-auto sm:min-w-[200px]"
          >
            Upload Photo
          </button>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-primary/20 bg-surface/40 px-6 py-16 text-center">
          <p className="text-base font-medium text-primary/70">No photos yet.</p>
          <p className="mt-2 text-sm text-primary/55">Tap Upload Photo to add images.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img) => (
            <li
              key={img.id}
              className="overflow-hidden rounded-2xl border border-primary/[0.08] bg-white shadow-[var(--shadow-card)]"
            >
              <div className="relative aspect-square bg-primary/[0.06]">
                <img src={img.url} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="p-3">
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="min-h-[48px] w-full rounded-xl bg-red-600 px-4 text-base font-bold text-white transition hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
