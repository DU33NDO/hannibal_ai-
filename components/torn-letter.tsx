"use client";

import { useRef, useEffect, useState } from "react";
import { BloodCanvas } from "./blood-canvas";

interface TornLetterProps {
  message: string;
  bloodLevel: number;
  isFullBlood?: boolean;
}

export function TornLetter({
  message,
  bloodLevel,
  isFullBlood = false,
}: TornLetterProps) {
  const letterRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!letterRef.current) return;

    const updateDimensions = () => {
      if (!letterRef.current) return;
      const { width, height } = letterRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  return (
    <div className="relative w-full" ref={letterRef}>
      <div className="relative bg-[#DDBF8A] p-8 shadow-lg z-10">
        <div
          className="absolute top-0 left-0 right-0 h-4 bg-[#DDBF8A]"
          style={{
            clipPath:
              "polygon(0% 0%, 5% 100%, 10% 30%, 15% 100%, 20% 50%, 25% 100%, 30% 40%, 35% 100%, 40% 30%, 45% 100%, 50% 20%, 55% 100%, 60% 40%, 65% 100%, 70% 30%, 75% 100%, 80% 50%, 85% 100%, 90% 30%, 95% 100%, 100% 0%)",
          }}
        ></div>
        <div
          className="absolute bottom-0 left-0 right-0 h-4 bg-[#DDBF8A]"
          style={{
            clipPath:
              "polygon(0% 100%, 5% 0%, 10% 70%, 15% 0%, 20% 50%, 25% 0%, 30% 60%, 35% 0%, 40% 70%, 45% 0%, 50% 80%, 55% 0%, 60% 60%, 65% 0%, 70% 70%, 75% 0%, 80% 50%, 85% 0%, 90% 70%, 95% 0%, 100% 100%)",
          }}
        ></div>
        <div
          className="absolute top-0 bottom-0 left-0 w-4 bg-[#DDBF8A]"
          style={{
            clipPath:
              "polygon(0% 0%, 100% 5%, 0% 10%, 100% 15%, 0% 20%, 100% 25%, 0% 30%, 100% 35%, 0% 40%, 100% 45%, 0% 50%, 100% 55%, 0% 60%, 100% 65%, 0% 70%, 100% 75%, 0% 80%, 100% 85%, 0% 90%, 100% 95%, 0% 100%)",
          }}
        ></div>
        <div
          className="absolute top-0 bottom-0 right-0 w-4 bg-[#DDBF8A]"
          style={{
            clipPath:
              "polygon(100% 0%, 0% 5%, 100% 10%, 0% 15%, 100% 20%, 0% 25%, 100% 30%, 0% 35%, 100% 40%, 0% 45%, 100% 50%, 0% 55%, 100% 60%, 0% 65%, 100% 70%, 0% 75%, 100% 80%, 0% 85%, 100% 90%, 0% 95%, 100% 100%)",
          }}
        ></div>

        <div className="min-h-[300px] flex flex-col justify-between">
          <p
            className={`text-[#534D56] font-bold tracking-wider text-center uppercase text-lg md:text-xl mb-8 ${
              isFullBlood ? "relative z-30 text-white" : ""
            }`}
          >
            {message}
          </p>

          <div
            className={`mt-auto pt-4 border-t border-[#534D56]/30 text-center text-[#534D56]/70 text-sm uppercase ${
              isFullBlood ? "relative z-30 text-white/70 border-white/30" : ""
            }`}
          >
            THEY WILL FIND YOU
          </div>
        </div>

        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23534D56' fillOpacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {dimensions.width > 0 && dimensions.height > 0 && (
        <BloodCanvas
          bloodLevel={bloodLevel}
          width={dimensions.width}
          height={dimensions.height}
          isFullBlood={isFullBlood}
        />
      )}

      <div className="absolute inset-0 bg-[#000000] transform translate-x-1 translate-y-1 -z-10"></div>
    </div>
  );
}
