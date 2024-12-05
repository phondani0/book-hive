import React from "react";
import Link from "../core/link/Link";
import clsx from "clsx";

type BookItemProps = {
    id: string;
    name: string;
    imageUrl: string;
    className?: string;
    showLabel?: boolean;
    imageClassName?: string;
};

const BookItem: React.FC<BookItemProps> = ({
    id,
    name,
    imageUrl,
    className,
    showLabel = true,
    imageClassName,
}) => {
    return (
        <div className={clsx("w-48", className)}>
            <Link navigateTo={`/book?id=${id}`}>
                <img
                    src={imageUrl}
                    alt="Book cover"
                    className={clsx(
                        "w-full h-60 object-cover rounded-md mb-8",
                        imageClassName
                    )}
                    style={{
                        boxShadow: "rgb(0 0 0 / 57%) -7px 9px 14px 0px",
                    }}
                />
            </Link>
            {showLabel && (
                <Link navigateTo={`/book?id=${id}`}>
                    <h3 className="text-sm italic">{name}</h3>
                </Link>
            )}
        </div>
    );
};

export default BookItem;
