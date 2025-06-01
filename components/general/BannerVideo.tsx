"use client";

import React from "react";

type BannerVideoProps = {
  videoSource: string;
  posterImage?: string;
};

const BannerVideo: React.FC<BannerVideoProps> = ({ videoSource, posterImage }) => {
  return (
    <div className="w-full">
      <div className="relative h-[55vh] lg:h-[35vh] w-full flex justify-start items-center">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={posterImage}
          src={videoSource}
          className="w-full h-full object-cover absolute top-0 left-0 -z-50 brightness-[40%]"
        />
        <div className="absolute w-full px-6 lg:px-20">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl">
            Why We Work
          </h1>
          <p className="text-white text-lg mt-5 max-w-2xl"> Your Purpose. Your Path. Your Work. </p>
          <div className="flex gap-x-3 mt-4">
              <p>

              </p>
            {/* Optional content overlay goes here */}
          </div>
        </div>
      </div>
      <div className="h-12 lg:h-20" /> {/* Bottom spacing before next content */}
    </div>
  );
};

export default BannerVideo;
