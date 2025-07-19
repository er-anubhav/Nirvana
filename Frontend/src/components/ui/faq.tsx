"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail } from "lucide-react";
import { cn } from "@heroui/theme";
import { Button } from "@/components/ui/button";

interface FaqSectionProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
  items: {
    question: string;
    answer: string;
  }[];
  contactInfo?: {
    title: string;
    description: string;
    buttonText: string;
    onContact?: () => void;
  };
}

const FaqSection = React.forwardRef<HTMLElement, FaqSectionProps>(
  ({ className, title, description, items, contactInfo, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          "py-16 w-full",
          className
        )}
        {...props}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto mb-12 text-center"
          >
            <h2 className="mb-4 font-serif text-3xl text-white sm:text-4xl">
              {title}
            </h2>
            {description && (
              <p className="text-lg text-purple-300/80">{description}</p>
            )}
          </motion.div>

          {/* FAQ Items */}
          <div className="max-w-3xl mx-auto space-y-4">
            {items.map((item, index) => (
              <FaqItem
                key={index}
                question={item.question}
                answer={item.answer}
                index={index}
              />
            ))}
          </div>

          {/* Contact Section */}
          {contactInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-md p-8 mx-auto mt-16 text-center border rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm border-purple-500/20"
            >
              <div className="inline-flex items-center justify-center p-3 mb-4 text-purple-400 rounded-full bg-purple-500/20">
                <Mail className="w-5 h-5" />
              </div>
              <p className="mb-2 text-lg text-white">
                {contactInfo.title}
              </p>
              <p className="mb-6 text-sm text-purple-300/80">
                {contactInfo.description}
              </p>
              <Button 
                size="sm" 
                onClick={contactInfo.onContact}
                className="text-white bg-purple-600 hover:bg-purple-700"
              >
                {contactInfo.buttonText}
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    );
  }
);
FaqSection.displayName = "FaqSection";

// Internal FaqItem component
const FaqItem = React.forwardRef<
  HTMLDivElement,
  {
    question: string;
    answer: string;
    index: number;
  }
>((props, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { question, answer, index } = props;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.1 }}
      className={cn(
        "group rounded-xl overflow-hidden",
        "transition-all duration-300 ease-in-out",
        "bg-gradient-to-br from-purple-500/5 to-purple-600/5 backdrop-blur-sm border border-purple-500/20",
        isOpen
          ? "bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-400/30"
          : "hover:bg-purple-500/10 hover:border-purple-400/40"
      )}
    >
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="justify-between w-full h-auto px-6 py-6 hover:bg-transparent rounded-xl"
      >
        <h3
          className={cn(
            "text-base  transition-colors duration-200 text-left font-serif",
            "text-white/90",
            isOpen && "text-white"
          )}
        >
          {question}
        </h3>
        <motion.div
          animate={{
            rotate: isOpen ? 180 : 0,
            scale: isOpen ? 1.1 : 1,
          }}
          transition={{ duration: 0.2 }}
          className={cn(
            "p-1 rounded-full flex-shrink-0",
            "transition-colors duration-200",
            isOpen ? "text-purple-400" : "text-purple-300/70"
          )}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </Button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: { duration: 0.2, ease: "easeIn" },
            }}
          >
            <div className="px-6 pt-2 pb-6">
              <motion.p
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                className="text-sm leading-relaxed text-purple-300/80"
              >
                {answer}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
FaqItem.displayName = "FaqItem";

export { FaqSection };
