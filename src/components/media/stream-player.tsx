
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Play, Server } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface StreamPlayerProps {
  title: string;
  mediaId: string;
  mediaType: 'movie' | 'tv';
  season?: number;
  episode?: number;
}

const servers = [
    { name: "Server 1", url: "https://vidsrc.to" },
    { name: "Server 2", url: "https://www.2embed.stream" }
];

export default function StreamPlayer({ title, mediaId, mediaType, season, episode }: StreamPlayerProps) {
  const [selectedServer, setSelectedServer] = useState(servers[0]);

  const getStreamUrl = () => {
    let url: string;
    if (selectedServer.url.includes('2embed.stream')) {
      if (mediaType === 'tv' && season && episode) {
        url = `${selectedServer.url}/iframe.php?id=${mediaId}&s=${season}&e=${episode}`;
      } else {
        url = `${selectedServer.url}/iframe.php?id=${mediaId}`;
      }
    } else { // For vidsrc.to and any other servers
      url = `${selectedServer.url}/embed/${mediaType}/${mediaId}`;
      if (mediaType === 'tv' && season && episode) {
        url += `/${season}/${episode}`;
      }
    }
    return url;
  };

  const downloadDomain = "dl.vidsrc.vip";
  let downloadUrl: string;

  if (mediaType === 'tv') {
    downloadUrl = `https://${downloadDomain}/tv/${mediaId}`;
    if (season && episode) {
      downloadUrl += `/${season}/${episode}`;
    }
  } else {
    downloadUrl = `https://${downloadDomain}/movie/${mediaId}`;
  }

  const streamUrl = getStreamUrl();

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
            {streamUrl ? (
                <iframe
                    src={streamUrl}
                    allowFullScreen
                    referrerPolicy="origin"
                    className="w-full h-full"
                    sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"
                ></iframe>
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-black text-white">
                    Select a server to play the video.
                </div>
            )}
          </div>
           <div className="flex flex-wrap items-center justify-center gap-2 p-4 bg-black/50">
                {servers.map((server) => (
                    <Button 
                        key={server.name}
                        variant={selectedServer.name === server.name ? "default" : "outline"}
                        onClick={() => setSelectedServer(server)}
                        className={cn(selectedServer.name !== server.name && "bg-background/20 border-white/20 hover:bg-white/10 hover:text-white text-white")}
                    >
                        <Server className="mr-2 h-4 w-4" />
                        {server.name}
                    </Button>
                ))}
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
