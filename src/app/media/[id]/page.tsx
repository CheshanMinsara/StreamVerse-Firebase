import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import StreamPlayer from "@/components/media/stream-player";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star } from "lucide-react";
import { getMediaDetails, getImageUrl } from "@/lib/tmdb";
import { Media } from "@/lib/types";
import Header from "@/components/layout/header";
import EpisodeSelector from "@/components/media/episode-selector";
import { CastCarousel } from "@/components/media/cast-carousel";
import AnimatedTagline from "@/components/media/animated-tagline";

interface MediaPageProps {
  params: {
    id: string;
  };
  searchParams: {
    type: 'movie' | 'tv';
  }
}

export async function generateMetadata({ params, searchParams }: MediaPageProps) {
  const media = await getMediaDetails(params.id, searchParams.type);
  if (!media) {
    return { title: "Not Found" };
  }
  const title = media.title || media.name;
  return {
    title: `${title} | StreamVerse`,
    description: media.overview,
  };
}

export default async function MediaPage({ params, searchParams }: MediaPageProps) {
  const media = await getMediaDetails(params.id, searchParams.type) as Media;

  if (!media) {
    notFound();
  }

  const title = media.title || media.name || 'Untitled';
  const typeLabel = searchParams.type === 'movie' ? 'Movie' : 'TV Show';
  const releaseYear = media.release_date ? new Date(media.release_date).getFullYear() : (media.first_air_date ? new Date(media.first_air_date).getFullYear() : 'N/A');

  return (
    <div className="min-h-screen">
      <Header />
      <div className="relative w-full">
        {media.backdrop_path && (
          <>
            <Image
              src={getImageUrl(media.backdrop_path, 'original')}
              alt={`Backdrop for ${title}`}
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-background/70 backdrop-blur-lg" />
          </>
        )}
        <div className="relative container mx-auto px-4 py-8">
          <Button asChild variant="ghost" className="mb-8">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <div className="grid md:grid-cols-3 lg:grid-cols-[1fr,2fr] gap-8 md:gap-12">
            <div className="aspect-[2/3] md:aspect-auto relative rounded-lg overflow-hidden shadow-2xl shadow-black/30">
              {media.poster_path ? (
                <Image
                  src={getImageUrl(media.poster_path)}
                  alt={`Poster for ${title}`}
                  width={500}
                  height={750}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-card flex items-center justify-center">
                  <span className="text-muted-foreground">No Poster</span>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <Badge variant="outline" className="w-fit mb-2">{typeLabel}</Badge>
              <h1 className="font-headline text-4xl md:text-5xl font-bold">
                {title}
              </h1>
              {media.tagline && <AnimatedTagline tagline={media.tagline} />}
              <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                  <span>{releaseYear}</span>
                  {media.vote_average > 0 && (
                      <>
                      <span>|</span>
                      <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="h-4 w-4 fill-current"/>
                          <span className="font-bold text-base text-foreground">{media.vote_average.toFixed(1)}</span>
                          <span className="text-xs text-muted-foreground">/ 10</span>
                      </div>
                      </>
                  )}
              </div>

              <div className="flex flex-wrap gap-2 my-4">
                {media.genres.map((genre) => (
                    <Badge key={genre.id} variant="secondary">
                    {genre.name}
                    </Badge>
                ))}
              </div>

              <p className="text-lg text-muted-foreground mb-8 max-w-prose">
                {media.overview}
              </p>
              
              <div className="flex flex-col gap-4">
                {searchParams.type === 'tv' && media.seasons && (
                  <EpisodeSelector mediaId={media.id.toString()} seasons={media.seasons} title={title} />
                )}
                {searchParams.type === 'movie' && (
                  <StreamPlayer title={title} mediaId={media.id.toString()} mediaType={searchParams.type} />
                )}
              </div>
            </div>
          </div>
          
          {media.credits && media.credits.cast.length > 0 && (
            <div className="mt-12">
              <h2 className="font-headline text-2xl font-bold mb-4">Cast</h2>
              <CastCarousel cast={media.credits.cast} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
