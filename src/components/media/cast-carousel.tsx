'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { getImageUrl } from '@/lib/tmdb';
import { CastMember } from '@/lib/types';
import { UserCircle } from 'lucide-react';

interface CastCarouselProps {
  cast: CastMember[];
}

export function CastCarousel({ cast }: CastCarouselProps) {
  return (
    <Carousel
      opts={{
        align: 'start',
        slidesToScroll: 3,
      }}
      className="w-full"
    >
      <CarouselContent>
        {cast.map((member) => (
          <CarouselItem
            key={member.id}
            className="basis-1/4 sm:basis-1/5 md:basis-1/6 lg:basis-1/8 xl:basis-1/10"
          >
            <div className="flex flex-col items-center text-center">
              <Card className="overflow-hidden rounded-full w-20 h-20 md:w-24 md:h-24 mb-2 border-2 border-transparent hover:border-accent transition-colors">
                <CardContent className="p-0 aspect-square">
                  <div className="relative w-full h-full">
                    {member.profile_path ? (
                      <Image
                        src={getImageUrl(member.profile_path, 'w185')}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 10vw, 8vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-card flex items-center justify-center">
                        <UserCircle className="w-10 h-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <p className="text-sm font-bold text-foreground truncate w-24">{member.name}</p>
              <p className="text-xs text-muted-foreground truncate w-24">{member.character}</p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
}
