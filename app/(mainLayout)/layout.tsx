import {Navbar} from "@/components/general/Navbar";
import {ReactNode} from "react";
import BannerVideo from "@/components/general/BannerVideo";
import VideoGrid from "@/components/general/VideoGrid";
import { PageTransition } from "@/components/general/PageTransition";


export default function MainLayout({children}: {children: ReactNode}) {
    return (
        <div className="w-full min-h-screen bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Navbar />
            </div>
            <BannerVideo
                videoSource="https://d1m1owm6cs8qcm.cloudfront.net/Cassy%20Ndembe_Starlight.mp4"
                posterImage="/images/BannerImage.png"
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <VideoGrid />
                <PageTransition>
                    {children}
                </PageTransition>
            </div>
        </div>
    )
}
