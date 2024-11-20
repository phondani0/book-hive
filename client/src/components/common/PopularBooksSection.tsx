import { useEffect, useState } from "react";
import BookItem from "./BookItem";
import clsx from "clsx";
import type { Book } from "@/types/global";

const PopularBooksSection = ({ className }: { className?: string }) => {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.PUBLIC_API_URL}/books`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const { data } = await response.json();
                setBooks([...(data || [])]);
            } catch (error) {
                console.error("Error fetching books:", error);
                setBooks([]);
            }
        };

        fetchBooks();
    }, []);

    return (
        <section className={clsx(className)}>
            {books.length > 0 && (
                <>
                    <div className="mb-5">
                        <h2 className="text-2xl font-bold">Popular Books</h2>
                    </div>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-x-10 gap-y-8">
                        {books.map((book, index) => (
                            <BookItem
                                key={index}
                                name={`${book.title} (${book.publication_year})`}
                                imageUrl={book.image_url}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

export default PopularBooksSection;
