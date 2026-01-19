"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clapperboard, Download, Play, Server, Terminal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface StreamPlayerProps {
  title: string;
  mediaId: string;
  mediaType: 'movie' | 'tv';
  season?: number;
  episode?: number;
}

const servers = [
    { name: "Server 1", url: "https://vidfast.pro" },
    { name: "Server 2", url: "https://www.2embed.stream" }
];
type ServerType = typeof servers[0];

export default function StreamPlayer({ title, mediaId, mediaType, season, episode }: StreamPlayerProps) {
  const [selectedServer, setSelectedServer] = useState(servers[0]);
  const [isSwitching, setIsSwitching] = useState(false);

  const getStreamUrl = () => {
    let url = selectedServer.url;
    
    if (selectedServer.name === 'Server 1') { // vidfast.pro
      if (mediaType === 'movie') {
        url += `/movie/${mediaId}`;
      } else if (mediaType === 'tv' && season && episode) {
        url += `/tv/${mediaId}/${season}/${episode}`;
      }
    } else { // 2embed.stream
      url += `/embed/${mediaType}/${mediaId}`;
      if (mediaType === 'tv' && season && episode) {
          url += `/${season}/${episode}`;
      }
    }
    return url;
  };

  const streamUrl = getStreamUrl();
  
  const getDownloadUrl = () => {
    let url = "https://dl.vidsrc.vip";
    if (mediaType === 'movie') {
      url += `/movie/${mediaId}`;
    } else if (mediaType === 'tv' && season && episode) {
      url += `/tv/${mediaId}/${season}/${episode}`;
    }
    return url;
  }
  const downloadUrl = getDownloadUrl();

  const handleServerChange = (server: ServerType) => {
    if (server.url !== selectedServer.url) {
      setIsSwitching(true);
      setSelectedServer(server);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Dialog onOpenChange={(open) => !open && setIsSwitching(false)}>
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
          <div className="relative aspect-video w-full bg-black">
            {isSwitching && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/80">
                    <Clapperboard className="h-12 w-12 animate-logo-spin text-accent" />
                    <p className="text-muted-foreground">Switching servers...</p>
                </div>
            )}
            {streamUrl ? (
                <iframe
                    key={streamUrl}
                    src={streamUrl}
                    onLoad={() => setIsSwitching(false)}
                    allowFullScreen
                    referrerPolicy="origin"
                    className={cn("w-full h-full", isSwitching && "opacity-0")}
                ></iframe>
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-black text-white p-4">
                    <Alert variant="destructive" className="bg-red-900/50 border-red-500/50 text-white">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Playback Error</AlertTitle>
                        <AlertDescription>
                            There was an issue loading the video. Please try another server or check back later.
                        </AlertDescription>
                    </Alert>
                </div>
            )}
          </div>
           <div className="flex flex-wrap items-center justify-center gap-2 p-4 bg-black/50">
                {servers.map((server) => (
                    <Button 
                        key={server.name}
                        variant={selectedServer.name === server.name ? "default" : "outline"}
                        onClick={() => handleServerChange(server)}
                        disabled={isSwitching}
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
