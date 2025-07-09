"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";

interface LoaderProps {
  className?: string;
  size?: number; // Size of the component in pixels
}

/**
 * A sci-fi inspired loader component with a glowing core and rotating orbits.
 */
export const Loader: React.FC<LoaderProps> = ({ className, size = 128 }) => {
  const coreSize = size / 6;

  const orbits = [
    {
      size: size * 0.75,
      rotation: "rotate-x-[65deg] rotate-y-[-25deg]",
      duration: "8s",
    },
    {
      size: size * 0.9,
      rotation: "rotate-x-[65deg] rotate-y-[25deg]",
      duration: "12s",
    },
    {
      size: size,
      rotation: "rotate-x-[-65deg] rotate-y-[-25deg]",
      duration: "10s",
    },
    {
      size: size * 0.6,
      rotation: "rotate-x-[-65deg] rotate-y-[25deg]",
      duration: "6s",
    },
  ];

  return (
    <div
      className={cn(
        "relative flex items-center justify-center [perspective:1000px]",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <div className="absolute [transform-style:preserve-3d]">
        {/* Orbits */}
        {orbits.map((orbit, i) => (
          <div
            key={i}
            className={cn(
              "absolute rounded-full border-2 border-primary/50 shadow-[0_0_10px_hsl(var(--primary)/0.5)] [transform-style:preserve-3d] animate-spin",
              orbit.rotation,
            )}
            style={{
              width: orbit.size,
              height: orbit.size,
              top: `calc(50% - ${orbit.size / 2}px)`,
              left: `calc(50% - ${orbit.size / 2}px)`,
              animationDuration: orbit.duration,
              animationDirection: i % 2 === 0 ? "normal" : "reverse",
            }}
          />
        ))}
        {/* Core */}
        <div
          className="absolute rounded-full bg-primary/70 animate-pulse-glow"
          style={{
            width: coreSize,
            height: coreSize,
            top: `calc(50% - ${coreSize / 2}px)`,
            left: `calc(50% - ${coreSize / 2}px)`,
          }}
        />
      </div>
    </div>
  );
};

export default Loader;
