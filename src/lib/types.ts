export interface PaginatedResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

export interface MediaResult {
    id: number;
    title?: string;
    name?: string;
    poster_path: string;
    media_type: 'movie' | 'tv';
}

export interface Media {
    id: number;
    title?: string;
    name?: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
}
