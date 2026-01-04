"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/tmdb";
import { MediaResult } from "@/lib/types";
import { PlayCircle, Info, Star } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { AnimatePresence, motion } from "framer-motion";

interface HeroProps {
  media: MediaResult[];
}

export default function Hero({ media }: HeroProps) {
  if (!media || media.length === 0) return null;

  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
      className="relative w-full overflow-hidden"
    >
      <CarouselContent>
        {media.map((item, index) => {
          const title = item.title || item.name;
          const backdropUrl = getImageUrl(item.backdrop_path, "original");
          const href = `/media/${item.id}?type=${item.media_type}`;

          return (
            <CarouselItem key={item.id}>
              <div className="relative h-[50vh] md:h-[80vh] w-full">
                <AnimatePresence>
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 1 } }}
                    exit={{ opacity: 0, transition: { duration: 1 } }}
                    className="absolute inset-0"
                  >
                    {backdropUrl && (
                      <Image
                        src={backdropUrl}
                        alt={`Backdrop for ${title}`}
                        fill
                        className="object-cover object-center"
                        priority={index === 0}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent" />
                  </motion.div>
                </AnimatePresence>
                <div className="relative z-10 flex flex-col justify-end h-full container mx-auto px-4 pb-12 md:pb-20">
                    <motion.div
                        key={item.id + '-content'}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }}
                    >
                    <h1 className="font-headline text-4xl md:text-6xl font-bold max-w-2xl text-white">
                        {title}
                    </h1>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-1 text-yellow-400">
                            <Star className="h-5 w-5 fill-current" />
                            <span className="font-bold text-lg text-white">
                                {item.vote_average.toFixed(1)}
                            </span>
                        </div>
                        <span className="text-muted-foreground hidden md:inline">|</span>
                        <span className="text-muted-foreground text-sm">
                            {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
                        </span>
                    </div>
                    <p className="max-w-2xl mt-4 text-sm md:text-lg text-muted-foreground line-clamp-3">
                        {item.overview}
                    </p>
                    <div className="flex gap-4 mt-8">
                        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                        <Link href={href}>
                            <PlayCircle className="mr-2 h-6 w-6" />
                            Play
                        </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="bg-black/20 backdrop-blur-sm">
                            <Link href={href}>
                                <Info className="mr-2 h-6 w-6" />
                                More Info
                            </Link>
                        </Button>
                    </div>
                    </motion.div>
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}
