import { Navbar } from '../components/Navbar'
import { MusicHero } from '../components/music/MusicHero'
import { MusicLandingSections } from '../components/music/MusicLandingSections'
import { Sidebar } from '../components/Sidebar'

export function LandingPage() {
  return (
    <div className="min-h-dvh bg-surface font-sans text-primary">
      <Navbar />
      <MusicHero />
      <div className="mx-auto flex max-w-[1400px] gap-8 px-4 pb-10 pt-10 sm:px-6 lg:px-8 lg:pb-12 lg:pt-12 xl:gap-10">
        <MusicLandingSections />
        <Sidebar />
      </div>
    </div>
  )
}
