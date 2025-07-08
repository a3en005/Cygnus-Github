type Props = { results?: any[] }

export default function SearchResults({ results }: Props) {
  if (!results || results.length === 0)
    return null

  return (
    <div className="glass-box p-4 rounded-xl mt-6">
      <h3 className="font-semibold text-gray-800 mb-2">Results</h3>
      <ul>
        {results.map((result, idx) => (
          <li key={idx} className="mb-2">
            <a href={result.source_url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline font-medium">
              {result.source_name}
            </a>
            <span className="ml-2 text-gray-600 text-sm">({result.country}, {result.type})</span>
          </li>
        ))}
      </ul>
    </div>
  )
}