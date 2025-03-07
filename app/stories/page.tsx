import StoryGallery from "@/components/story-gallery";
import Link from "next/link";

export default function StoriesPage() {
  return (
    <main className="min-h-screen bg-[#000000] text-white">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-serif text-[#641414] tracking-wider">
              STORY COLLECTION
            </h1>
            <Link
              href="/"
              className="text-[#9E9FAA] hover:text-[#641414] transition-colors duration-300 border-b border-[#641414] pb-1 font-serif"
            >
              RETURN TO READER
            </Link>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#641414] to-transparent mt-4"></div>
        </header>

        <StoryGallery />
      </div>
    </main>
  );
}
