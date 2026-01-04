"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface StreamPlayerProps {
  title: string;
  mediaId: string;
  mediaType: 'movie' | 'tv';
  season?: number;
  episode?: number;
}

export default function StreamPlayer({ title, mediaId, mediaType, season, episode }: StreamPlayerProps) {
  let streamUrl: string;

  if (mediaType === 'tv') {
    streamUrl = `https://vidsrc.to/embed/tv/${mediaId}`;
    if (season && episode) {
      streamUrl += `/${season}/${episode}`;
    }
  } else {
    streamUrl = `https://vidsrc.to/embed/movie/${mediaId}`;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
          <Play className="mr-2 h-5 w-5 fill-current" />
          Play
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[80vw] p-0 border-0 bg-black">
        <DialogHeader className="p-4">
          <DialogTitle className="text-white">{title}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video w-full">
            <iframe
              src={streamUrl}
              allowFullScreen
              referrerPolicy="origin"
              className="w-full h-full"
            ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
}
