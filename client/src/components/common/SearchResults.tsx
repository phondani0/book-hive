import type { Book } from "@/types/global";
import type React from "react";
import { useEffect, useState } from "react";
import BookItem from "./BookItem";

const SearchResults: React.FC = () => {
    const [results, setResults] = useState<Book[]>([]);

    useEffect(() => {
        const searchQuery = new URLSearchParams(window.location.search).get(
            "query"
        );
        if (!searchQuery) return;

        const fetchBooks = async (query: string) => {
            try {
                const response = await fetch(
                    `${
                        import.meta.env.PUBLIC_API_URL
                    }/books?${new URLSearchParams({
                        offset: "0",
                        limit: "50",
                        search: query,
                    })}`
                );

                if (!response.ok)
                    throw new Error(`HTTP error! status: ${response.status}`);
                const { data } = await response.json();
                setResults(data || []);
            } catch (error) {
                console.error("Error fetching books:", error);
                setResults([]);
            }
        };

        fetchBooks(searchQuery);
    }, []);

    return (
        <section className="mt-16">
            {results.length > 0 ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-16 gap-y-12">
                    {results.map((book, index) => (
                        <BookItem
                            key={index}
                            id={book.id}
                            name={`${book.title} (${book.publication_year})`}
                            imageUrl={book.image_url}
                        />
                    ))}
                </div>
            ) : (
                <div>No results found</div>
            )}
        </section>
    );
};

export default SearchResults;
