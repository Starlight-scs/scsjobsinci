"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

type BannerVideoProps = {
  videoSource: string;
  posterImage?: string;
};

const BannerVideo: React.FC<BannerVideoProps> = ({ videoSource, posterImage }) => {
  const [showVideo, setShowVideo] = React.useState(true);
  const fallbackImage = posterImage || "/images/BannerImage.png";

  return (
    <section className="relative mb-12 w-full overflow-hidden bg-black">
      <div className="relative h-[60vh] lg:h-[45vh] w-full flex justify-start items-center">
        <Image
          src={fallbackImage}
          alt="Central Illinois jobs banner"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 z-0 object-cover brightness-[45%]"
        />

        {showVideo && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={fallbackImage}
            src={videoSource}
            onCanPlay={() => setShowVideo(true)}
            onError={() => setShowVideo(false)}
            className="absolute inset-0 z-0 h-full w-full object-cover brightness-[45%]"
          />
        )}
        
        <div className="absolute inset-0 z-10 bg-black/20" />
        <div className="absolute inset-x-0 bottom-0 z-10 h-2/3 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div className="absolute inset-x-0 z-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.h1 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-white text-4xl md:text-5xl lg:text-7xl font-bold max-w-4xl tracking-tight leading-[1.1]"
            >
              Work in Central <span className="text-primary drop-shadow-sm"> Illinois </span>
            </motion.h1>
          
            <motion.p 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-white/90 text-xl md:text-2xl mt-6 max-w-2xl font-medium"
            >
              Find your next opportunity right here in the heart of Central Illinois.
            </motion.p>
          
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex gap-x-4 mt-10"
            >
              {/* Optional action buttons could go here */}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerVideo;
