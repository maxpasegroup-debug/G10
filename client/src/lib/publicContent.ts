import { API_URL, resolveMediaUrl } from './api'
import { apiFetchData } from './apiClient'

export type PublicClassRow = {
  id: number
  name: string | null
  subject: string | null
  studio: string | null
  is_live: boolean | null
}

export type PublicTeacherRow = {
  id: number
  name: string | null
  title: string | null
  bio: string | null
  photo_url: string | null
}

export type GalleryApiRow = {
  id: number
  image_url: string
  caption: string
  category: string
}

export async function fetchPublicClasses(): Promise<PublicClassRow[]> {
  if (!API_URL) return []
  return apiFetchData<PublicClassRow[]>('/api/public/classes')
}

export async function fetchPublicTeachers(): Promise<PublicTeacherRow[]> {
  if (!API_URL) return []
  return apiFetchData<PublicTeacherRow[]>('/api/public/teachers')
}

export async function fetchGallery(): Promise<GalleryApiRow[]> {
  if (!API_URL) return []
  return apiFetchData<GalleryApiRow[]>('/api/gallery')
}

export function gallerySlideKey(id: number): string {
  return `g-${id}`
}

export function mapGalleryToSlides(rows: GalleryApiRow[], limit = 4) {
  return rows.slice(0, limit).map((r) => ({
    key: gallerySlideKey(r.id),
    src: resolveMediaUrl(r.image_url),
    caption: r.caption?.trim() || 'Photo',
  }))
}
