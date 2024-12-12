import { useEffect, useState } from "react";
import type { ApiResponse, Book, FCWithSkeleton } from "@/types/global";
import { Skeleton } from "../ui/Skeleton";
import { API_STATUS } from "@/types/enums";
import { motion } from "framer-motion";
import { AvatarIcon, CalendarIcon } from "@radix-ui/react-icons";

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
        return <BookDetailsSkeleton />;
    }

    if (bookResponse?.status === API_STATUS.FAILED) {
        return <></>;
    }

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mt-10 flex flex-col"
            style={{
                minHeight: "calc(100vh - 9rem)",
            }}
        >
            <div className="flex flex-col items-center min-h-64">
                <div className="flex justify-center gap-16 w-[65%]">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-64 relative"
                    >
                        <img
                            className="w-auto object-cover rounded-md mb-8 absolute h-[23.5rem] shadow-4xl"
                            src={bookResponse.data.image_url}
                            alt="Book cover"
                        />
                    </motion.div>

                    <div className="flex-1">
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl leading-[3rem] line-clamp-2"
                        >
                            {bookResponse.data.title}
                        </motion.h1>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className=" flex text-gray-500 mt-2 mb-6"
                        >
                            <div className="flex items-center gap-2">
                                <AvatarIcon className="w-5 h-5 text-primary" />
                                <span className="text-sm text-gray-600">
                                    {bookResponse.data.author}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-primary" />
                                <span className="text-sm text-gray-600">
                                    {bookResponse.data.publication_year}
                                </span>
                            </div>
                            {/* <div className="flex items-center gap-2">
			  <Star className="w-5 h-5 text-yellow-400" />
			  <span className="text-sm text-gray-600">{bookResponse.data..toFixed(1)}</span>
			</div> */}
                        </motion.div>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-gray-600 mb-8 line-clamp-2"
                        >
                            {bookResponse.data.description}
                        </motion.p>

                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors"
                        >
                            Add to Reading List
                        </motion.button>
                    </div>
                </div>
            </div>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-white flex-grow overflow-auto mt-8 p-40 pt-40"
            >
                <h3 className="text-2xl font-semibold mb-4 text-gray-600">
                    Description
                </h3>
                <div className="text-sm text-gray-600 tracking-wider leading-6">
                    {bookResponse.data.description}
                </div>
            </motion.div>
        </motion.section>
    );
};

const BookDetailsSkeleton: React.FC = () => {
    return (
        <div className="container mt-10 flex flex-col min-h-[calc(100vh-9rem)]">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16">
                <Skeleton className="w-64 h-96 rounded-lg" />
                <div className="flex-1 max-w-2xl space-y-4">
                    <Skeleton className="h-12 w-3/4" />
                    <div className="flex flex-wrap gap-4">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-10 w-40" />
                </div>
            </div>
            <div className="mt-12 space-y-4">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-40 w-full" />
            </div>
        </div>
    );
};

BookDetails.Skeleton = BookDetailsSkeleton;

export default BookDetails;
