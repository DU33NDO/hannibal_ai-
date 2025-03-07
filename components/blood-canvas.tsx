"use client";

import { useEffect, useRef } from "react";

interface BloodCanvasProps {
  bloodLevel: number;
  width: number;
  height: number;
  isFullBlood?: boolean;
  className?: string;
}

export function BloodCanvas({
  bloodLevel,
  width,
  height,
  isFullBlood = false,
  className = "",
}: BloodCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    if (bloodLevel === 0) return;

    if (isFullBlood) {
      drawFullBloodCoverage(ctx, width, height);
    } else {
      const splatterCount = bloodLevel * 3;
      for (let i = 0; i < splatterCount; i++) {
        drawBloodSplatter(ctx, width, height, bloodLevel / 10);
      }

      if (bloodLevel > 1) {
        const dripCount = bloodLevel;
        for (let i = 0; i < dripCount; i++) {
          drawBloodDrip(ctx, width, height, bloodLevel / 10);
        }
      }

      if (bloodLevel > 2) {
        const fingerprintCount = Math.min(bloodLevel - 2, 8);
        for (let i = 0; i < fingerprintCount; i++) {
          drawBloodFingerprint(ctx, width, height, bloodLevel / 10);
        }
      }

      if (bloodLevel > 5) {
        const poolCount = bloodLevel - 5;
        for (let i = 0; i < poolCount; i++) {
          drawBloodPool(ctx, width, height, bloodLevel / 10);
        }
      }
    }
  }, [bloodLevel, width, height, isFullBlood]);

  const drawFullBloodCoverage = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    ctx.fillStyle = "rgba(109, 16, 16, 0.8)";
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = 20 + Math.random() * 80;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(80, 10, 10, 0.4)";
      ctx.fill();
    }

    for (let i = 0; i < 20; i++) {
      drawBloodDrip(ctx, width, height, 1.5);
    }

    for (let i = 0; i < 30; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = 5 + Math.random() * 15;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(140, 20, 20, 0.6)";
      ctx.fill();
    }

    for (let i = 0; i < 8; i++) {
      drawBloodFingerprint(ctx, width, height, 1.5);
      drawBloodSmear(ctx, width, height);
    }
  };

  const drawBloodSmear = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const length = 30 + Math.random() * 100;
    const angle = Math.random() * Math.PI * 2;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    const gradient = ctx.createLinearGradient(0, 0, length, 0);
    gradient.addColorStop(0, "rgba(109, 16, 16, 0.8)");
    gradient.addColorStop(1, "rgba(109, 16, 16, 0.1)");

    ctx.beginPath();
    ctx.moveTo(0, 0);

    const segments = Math.floor(length / 10);
    const smearWidth = 5 + Math.random() * 10;

    for (let i = 1; i <= segments; i++) {
      const segmentX = (length * i) / segments;
      const waveY = Math.sin(i * 0.5) * smearWidth * (1 - (i / segments) * 0.5);

      ctx.lineTo(segmentX, waveY);
    }

    for (let i = segments; i >= 0; i--) {
      const segmentX = (length * i) / segments;
      const waveY =
        -Math.sin(i * 0.5) * smearWidth * (1 - (i / segments) * 0.5);

      ctx.lineTo(segmentX, waveY);
    }

    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.restore();
  };

  const drawBloodPool = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    intensity: number
  ) => {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = (20 + Math.random() * 40) * intensity;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, "rgba(109, 16, 16, 0.9)");
    gradient.addColorStop(0.7, "rgba(80, 10, 10, 0.7)");
    gradient.addColorStop(1, "rgba(80, 10, 10, 0)");

    ctx.save();
    ctx.beginPath();

    const points = Math.floor(Math.random() * 8) + 8;
    for (let i = 0; i < points; i++) {
      const angle = (Math.PI * 2 * i) / points;
      const randomRadius = size * (0.7 + Math.random() * 0.3);
      const pointX = x + Math.cos(angle) * randomRadius;
      const pointY = y + Math.sin(angle) * randomRadius;

      if (i === 0) {
        ctx.moveTo(pointX, pointY);
      } else {
        const cp1x =
          x + Math.cos(angle - Math.PI / points) * randomRadius * 1.2;
        const cp1y =
          y + Math.sin(angle - Math.PI / points) * randomRadius * 1.2;
        const cp2x = x + Math.cos(angle) * randomRadius * 1.2;
        const cp2y = y + Math.sin(angle) * randomRadius * 1.2;
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, pointX, pointY);
      }
    }

    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    for (let i = 0; i < 5; i++) {
      const innerX = x + (Math.random() - 0.5) * size * 0.5;
      const innerY = y + (Math.random() - 0.5) * size * 0.5;
      const innerSize = size * 0.2 * Math.random();

      ctx.beginPath();
      ctx.arc(innerX, innerY, innerSize, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(140, 20, 20, 0.4)";
      ctx.fill();
    }

    ctx.restore();
  };

  const drawBloodSplatter = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    intensity: number
  ) => {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = (Math.random() * 20 + 5) * intensity;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, "rgba(109, 16, 16, 0.9)");
    gradient.addColorStop(0.7, "rgba(109, 16, 16, 0.7)");
    gradient.addColorStop(1, "rgba(109, 16, 16, 0)");

    ctx.save();
    ctx.beginPath();

    const points = Math.floor(Math.random() * 5) + 5;
    for (let i = 0; i < points; i++) {
      const angle = (Math.PI * 2 * i) / points;
      const randomRadius = radius * (0.5 + Math.random() * 0.5);
      const pointX = x + Math.cos(angle) * randomRadius;
      const pointY = y + Math.sin(angle) * randomRadius;

      if (i === 0) {
        ctx.moveTo(pointX, pointY);
      } else {
        const controlX =
          x + Math.cos(angle - Math.PI / points) * randomRadius * 1.5;
        const controlY =
          y + Math.sin(angle - Math.PI / points) * randomRadius * 1.5;
        ctx.quadraticCurveTo(controlX, controlY, pointX, pointY);
      }
    }

    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    const droplets = Math.floor(Math.random() * 5) + 3;
    for (let i = 0; i < droplets; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = radius * (1 + Math.random());
      const dropX = x + Math.cos(angle) * distance;
      const dropY = y + Math.sin(angle) * distance;
      const dropRadius = radius * 0.2 * Math.random();

      ctx.beginPath();
      ctx.arc(dropX, dropY, dropRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(109, 16, 16, ${0.3 + Math.random() * 0.4})`;
      ctx.fill();
    }

    ctx.restore();
  };

  const drawBloodDrip = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    intensity: number
  ) => {
    const x = Math.random() * width;
    const startY = Math.random() * (height * 0.3); // Start in top third
    const length = (20 + Math.random() * 80) * intensity;
    const width1 = (3 + Math.random() * 8) * intensity;

    const gradient = ctx.createLinearGradient(x, startY, x, startY + length);
    gradient.addColorStop(0, "rgba(109, 16, 16, 0.9)");
    gradient.addColorStop(1, "rgba(109, 16, 16, 0.1)");

    ctx.save();
    ctx.beginPath();

    ctx.moveTo(x - width1 / 2, startY);
    ctx.lineTo(x + width1 / 2, startY);

    const segments = Math.floor(length / 10);
    for (let i = 1; i <= segments; i++) {
      const segmentY = startY + (length * i) / segments;
      const waveX = x + Math.sin(i * 0.5) * (width1 * 0.5) * (1 - i / segments);
      const segmentWidth = width1 * (1 - (i / segments) * 0.7);

      ctx.lineTo(waveX + segmentWidth / 2, segmentY);
    }

    ctx.lineTo(x - (width1 / 2) * 0.3, startY + length);
    ctx.closePath();

    ctx.fillStyle = gradient;
    ctx.fill();

    if (Math.random() > 0.5) {
      const dropY = startY + length;
      const dropRadius = width1 * 0.8;

      ctx.beginPath();
      ctx.arc(x, dropY, dropRadius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(109, 16, 16, 0.8)";
      ctx.fill();
    }

    ctx.restore();
  };

  const drawBloodFingerprint = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    intensity: number
  ) => {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = (15 + Math.random() * 20) * intensity;
    const rotation = Math.random() * Math.PI * 2;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    ctx.beginPath();

    ctx.ellipse(0, 0, size, size * 1.5, 0, 0, Math.PI * 2);

    ctx.fillStyle = `rgba(109, 16, 16, ${0.4 + Math.random() * 0.3})`;
    ctx.fill();

    const lines = 5 + Math.floor(Math.random() * 5);
    ctx.strokeStyle = `rgba(80, 10, 10, 0.5)`;
    ctx.lineWidth = 1;

    for (let i = 0; i < lines; i++) {
      const lineY = -size + (size * 2 * i) / lines;
      const amplitude = size * 0.3;

      ctx.beginPath();
      ctx.moveTo(-size * 0.8, lineY);

      for (let x = -size * 0.8; x <= size * 0.8; x += 5) {
        const wave = Math.sin((x / size) * Math.PI) * amplitude;
        ctx.lineTo(x, lineY + wave + (Math.random() * 2 - 1));
      }

      ctx.stroke();
    }

    for (let i = 0; i < 10; i++) {
      const smudgeX = (Math.random() - 0.5) * size * 2;
      const smudgeY = (Math.random() - 0.5) * size * 2;
      const smudgeSize = 2 + Math.random() * 4;

      ctx.beginPath();
      ctx.arc(smudgeX, smudgeY, smudgeSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(109, 16, 16, ${0.1 + Math.random() * 0.2})`;
      ctx.fill();
    }

    ctx.restore();
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`absolute inset-0 pointer-events-none z-20 ${className}`}
    />
  );
}
