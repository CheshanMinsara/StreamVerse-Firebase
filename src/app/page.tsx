import Catalog from "@/components/media/catalog";
import Header from "@/components/layout/header";
import { getTrending, getPopularMovies, getPopularTvShows } from "@/lib/tmdb";
import Hero from "@/components/media/hero";

export default async function Home() {
  const [trending, popularMovies, popularTvShows] = await Promise.all([
    getTrending('day'),
    getPopularMovies(),
    getPopularTvShows()
  ]);
  
  const heroMedia = trending.slice(0, 5);

  return (
    <>
      <Header />
      <div className="flex flex-col">
        <Hero media={heroMedia} />
        <div className="container mx-auto px-4 py-8 space-y-16">
          <Catalog title="Popular Movies" media={popularMovies.results} href="/discover/movie"/>
          <Catalog title="Popular TV Shows" media={popularTvShows.results} href="/discover/tv"/>
        </div>
      </div>
    </>
  );
}
