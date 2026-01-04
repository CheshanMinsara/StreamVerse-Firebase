import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import StreamPlayer from "@/components/media/stream-player";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getMediaDetails, getImageUrl } from "@/lib/tmdb";
import { Media } from "@/lib/types";

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

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Browse
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
            <Badge variant="outline" className="w-fit mb-4">{typeLabel}</Badge>
            <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-prose">
              {media.overview}
            </p>
            <div className="mt-auto flex gap-4">
              <StreamPlayer title={title} mediaId={media.id.toString()} mediaType={searchParams.type} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
