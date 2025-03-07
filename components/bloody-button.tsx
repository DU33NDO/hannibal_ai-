"use client";

import type React from "react";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface BloodyButtonProps {
  onClick: () => void;
  bloodLevel: number;
  isFullBlood?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function BloodyButton({
  onClick,
  bloodLevel,
  isFullBlood = false,
  disabled = false,
  children,
  className = "",
}: BloodyButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!buttonRef.current) return;

    const updateDimensions = () => {
      if (!buttonRef.current) return;
      const { width, height } = buttonRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    if (bloodLevel === 0) return;

    if (isFullBlood) {
      ctx.fillStyle = "rgba(109, 16, 16, 0.9)";
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      for (let i = 0; i < 10; i++) {
        const x = Math.random() * dimensions.width;
        const y = Math.random() * dimensions.height;
        const size = 3 + Math.random() * 8;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(80, 10, 10, 0.7)";
        ctx.fill();
      }

      for (let i = 0; i < 5; i++) {
        const x = Math.random() * dimensions.width;
        const y = dimensions.height;
        const length = 10 + Math.random() * 20;
        const width = 2 + Math.random() * 4;

        ctx.beginPath();
        ctx.moveTo(x - width / 2, y);
        ctx.lineTo(x + width / 2, y);
        ctx.lineTo(x + width / 4, y + length);
        ctx.lineTo(x - width / 4, y + length);
        ctx.closePath();

        ctx.fillStyle = "rgba(109, 16, 16, 0.8)";
        ctx.fill();
      }
    } else {
      const stainCount = bloodLevel * 2;

      for (let i = 0; i < stainCount; i++) {
        const x = Math.random() * dimensions.width;
        const y = Math.random() * dimensions.height;
        const size = 5 + Math.random() * 10;
        const opacity = 0.3 + Math.random() * 0.4;

        ctx.save();
        ctx.beginPath();

        const points = Math.floor(Math.random() * 5) + 5;
        for (let j = 0; j < points; j++) {
          const angle = (Math.PI * 2 * j) / points;
          const randomRadius = size * (0.5 + Math.random() * 0.5);
          const pointX = x + Math.cos(angle) * randomRadius;
          const pointY = y + Math.sin(angle) * randomRadius;

          if (j === 0) {
            ctx.moveTo(pointX, pointY);
          } else {
            ctx.lineTo(pointX, pointY);
          }
        }

        ctx.closePath();
        ctx.fillStyle = `rgba(109, 16, 16, ${opacity})`;
        ctx.fill();
        ctx.restore();

        if (Math.random() > 0.5) {
          const droplets = Math.floor(Math.random() * 3) + 1;
          for (let j = 0; j < droplets; j++) {
            const dropX = Math.random() * dimensions.width;
            const dropY = Math.random() * dimensions.height;
            const dropSize = 1 + Math.random() * 3;

            ctx.beginPath();
            ctx.arc(dropX, dropY, dropSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(109, 16, 16, ${0.4 + Math.random() * 0.4})`;
            ctx.fill();
          }
        }
      }
    }
  }, [bloodLevel, dimensions, isFullBlood]);

  return (
    <div className="relative inline-block">
      <Button
        ref={buttonRef}
        onClick={onClick}
        disabled={disabled}
        className={`relative z-10 bg-[#DDBF8A] text-[#000000] hover:bg-[#DDBF8A]/90 ${className} ${
          isFullBlood ? "text-white" : ""
        } ${disabled ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        <span className="relative z-10">{children}</span>
      </Button>

      {dimensions.width > 0 && (
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="absolute inset-0 pointer-events-none z-20"
        />
      )}
    </div>
  );
}
