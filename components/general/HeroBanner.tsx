import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function HeroBanner() {
  // Single media item (choose the first item from the list)
  const mediaItem = {
    type: "video", // Change to "image" if needed
    src: "https://d1m1owm6cs8qcm.cloudfront.net/banner_video_jobsincentralil.mp4",
    alt: "Travel Adventure",
    title: "Find work in Macon County",
    description: "Let's get you connected with best the jobs in Macon County",
  };

  return (
      <AspectRatio className={"max-w-full"} ratio={16 / 7}>
        {mediaItem.type === "image" ? (
          <Image
            src={mediaItem.src}
            alt={mediaItem.alt}
            layout="fill"
            objectFit="cover"
            priority
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <video
            src={mediaItem.src}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
           <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center text-white px-6">
        <h1 className="text-4xl md:text-6xl font-bold">{mediaItem.title}</h1>
        <p className="text-lg md:text-xl mt-4 max-w-2xl">{mediaItem.description}</p>
        <button className="mt-6 bg-primary text-white px-6 py-3 rounded-lg shadow-lg text-lg font-medium hover:bg-primary/80 transition">
          Get Started
        </button>
      </div>

      </AspectRatio>

  );
}
