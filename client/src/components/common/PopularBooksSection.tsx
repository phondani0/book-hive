import React from "react";
import BookItem from "./BookItem";
import clsx from "clsx";

const PopularBooksSection = ({ className }: { className?: string }) => {
    return (
        <section className={clsx(className)}>
            <div className="mb-5">
                <h2 className="text-2xl font-bold">Popular Books</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <BookItem
                    name="Book 1"
                    imageUrl={"https://picsum.photos/200/400"}
                />
                <BookItem
                    name="Book 2"
                    imageUrl={"https://picsum.photos/200/400"}
                />
                <BookItem
                    name="Book 3"
                    imageUrl={"https://picsum.photos/200/400"}
                />
                <BookItem
                    name="Book 4"
                    imageUrl={"https://picsum.photos/200/400"}
                />
            </div>
        </section>
    );
};

export default PopularBooksSection;
