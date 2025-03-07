"use client";

import { useState, useEffect } from "react";
import { getAllStories } from "../app/actions";
import StoryCard from "./story-card";
import StoryViewer from "./story-viewer";
import { Loader2 } from "lucide-react";

type Story = {
  story_id: number;
  plot: string;
  book_based_story: string;
  story_telling_inspiration: string;
  createdAt: string;
};

export default function StoryGallery() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  useEffect(() => {
    async function loadStories() {
      try {
        const result = await getAllStories();
        if (!result) {
          console.warn("No stories received");
          return;
        }
        if (result.success) {
          setStories(result.stories);
        }
      } catch (error) {
        console.error("Failed to load stories:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStories();
  }, []);

  const handleStoryClick = (story: Story) => {
    setSelectedStory(story);
    setViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setViewerOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Грузим истории...</span>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed border-gray-700 rounded-lg">
        <p className="text-xl">Пока ничего нет.</p>
        <p className="text-gray-400 mt-2">Го сделаем первую историю</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <StoryCard
            key={story.story_id}
            story={story}
            onClick={() => handleStoryClick(story)}
          />
        ))}
      </div>

      {viewerOpen && selectedStory && (
        <StoryViewer story={selectedStory} onClose={handleCloseViewer} />
      )}
    </div>
  );
}
