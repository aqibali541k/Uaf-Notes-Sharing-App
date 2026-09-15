import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // parent ko bhej do
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      role="search"
      aria-label="Search notes"
      onSubmit={handleSubmit}
      className="w-full"
    >
      <div className="relative">
        {/* Icon */}
        <span
          className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400"
          aria-hidden="true"
        >
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
            focusable="false"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </span>

        {/* Input */}
        <input
          type="search"
          name="search"
          aria-label="Search shared notes by title"
          value={query}
          onChange={handleChange}
          placeholder="Search notes by title..."
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-24 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />

        {/* Button */}
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
