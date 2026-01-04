"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface EpisodeSelectorProps {
  mediaId: string;
  seasons: NonNullable<Media['seasons']>;
  title: string;
}

export default function EpisodeSelector({ mediaId, seasons, title }: EpisodeSelectorProps) {
  const [selectedSeason, setSelectedSeason] = useState(
    seasons.find((s) => s.season_number !== 0)?.season_number ?? seasons[0]?.season_number ?? 1
  );
  const [selectedEpisode, setSelectedEpisode] = useState(1);

  const seasonDetails = seasons.find((s) => s.season_number === selectedSeason);
  const episodeCount = seasonDetails?.episode_count || 0;

  const handleSeasonChange = (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
    setSelectedEpisode(1);
  };
  
  const seasonOptions = seasons.filter((s) => s.season_number > 0);

  if (seasonOptions.length === 0) {
    return <StreamPlayer title={title} mediaId={mediaId} mediaType="tv" season={1} episode={1} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seasons & Episodes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
        <Tabs defaultValue={String(selectedSeason)} onValueChange={(val) => handleSeasonChange(Number(val))}>
          <div className="flex items-center justify-between">
            <TabsList className="hidden sm:inline-flex">
              {seasonOptions.map((season) => (
                <TabsTrigger key={season.id} value={String(season.season_number)}>
                  {season.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="sm:hidden w-full">
              <Select onValueChange={(val) => handleSeasonChange(Number(val))} defaultValue={String(selectedSeason)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a season" />
                </SelectTrigger>
                <SelectContent>
                  {seasonOptions.map((season) => (
                    <SelectItem key={season.id} value={String(season.season_number)}>
                      {season.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {seasonOptions.map((season) => (
            <TabsContent key={season.id} value={String(season.season_number)}>
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 py-4">
                  {Array.from({ length: season.episode_count }, (_, i) => i + 1).map((episode) => (
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
            </TabsContent>
          ))}
        </Tabs>
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
