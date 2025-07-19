"use client";

import React from 'react';
import { cn } from "@heroui/theme";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-purple-500/5 backdrop-blur-sm border border-purple-500/20 p-6 transition-all duration-300 hover:bg-purple-500/10 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20",
        className
      )}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 transition-colors group-hover:bg-purple-500/30 group-hover:text-purple-300">
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg text-white group-hover:text-purple-100 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-purple-300/70 group-hover:text-purple-300/90 transition-colors leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
