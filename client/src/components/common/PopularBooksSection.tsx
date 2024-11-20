import { useEffect, useState } from "react";
import BookItem from "./BookItem";
import clsx from "clsx";
import type { Book } from "@/types/global";

const PopularBooksSection = ({ className }: { className?: string }) => {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        const fetchBooks = async () => {
            const response = await fetch(import.meta.env.PUBLIC_API_URL);
            const data = await response.json();

            setBooks(data);
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {books.map((book, index) => (
                            <BookItem
                                key={index}
                                name={book.title}
                                imageUrl={"https://picsum.photos/200/400"}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

export default PopularBooksSection;
