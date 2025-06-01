import {Navbar} from "@/components/general/Navbar";
import {ReactNode} from "react";
import BannerVideo from "@/components/general/BannerVideo";


export default function MainLayout({children}: {children: ReactNode}) {
    return (
        <div className={"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
            <Navbar />
            <BannerVideo
  videoSource="https://d1m1owm6cs8qcm.cloudfront.net/Cassy%20Ndembe_Starlight.mp4"
  posterImage="https://example.com/path-to-poster.jpg"
/>


            {children}

        </div>
    )
}