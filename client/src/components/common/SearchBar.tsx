import clsx from "clsx";
import { Button } from "../ui/Button";
import { useEffect, useState } from "react";

const SearchBar = ({ className }: { className?: string }) => {
    const [searchInput, setSearchInput] = useState("");
    const params = new URLSearchParams();

    const query = params.get("query") || "";

    useEffect(() => {
        setSearchInput(query || "");
    }, [query]);

    const handleSearch = () => {
        params.set("query", searchInput);

        const newUrl = `/search?${params.toString()}`;
        window.location.href = newUrl;
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className={clsx("flex items-center gap-", className)}>
            <section className="relative flex-1">
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
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
            </section>

            <Button className="ml-5" onClick={handleSearch}>
                Search
            </Button>
        </div>
    );
};

export default SearchBar;
