import { Media, MediaResult, PaginatedResponse } from "./types";

const API_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/";

async function fetchFromTMDB<T>(endpoint: string, cache: RequestCache = 'force-cache'): Promise<T> {
    const API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!API_KEY) {
        throw new Error("TMDB_API_KEY is not configured");
    }
    const url = `${API_URL}/${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}`;
    const response = await fetch(url, { cache });
    if (!response.ok) {
        console.error(`Failed to fetch from TMDB: ${response.statusText}`, await response.json());
        throw new Error(`Failed to fetch from TMDB: ${response.statusText}`);
    }
    return response.json();
}

export async function getTrending(timeWindow: 'day' | 'week' = 'week'): Promise<MediaResult[]> {
    const data = await fetchFromTMDB<PaginatedResponse<MediaResult>>(`trending/all/${timeWindow}`, 'no-store');
    return data.results;
}

export async function getPopularMovies(page: number = 1): Promise<PaginatedResponse<MediaResult>> {
    const data = await fetchFromTMDB<PaginatedResponse<MediaResult>>(`movie/popular?page=${page}`);
    return { ...data, results: data.results.map(item => ({...item, media_type: 'movie'}))};
}

export async function getPopularTvShows(page: number = 1): Promise<PaginatedResponse<MediaResult>> {
    const data = await fetchFromTMDB<PaginatedResponse<MediaResult>>(`tv/popular?page=${page}`);
    return { ...data, results: data.results.map(item => ({...item, media_type: 'tv'}))};
}

export async function searchMedia(query: string, page: number = 1): Promise<PaginatedResponse<MediaResult>> {
    const data = await fetchFromTMDB<PaginatedResponse<MediaResult>>(`search/multi?query=${encodeURIComponent(query)}&page=${page}`, 'no-store');
    const filteredResults = data.results.filter(
        (item) => (item.media_type === "movie" || item.media_type === "tv") && item.poster_path
    );
    return { ...data, results: filteredResults };
}

export async function getMediaDetails(id: string, type: 'movie' | 'tv'): Promise<Media> {
    const endpoint = type === 'tv' 
        ? `${type}/${id}?append_to_response=credits,videos`
        : `${type}/${id}?append_to_response=credits,videos`;
    return fetchFromTMDB<Media>(endpoint);
}


export function getImageUrl(path: string | null | undefined, size: string = 'w500'): string {
    if (!path) return '/placeholder.svg';
    return `${IMAGE_URL}${size}${path}`;
}
