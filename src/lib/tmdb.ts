import { Media, MediaResult, PaginatedResponse } from "./types";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const API_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/";

async function fetchFromTMDB<T>(endpoint: string): Promise<T> {
    const url = `${API_URL}/${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch from TMDB: ${response.statusText}`);
    }
    return response.json();
}

export async function getTrending(): Promise<MediaResult[]> {
    const data = await fetchFromTMDB<PaginatedResponse<MediaResult>>('trending/all/week');
    return data.results;
}

export async function searchMedia(query: string): Promise<MediaResult[]> {
    const data = await fetchFromTMDB<PaginatedResponse<MediaResult>>(`search/multi?query=${encodeURIComponent(query)}`);
    return data.results.filter(
        (item) => item.media_type === "movie" || item.media_type === "tv"
    );
}

export async function getMediaDetails(id: string, type: 'movie' | 'tv'): Promise<Media> {
    return fetchFromTMDB<Media>(`${type}/${id}`);
}

export function getImageUrl(path: string, size: string = 'w500'): string {
    return `${IMAGE_URL}${size}${path}`;
}
