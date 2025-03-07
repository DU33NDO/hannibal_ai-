"use client";

import { useState } from "react";
import { TornLetter } from "@/components/torn-letter";
import { BloodyButton } from "@/components/bloody-button";
import { generateStory } from "./actions";
import Link from "next/link";

const literaryInspirations = ["Thomas Harris"];

const inspirationalBooks = [
  "Red Dragon (1981)",
  "The Silence of the Lambs (1988)",
  "Hannibal (1999)",
  "Hannibal: The Rising",
];

export default function Home() {
  const [clickCount, setClickCount] = useState(0);
  const [bloodLevel, setBloodLevel] = useState(0);
  const [isFullBlood, setIsFullBlood] = useState(false);
  const [storyParts, setStoryParts] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [storyGenerated, setStoryGenerated] = useState(false);

  const quotes = [
    "Порой думаешь, что всё хорошо, — а уже кто-то роет тебе могилу",
    "Шрамы имеют власть над людьми, они напоминают нам, что прошлое реально",
    "Ненормальная реакция на нестандартную ситуацию — это нормально",
    "Мясо горько от того, что оно мертво",
    "Психопаты не безумны. Они прекрасно знают, что делают и какие от этого будут последствия",
    "Мне не интересно понимать овец. Только есть их",
    "Знаете, кого вы напоминаете мне в этих дешевых туфлях и с дорогой сумкой? Обыкновенную деревенщину.",
  ];

  const fetchStory = async () => {
    setIsLoading(true);
    setStoryGenerated(true);

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const randomBook =
      inspirationalBooks[Math.floor(Math.random() * inspirationalBooks.length)];
    const randomInspiration =
      literaryInspirations[
        Math.floor(Math.random() * literaryInspirations.length)
      ];

    const result = await generateStory(
      randomQuote,
      randomBook,
      randomInspiration
    );

    if (result.success && result.storyParts.length > 0) {
      setStoryParts(result.storyParts);
      setCurrentIndex(0);
    } else {
      const fallbackParts = Array(10).fill(
        "Истории не будет, Герман принял ислам."
      );
      setStoryParts(fallbackParts);
      setCurrentIndex(0);
    }

    setIsLoading(false);
  };

  const handleNextClick = () => {
    if (isLoading || !storyGenerated) return;

    const newBloodLevel = bloodLevel + 1;
    setBloodLevel(newBloodLevel);
    if (newBloodLevel === 10) setIsFullBlood(true);

    const nextIndex = (currentIndex + 1) % storyParts.length;
    setCurrentIndex(nextIndex);

    if (nextIndex === 0 && clickCount > 0) {
      fetchStory();
    }

    setClickCount(clickCount + 1);
  };

  const handleBackClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-[#000000]">
      <header className="w-full max-w-4xl mb-8 pt-4">
        <div className="flex justify-between items-center">
          <h1 className="text-[#641414] text-3xl font-serif tracking-wider">
            ИСТОРИИ САШИ
          </h1>
          <Link
            href="/stories"
            className="text-[#9E9FAA] hover:text-[#641414] transition-colors duration-300 border-b border-[#641414] pb-1 font-serif"
          >
            ПОСМОТРЕТЬ ВСЕ ИСТОРИИ
          </Link>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#641414] to-transparent mt-2"></div>
      </header>

      <div className="w-full max-w-md flex-1 flex flex-col items-center justify-center">
        <TornLetter
          message={
            isLoading
              ? "ждем. ждем."
              : storyGenerated
              ? storyParts[currentIndex].toUpperCase()
              : "НАЖМИТЕ КНОПКУ, ЧТОБЫ СОЗДАТЬ ИСТОРИЮ"
          }
          bloodLevel={bloodLevel}
          isFullBlood={isFullBlood}
        />

        <div className="mt-6 flex flex-col items-center space-y-4">
          {!storyGenerated ? (
            <BloodyButton
              onClick={fetchStory}
              bloodLevel={5}
              disabled={isLoading}
            >
              {isLoading ? "ГЕНЕРАЦИЯ..." : "СОЗДАТЬ ИСТОРИЮ"}
            </BloodyButton>
          ) : (
            <div className="flex space-x-4">
              <BloodyButton
                onClick={handleBackClick}
                bloodLevel={bloodLevel}
                disabled={isLoading || currentIndex === 0}
              >
                НАЗАД
              </BloodyButton>
              <BloodyButton
                onClick={handleNextClick}
                bloodLevel={bloodLevel}
                isFullBlood={isFullBlood}
                disabled={isLoading}
              >
                {isLoading ? "READING..." : "ЧИТАТЬ ДАЛЬШЕ"}
              </BloodyButton>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
