import Catalog from "@/components/media/catalog";
import Header from "@/components/layout/header";
import { getTrending, searchMedia } from "@/lib/tmdb";
import { MediaResult } from "@/lib/types";

interface HomeProps {
  searchParams: {
    q?: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const searchQuery = searchParams.q || "";
  let media: MediaResult[];

  if (searchQuery) {
    media = await searchMedia(searchQuery);
  } else {
    media = await getTrending();
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Catalog media={media} />
      </div>
    </>
  );
}
