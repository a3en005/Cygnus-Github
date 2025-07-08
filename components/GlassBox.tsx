export default function GlassBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass-box p-8 rounded-2xl shadow-lg">
      {children}
    </div>
  )
}