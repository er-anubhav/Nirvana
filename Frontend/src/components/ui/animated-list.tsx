"use client";

import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface AnimatedListProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}

export const AnimatedList = React.memo(
  ({ className, children, delay = 1000 }: AnimatedListProps) => {
    const [index, setIndex] = useState(0);
    const childrenArray = React.Children.toArray(children);

    useEffect(() => {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length);
      }, delay);

      return () => clearInterval(interval);
    }, [childrenArray.length, delay]);    const itemsToShow = useMemo(() => {
      const maxItems = 3;
      const totalItems = childrenArray.length;
      
      if (totalItems === 0) return [];
      
      // Calculate which items to show based on current index
      const items = [];
      for (let i = 0; i < Math.min(maxItems, totalItems); i++) {
        const itemIndex = (index + i) % totalItems;
        items.push({
          element: childrenArray[itemIndex],
          key: itemIndex // Use stable key based on actual item index
        });
      }
      
      return items;
    }, [index, childrenArray]);    return (
      <div className={`flex flex-col items-center gap-4 h-[240px] ${className}`}>
        <AnimatePresence mode="popLayout">
          {itemsToShow.map((item) => (
            <AnimatedListItem key={item.key}>
              {item.element}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    );
  }
);

AnimatedList.displayName = "AnimatedList";

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const animations = {
    initial: { 
      scale: 0, 
      opacity: 0,
      y: 50 // Enter from bottom
    },
    animate: { 
      scale: 1, 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring" as const, 
        stiffness: 350, 
        damping: 40 
      }
    },
    exit: { 
      scale: 0, 
      opacity: 0,
      y: -50, // Exit to top
      transition: { 
        duration: 0.3 
      }
    },
  };

  return (
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  );
}
