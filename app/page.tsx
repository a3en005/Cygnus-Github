import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center">
      <Image
        src="/background.jpg"
        alt="Background"
        fill
        className="z-0 object-cover blur-lg brightness-75"
        priority
      />
      <div className="z-10 flex flex-col items-center justify-center glass-box p-8 rounded-2xl">
        <Image src="/cygnus-icon.png" alt="Cygnus Icon" width={56} height={56} />
        <Image src="/cygnus-logo.png" alt="Cygnus Logo" width={260} height={60} />
        <h1 className="mt-4 text-3xl font-bold text-white text-center drop-shadow">The Ultimate US/Canada People & Company Search Portal</h1>
        <p className="mt-2 text-white text-center max-w-lg drop-shadow">
          Instantly search for individuals or companies across all 50 states with live links and official sources.
        </p>
        <div className="mt-6 flex space-x-4">
          <a href="/auth/signup" className="btn-primary">Sign Up</a>
          <a href="/auth/signin" className="btn-secondary">Login</a>
        </div>
      </div>
    </div>
  )
}