
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StreamPlayer from "./stream-player";
import { Media } from "@/lib/types";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

interface EpisodeSelectorProps {
  mediaId: string;
  seasons: NonNullable<Media['seasons']>;
  title: string;
}

export default function EpisodeSelector({ mediaId, seasons, title }: EpisodeSelectorProps) {
  const seasonOptions = seasons.filter((s) => s.season_number > 0 && s.episode_count > 0);

  const [selectedSeason, setSelectedSeason] = useState(
    seasonOptions[0]?.season_number ?? 1
  );
  const [selectedEpisode, setSelectedEpisode] = useState(1);

  const seasonDetails = seasonOptions.find((s) => s.season_number === selectedSeason);
  
  const handleSeasonChange = (seasonNumber: string) => {
    setSelectedSeason(Number(seasonNumber));
    setSelectedEpisode(1);
  };
  
  if (seasonOptions.length === 0) {
    // This case handles shows where seasons are listed but have 0 episodes, or only "Specials" (season 0)
    return <StreamPlayer title={title} mediaId={mediaId} mediaType="tv" season={1} episode={1} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seasons & Episodes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
              <Select onValueChange={handleSeasonChange} defaultValue={String(selectedSeason)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a season" />
                </SelectTrigger>
                <SelectContent>
                  {seasonOptions.map((season) => (
                    <SelectItem key={season.id} value={String(season.season_number)}>
                      {season.name} ({season.episode_count} Episodes)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {seasonDetails && (
                 <ScrollArea className="h-48 w-full rounded-md border p-4">
                    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                    {Array.from({ length: seasonDetails.episode_count }, (_, i) => i + 1).map((episode) => (
                        <Button
                        key={episode}
                        variant={selectedEpisode === episode ? "default" : "outline"}
                        onClick={() => setSelectedEpisode(episode)}
                        className="aspect-square"
                        >
                        {episode}
                        </Button>
                    ))}
                    </div>
                </ScrollArea>
              )}
          </div>
          <StreamPlayer
            title={`${title} - S${selectedSeason} E${selectedEpisode}`}
            mediaId={mediaId}
            mediaType="tv"
            season={selectedSeason}
            episode={selectedEpisode}
          />
        </div>
      </CardContent>
    </Card>
  );
}
