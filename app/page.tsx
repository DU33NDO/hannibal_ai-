"use client";

import { useState, useEffect } from "react";
import { TornLetter } from "@/components/torn-letter";
import { BloodyButton } from "@/components/bloody-button";
import { generateStory } from "./actions";

export default function Home() {
  const [clickCount, setClickCount] = useState(0);
  const [bloodLevel, setBloodLevel] = useState(0);
  const [isFullBlood, setIsFullBlood] = useState(false);
  const [storyParts, setStoryParts] = useState<string[]>([]);
  const [currentPart, setCurrentPart] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const quotes = [
    "Порой думаешь, что всё хорошо, — а уже кто-то роет тебе могилу",
    "Шрамы имеют власть над людьми, они напоминают нам, что прошлое реально",
    "Ненормальная реакция на нестандартную ситуацию — это нормально",
    "Мясо горько от того, что оно мертво",
    "Психопаты не безумны. Они прекрасно знают, что делают и какие от этого будут последствия",
    "Мне не интересно понимать овец. Только есть их",
    "Знаете, кого вы напоминаете мне в этих дешевых туфлях и с дорогой сумкой? Обыкновенную деревенщину.",
  ];

  useEffect(() => {
    const fetchStory = async () => {
      setIsLoading(true);
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      const result = await generateStory(randomQuote);

      if (result.success && result.storyParts.length > 0) {
        setStoryParts(result.storyParts);
        setCurrentPart(result.storyParts[0]);
      } else {
        const fallbackParts = Array(10).fill(
          "The whispers grow louder as the darkness deepens. Soon, you'll understand the meaning behind these words."
        );
        setStoryParts(fallbackParts);
        setCurrentPart(fallbackParts[0]);
      }

      setIsLoading(false);
    };

    fetchStory();
  }, []);

  const handleClick = () => {
    if (isLoading) return;

    const newBloodLevel = bloodLevel + 1;
    setBloodLevel(newBloodLevel);

    if (newBloodLevel === 10) {
      setIsFullBlood(true);
    }

    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    const nextPartIndex = newClickCount % storyParts.length;
    setCurrentPart(storyParts[nextPartIndex]);

    if (nextPartIndex === 0 && newClickCount > 0) {
      regenerateStory();
    }
  };

  const regenerateStory = async () => {
    setIsLoading(true);
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const result = await generateStory(randomQuote);

    if (result.success && result.storyParts.length > 0) {
      setStoryParts(result.storyParts);
      setCurrentPart(result.storyParts[0]);
    }

    setIsLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#000000]">
      <div className="w-full max-w-md">
        <TornLetter
          message={isLoading ? "..." : currentPart.toUpperCase()}
          bloodLevel={bloodLevel}
          isFullBlood={isFullBlood}
        />
        <div className="mt-6 flex justify-center">
          <BloodyButton
            onClick={handleClick}
            bloodLevel={bloodLevel}
            isFullBlood={isFullBlood}
            disabled={isLoading}
          >
            {isLoading ? "READING..." : "READ MORE"}
          </BloodyButton>
        </div>
        <div className="mt-4 text-center text-[#9E9FAA] text-xs">
          {!isLoading && `PART ${(clickCount % 10) + 1} OF 10`}
        </div>
      </div>
    </main>
  );
}
