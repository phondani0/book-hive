import React from "react";
import Link from "../core/link/Link";

type BookItemProps = {
    id: string;
    name: string;
    imageUrl: string;
};

const BookItem: React.FC<BookItemProps> = ({ id, name, imageUrl }) => {
    return (
        <div className="w-56">
            <Link navigateTo={`/book?id=${id}`}>
                <img
                    src={imageUrl}
                    alt="Book cover"
                    className="w-full h-72 object-cover rounded-md mb-8"
                    style={{
                        boxShadow: "rgb(0 0 0 / 57%) -7px 9px 14px 0px",
                    }}
                />
            </Link>
            <Link navigateTo={`/book?id=${id}`}>
                <h3 className="text-sm italic">{name}</h3>
            </Link>
        </div>
    );
};

export default BookItem;
