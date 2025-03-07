"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Calendar, User } from "lucide-react";

type Story = {
  story_id: number;
  plot: string;
  book_based_story: string;
  story_telling_inspiration: string;
  createdAt: string;
};

type StoryViewerProps = {
  story: Story;
  onClose: () => void;
};

export default function StoryViewer({ story, onClose }: StoryViewerProps) {
  const [storyParts, setStoryParts] = useState<string[]>([]);
  const [currentPart, setCurrentPart] = useState(0);

  useEffect(() => {
    // Split the story into parts for pagination
    const text = story.book_based_story;
    const sentences = text.split(/(?<=[.!?])\s+/);
    const chunkSize = Math.ceil(sentences.length / 10);
    const parts = Array.from({ length: 10 }, (_, i) =>
      sentences.slice(i * chunkSize, (i + 1) * chunkSize).join(" ")
    ).filter((part) => part.trim().length > 0);

    setStoryParts(parts);
    setCurrentPart(0);
  }, [story]);

  const handleNext = () => {
    if (currentPart < storyParts.length - 1) {
      setCurrentPart(currentPart + 1);
    }
  };

  const handlePrev = () => {
    if (currentPart > 0) {
      setCurrentPart(currentPart - 1);
    }
  };

  const formattedDate = new Date(story.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Almaty",
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 border-b border-slate-700">
            <h2 className="text-2xl font-bold">История #{story.story_id}</h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-slate-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">{story.plot}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-slate-300">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  <span>Вдохновлено: {story.story_telling_inspiration}</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPart}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="prose prose-invert prose-lg max-w-none"
                >
                  <p className="text-lg leading-relaxed">
                    {storyParts[currentPart]}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="p-6 border-t border-slate-700 flex justify-between items-center">
            <div className="text-sm text-slate-400">
              Part {currentPart + 1} of {storyParts.length}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handlePrev}
                disabled={currentPart === 0}
                className="p-2 rounded-full hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentPart === storyParts.length - 1}
                className="p-2 rounded-full hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
