import { HeroVideoDialog } from "@/components/ui/hero-video-dialog"

export function HeroVideoDialogDemo() {
  return (
    <div className="relative max-w-4xl mx-auto">
      <HeroVideoDialog
        animationStyle="from-center"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&h=1080&fit=crop&crop=entropy"
        thumbnailAlt="Nirvana Platform Demo"
      />
    </div>
  )
}

export function HeroVideoDialogDemoTopInBottomOut() {
  return (
    <div className="relative max-w-4xl mx-auto">
      <HeroVideoDialog
        animationStyle="top-in-bottom-out"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&h=1080&fit=crop&crop=entropy"
        thumbnailAlt="Nirvana Platform Demo"
      />
    </div>
  )
}

// Nirvana-themed demo with government interface mockup
export function NirvanaVideoDemo() {
  return (
    <div className="relative max-w-5xl mx-auto">
      <HeroVideoDialog
        animationStyle="from-center"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop&crop=entropy"
        thumbnailAlt="See how Nirvana transforms citizen-government interactions"
        className="rounded-2xl overflow-hidden border border-purple-500/20 shadow-2xl shadow-purple-500/10"
      />
    </div>
  )
}
