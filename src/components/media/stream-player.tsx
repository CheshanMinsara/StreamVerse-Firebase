"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Play } from "lucide-react";
import Link from "next/link";

interface StreamPlayerProps {
  title: string;
  mediaId: string;
  mediaType: 'movie' | 'tv';
  season?: number;
  episode?: number;
}

export default function StreamPlayer({ title, mediaId, mediaType, season, episode }: StreamPlayerProps) {
  const streamDomain = "vidsrc.to/embed";
  const downloadDomain = "dl.vidsrc.vip";

  let streamUrl: string;
  let downloadUrl: string;

  if (mediaType === 'tv') {
    streamUrl = `https://${streamDomain}/tv/${mediaId}`;
    downloadUrl = `https://${downloadDomain}/tv/${mediaId}`;
    if (season && episode) {
      streamUrl += `/${season}/${episode}`;
      downloadUrl += `/${season}/${episode}`;
    }
  } else {
    streamUrl = `https://${streamDomain}/movie/${mediaId}`;
    downloadUrl = `https://${downloadDomain}/movie/${mediaId}`;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
            <Play className="mr-2 h-5 w-5 fill-current" />
            Play
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[70vw] p-0 border-0 bg-black">
          <DialogHeader className="p-4">
            <DialogTitle className="text-white">{title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full">
              <iframe
                src={streamUrl}
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
          </div>
        </DialogContent>
      </Dialog>
       <Button asChild size="lg" variant="outline" className="w-full">
            <Link href={downloadUrl} target="_blank">
                <Download className="mr-2 h-5 w-5" />
                Download
            </Link>
        </Button>
    </div>
  );
}
