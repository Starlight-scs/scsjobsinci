"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

type VideoItem = {
  title: string;
  description: string;
  videoSource: string;
  posterImage?: string;
};

const videos: VideoItem[] = [
  {
    title: "Purpose: Tallgrass Robotics",
    description:
      "Why the work matters — the mission and people behind every shift.",
    videoSource: "https://d1m1owm6cs8qcm.cloudfront.net/Cassy%20Ndembe_Starlight.mp4",
    posterImage: "https://picsum.photos/seed/tallgrass-purpose/800/450",
  },
  {
    title: "Craft: Decatur Forge Co.",
    description:
      "Mastery in motion — the skill and care that goes into doing the job right.",
    videoSource: "https://d1m1owm6cs8qcm.cloudfront.net/Cassy%20Ndembe_Starlight.mp4",
    posterImage: "https://picsum.photos/seed/decatur-craft/800/450",
  },
  {
    title: "Adaptability: Midwest AI Labs",
    description:
      "Thriving alongside automation — how work evolves in the age of AI.",
    videoSource: "https://d1m1owm6cs8qcm.cloudfront.net/Cassy%20Ndembe_Starlight.mp4",
    posterImage: "https://picsum.photos/seed/midwest-adaptability/800/450",
  },
];

const VideoCard: React.FC<{ video: VideoItem; index: number }> = ({ video, index }) => {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handlePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    el.play();
    setIsPlaying(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-2xl bg-black shadow-lg ring-1 ring-border/40"
    >
      <div className="relative aspect-video w-full">
        <video
          ref={videoRef}
          src={video.videoSource}
          poster={video.posterImage}
          playsInline
          preload="metadata"
          controls={isPlaying}
          onPause={() => setIsPlaying(false)}
          className="h-full w-full object-cover"
        />

        {!isPlaying && (
          <button
            type="button"
            onClick={handlePlay}
            aria-label={`Play ${video.title}`}
            className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors hover:bg-black/30"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-xl transition-transform group-hover:scale-110">
              <Play className="h-7 w-7 translate-x-0.5" fill="currentColor" />
            </span>
          </button>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-foreground">{video.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {video.description}
        </p>
      </div>
    </motion.div>
  );
};

const VideoGrid: React.FC = () => {
  return (
    <section className="mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-8 max-w-3xl"
      >
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Why We Work
        </h2>
        <p className="mt-3 text-base md:text-lg text-muted-foreground">
          Short films on purpose, process, and what work looks like as
          technology reshapes every industry.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, index) => (
          <VideoCard key={video.title} video={video} index={index} />
        ))}
      </div>
    </section>
  );
};

export default VideoGrid;
