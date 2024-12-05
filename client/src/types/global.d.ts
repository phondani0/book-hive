import { API_STATUS } from "./enums";

export type ApiResponse<T> =
    | {
          status: API_STATUS.LOADING;
      }
    | {
          status: API_STATUS.FAILED;
      }
    | {
          status: API_STATUS.SUCCESS;
          data: T;
      };

export interface FCWithSkeleton<T = {}> extends React.FC<T> {
    Skeleton: React.FC;
}

export interface Book {
    id: string;
    isbn: string;
    title: string;
    description: string;
    author: string;
    publication_year: number;
    genre: string;
    image_url: string;
}
