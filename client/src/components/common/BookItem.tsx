import React from "react";

type BookItemProps = {
    name: string;
    imageUrl: string;
};

const BookItem: React.FC<BookItemProps> = ({ name, imageUrl }) => {
    return (
        <div className="w-40">
            <img
                src={imageUrl}
                alt="Book cover"
                className="w-full h-48 object-cover rounded-md mb-2 border shadow-sm"
            />
            <h3 className="text-sm italic">{name}</h3>
        </div>
    );
};

export default BookItem;
