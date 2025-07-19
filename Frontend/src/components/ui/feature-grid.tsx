"use client";

import React from 'react';
import { FeatureCard } from './feature-card';
import { cn } from "@heroui/theme";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeatureGridProps {
  features: Feature[];
  className?: string;
  columns?: 2 | 3 | 4;
}

export function FeatureGrid({ features, className, columns = 3 }: FeatureGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div
      className={cn(
        "grid gap-6",
        gridCols[columns],
        className
      )}
    >
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  );
}
