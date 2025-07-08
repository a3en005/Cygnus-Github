import SearchForm from '../../components/SearchForm'
import SearchResults from '../../components/SearchResults'

export default function DashboardPage() {
  // Later: SSR auth protection here
  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-gray-50">
      <SearchForm />
      <div className="mt-8 w-full max-w-2xl">
        <SearchResults />
      </div>
    </div>
  )
}