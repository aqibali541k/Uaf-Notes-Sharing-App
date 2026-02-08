import React, { useState } from 'react'

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("")

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value) // parent ko bhej do
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form className="max-w-3xl mx-auto" onSubmit={handleSubmit}>
      <div className="relative group">
        {/* Icon */}
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>

        {/* Input */}
        <input
          type="search"
          value={query}
          onChange={handleChange}
          placeholder="Search your notes..."
          className="block w-full p-4 pl-10 pr-28 text-sm text-gray-800 bg-white/70 backdrop-blur-lg rounded-full border border-gray-200 shadow-sm outline-none transition-all duration-300"
        />

        {/* Button */}
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          Search
        </button>
      </div>
    </form>
  )
}

export default SearchBar
