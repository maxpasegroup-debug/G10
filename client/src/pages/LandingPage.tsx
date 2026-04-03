import { useEffect, useState } from 'react'
import { API_URL, resolveMediaUrl } from '../lib/api'
import { fetchGallery, fetchPublicClasses, mapGalleryToSlides } from '../lib/publicContent'
import { Navbar } from '../components/Navbar'
import { PublicFooter } from '../components/PublicFooter'
import { MusicHero, type HeroSlide } from '../components/music/MusicHero'
import { MusicLandingSections, type GalleryTeaser } from '../components/music/MusicLandingSections'
import { Sidebar } from '../components/Sidebar'

export function LandingPage() {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
  const [classDetailTitles, setClassDetailTitles] = useState<string[]>([])
  const [programSubjects, setProgramSubjects] = useState<string[]>([])
  const [galleryTeasers, setGalleryTeasers] = useState<GalleryTeaser[]>([])

  useEffect(() => {
    if (!API_URL) {
      setHeroSlides([])
      setClassDetailTitles([])
      setProgramSubjects([])
      setGalleryTeasers([])
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const [gallery, classes] = await Promise.all([fetchGallery(), fetchPublicClasses()])
        if (cancelled) return
        setHeroSlides(mapGalleryToSlides(gallery, 4))
        const titles = classes
          .map((c) => (c.name || '').trim())
          .filter(Boolean)
          .slice(0, 8)
        setClassDetailTitles(
          titles.length
            ? titles
            : classes
                .map((c) =>
                  [c.subject, c.name].filter(Boolean).join(' — ') || `Class ${c.id}`,
                )
                .slice(0, 8),
        )
        const subs = [...new Set(classes.map((c) => (c.subject || '').trim()).filter(Boolean))].sort()
        setProgramSubjects(subs)
        setGalleryTeasers(
          gallery.slice(0, 2).map((r) => ({
            src: resolveMediaUrl(r.image_url),
            caption: (r.caption || '').trim() || 'From our gallery',
          })),
        )
      } catch {
        if (!cancelled) {
          setHeroSlides([])
          setClassDetailTitles([])
          setProgramSubjects([])
          setGalleryTeasers([])
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-dvh bg-surface font-sans text-primary">
      <Navbar />
      <MusicHero slides={heroSlides} />
      <div className="mx-auto flex max-w-[1400px] gap-8 px-4 pb-10 pt-10 sm:px-6 lg:px-8 lg:pb-12 lg:pt-12 xl:gap-10">
        <MusicLandingSections
          classDetailTitles={classDetailTitles}
          programSubjects={programSubjects}
          galleryTeasers={galleryTeasers}
        />
        <Sidebar />
      </div>
      <PublicFooter />
    </div>
  )
}
