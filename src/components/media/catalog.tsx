import MediaCard from "./media-card";
import { MediaResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CatalogProps {
  media: MediaResult[];
  title?: string;
  href?: string;
}

export default function Catalog({ media, title, href }: CatalogProps) {
  if (!media || !Array.isArray(media) || media.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20">
        <h2 className="font-headline text-2xl mb-2">No Results Found</h2>
        <p className="text-muted-foreground">
          Try adjusting your search to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <section>
        <div className="flex items-center justify-between mb-8">
            {title && <h2 className="font-headline text-2xl md:text-3xl font-bold">{title}</h2>}
            {href && (
                <Button asChild variant="ghost">
                    <Link href={href}>
                        View All
                        <ArrowRight className="ml-2 h-4 w-4"/>
                    </Link>
                </Button>
            )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {media.map((item) => (
            <MediaCard key={item.id} media={item} />
        ))}
        </div>
    </section>
  );
}
