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
    backdrop_path: string;
    overview: string;
    media_type: 'movie' | 'tv';
    vote_average: number;
    genre_ids: number[];
}

export interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

export interface Media {
    id: number;
    title?: string;
    name?: string;
    overview: string;
    tagline?: string;
    poster_path: string;
    backdrop_path: string;
    vote_average: number;
    genres: { id: number, name: string }[];
    release_date?: string;
    first_air_date?: string;
    seasons?: {
        air_date: string;
        episode_count: number;
        id: number;
        name: string;
        overview: string;
        poster_path: string;
        season_number: number;
    }[];
    credits?: {
        cast: CastMember[];
    }
}
