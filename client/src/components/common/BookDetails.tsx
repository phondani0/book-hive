import { useEffect, useState } from "react";
import type { ApiResponse, Book, FCWithSkeleton } from "@/types/global";
import { Skeleton } from "../ui/Skeleton";
import { API_STATUS } from "@/types/enums";

const BookDetails: FCWithSkeleton = () => {
    const [bookResponse, setBookResponse] = useState<ApiResponse<Book>>({
        status: API_STATUS.LOADING,
    });

    const params = new URLSearchParams(window.location.search);
    const bookId = params.get("id");

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                setBookResponse({
                    status: API_STATUS.LOADING,
                });

                const response = await fetch(
                    `${import.meta.env.PUBLIC_API_URL}/books/${bookId}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setBookResponse({
                    status: API_STATUS.SUCCESS,
                    data,
                });
            } catch (error) {
                console.error("Error fetching book:", error);
                setBookResponse({
                    status: API_STATUS.FAILED,
                });
            }
        };

        if (bookId) {
            fetchBookDetails();
        }
    }, [bookId]);

    if (bookResponse?.status === API_STATUS.LOADING) {
        return <></>;
    }

    if (bookResponse?.status === API_STATUS.FAILED) {
        return <></>;
    }

    return (
        <section
            className="container mt-10 flex flex-col"
            style={{
                minHeight: "calc(100vh - 9rem)",
            }}
        >
            <div className="flex flex-col items-center min-h-52">
                <div className="flex justify-center gap-16 w-[65%]">
                    <div className="w-64 relative">
                        <img
                            className="w-auto object-cover rounded-md mb-8 absolute h-[23.5rem] shadow-4xl"
                            src={bookResponse.data.image_url}
                            alt="Book cover"
                        />
                    </div>

                    <div className="flex-1">
                        <h1 className="text-4xl leading-[3rem]">
                            {bookResponse.data.title}
                        </h1>

                        <div className="text-gray-500 mt-8 line-clamp-2">
                            {bookResponse.data.description}
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white flex-grow overflow-auto mt-8 p-40 pt-52">
                <h3 className="text-2xl font-semibold mb-4 text-gray-600">
                    Description
                </h3>
                <div className="text-sm text-gray-600 tracking-wider leading-6">
                    {bookResponse.data.description}
                </div>
            </div>
        </section>
    );
};

const BookDetailsSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    );
};

BookDetails.Skeleton = BookDetailsSkeleton;

export default BookDetails;
