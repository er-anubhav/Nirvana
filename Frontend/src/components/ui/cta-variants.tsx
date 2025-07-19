'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap } from 'lucide-react';

interface CompactCTAProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  className?: string;
}

export function CompactCTA({
  title = "Ready to Get Started?",
  description = "Transform your city's governance with Nirvana's smart platform",
  primaryButtonText = "Book Demo",
  secondaryButtonText = "Learn More",
  onPrimaryClick,
  onSecondaryClick,
  className
}: CompactCTAProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-gradient-to-r from-purple-500/10 to-purple-600/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 text-center ${className}`}
    >
      <Zap className="w-8 h-8 text-purple-400 mx-auto mb-4" />
      <h3 className="text-2xl font-serif text-white mb-3">{title}</h3>
      <p className="text-purple-300/80 mb-6 max-w-md mx-auto">{description}</p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onPrimaryClick}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {primaryButtonText}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button
          onClick={onSecondaryClick}
          variant="outline"
          className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
        >
          {secondaryButtonText}
        </Button>
      </div>
    </motion.div>
  );
}

// Hero CTA variant for top of pages
export function HeroCTA() {
  return (
    <div className="text-center space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl lg:text-7xl font-serif text-white mb-6"
      >
        Transform Your
        <span className="block text-purple-300">Governance Today</span>
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl text-white/80 max-w-2xl mx-auto mb-8"
      >
        Streamline citizen services, boost transparency, and build trust 
        with AI-powered complaint management
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8">
          Book a Demo
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        <Button size="lg" variant="outline" className="border-purple-500/30 text-purple-300">
          Request Access
        </Button>
      </motion.div>
    </div>
  );
}

// Inline CTA for within content
export function InlineCTA({ 
  text = "Ready to see Nirvana in action?",
  buttonText = "Book Demo"
}: {
  text?: string;
  buttonText?: string;
}) {
  return (
    <div className="inline-flex items-center gap-4 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
      <span className="text-white ">{text}</span>
      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
        {buttonText}
        <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}
