export interface Book {
    id: string;
    isbn: string;
    title: string;
    author: string;
    publication_year: number;
    genre: string;
    image_url: string;
}

export interface FCWithSkeleton<T = {}> extends React.FC<T> {
    Skeleton: React.FC;
}
