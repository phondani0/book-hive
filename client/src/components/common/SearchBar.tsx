import clsx from "clsx";

const SearchBar = ({ className }: { className?: string }) => {
    return (
        <div className={clsx("relative", className)}>
            {/* Search Icon */}
            <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>

            <input
                type="text"
                placeholder="Search books..."
                className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-gray-200 transition-all"
            />
        </div>
    );
};

export default SearchBar;
