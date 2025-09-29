import { LoadingPage } from "@/src/components/svg/loading-page";

export default function RoadmapLoading() {
  return (
    <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
      <LoadingPage className="w-16 h-16 fill-color_main" />
    </div>
  );
} 