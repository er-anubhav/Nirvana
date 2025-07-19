'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Shield } from 'lucide-react';

interface CTASectionProps {
  className?: string;
}

export default function CTASection({ className }: CTASectionProps) {
  const handleBookDemo = () => {
    // In a real implementation, this could open a calendar booking widget
    console.log('Book Demo clicked');
    window.open('https://calendly.com/nirvana-demo', '_blank');
  };

  const handleRequestAccess = () => {
    // In a real implementation, this could open a contact form or navigate to signup
    console.log('Request Access clicked');
    window.open('mailto:access@nirvana-platform.com?subject=Request%20Early%20Access', '_blank');
  };

  return (
    <section className={`pb-16 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 rounded-3xl blur-3xl" />
          
          {/* Main content container */}
          <div className="relative rounded-3xl p-12 lg:p-16 text-center overflow-hidden">
            
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full text-purple-300 text-sm font-small mb-8"
              >
                <Shield className="w-4 h-4" />
                Trusted by 50+ Government Organizations
              </motion.div>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl lg:text-4xl font-serif text-white mb-6 leading-tight"
              >
                Ready to Transform
                <span className="block text-purple-300">Your City's Governance?</span>
              </motion.h2>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed"
              >
                Join forward-thinking cities already using Nirvana to streamline citizen services, 
                reduce response times, and build stronger community trust through transparency.
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <Button
                  onClick={handleBookDemo}
                  className="group bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 text-lg rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book a Demo
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button
                  onClick={handleRequestAccess}
                  variant="outline"
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400/40 px-8 py-4 text-lg rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  Request Early Access
                </Button>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-12 flex flex-col sm:flex-row gap-8 justify-center items-center text-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  No setup fees
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  30-day pilot program
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  Dedicated support
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
