"use client";

import { motion } from "framer-motion";
import { Book, Calendar } from "lucide-react";

type Story = {
  story_id: number;
  plot: string;
  book_based_story: string;
  story_telling_inspiration: string;
  createdAt: string;
};

type StoryCardProps = {
  story: Story;
  onClick: () => void;
};

export default function StoryCard({ story, onClick }: StoryCardProps) {
  const formattedDate = new Date(story.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-slate-800 rounded-lg overflow-hidden shadow-lg border border-slate-700 hover:border-primary/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
            #{story.story_id}
          </span>
          <div className="flex items-center text-slate-400 text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            {formattedDate}
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-3 line-clamp-2">
          {story.plot}
        </h3>

        <div className="flex items-center text-slate-400 mt-4">
          <Book className="h-4 w-4 mr-2" />
          <span className="text-sm">
            Вдохновлено: {story.story_telling_inspiration}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
