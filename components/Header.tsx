import Image from "next/image"
export default function Header() {
  return (
    <header className="w-full flex items-center justify-between p-4 bg-white bg-opacity-80 backdrop-blur shadow">
      <div className="flex items-center space-x-2">
        <Image src="/cygnus-icon.png" alt="Icon" width={36} height={36} />
        <Image src="/cygnus-logo.png" alt="Cygnus Logo" width={120} height={30} />
      </div>
      <nav>
        <a href="/" className="text-blue-800 font-semibold mr-4">Home</a>
        <a href="/dashboard" className="text-blue-800 font-semibold mr-4">Dashboard</a>
        <a href="/profile" className="text-blue-800 font-semibold">Profile</a>
      </nav>
    </header>
  )
}