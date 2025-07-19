'use client';
import React, { useState } from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/hero';
import { div } from 'framer-motion/client';
import { ContainerScroll } from '@/components/ui/container-scroll';
import Image from 'next/image';
import { AnimatedList } from '@/components/ui/animated-list';
import { Sparkles } from 'lucide-react';
import { FeatureGrid } from '@/components/ui/feature-grid';
import AudienceSection from '@/components/landing/audience-section';
import { NirvanaFaq } from '@/components/ui/faq-nirvana';
import CTASection from '@/components/landing/cta-section';
import FooterLayout from '@/components/landing/footer';
import { motion } from 'framer-motion';
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog';

export default function Home() {
  // Demo state for testing different navbar configurations
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user] = useState({
    name: 'Rahul Sharma',
    avatarUrl: '' // Leave empty to show initials
  });

  // Display cards configuration
  const defaultCards = [
    {
      icon: <Sparkles className="text-purple-300 size-4" />,
      title: "Digital Solutions",
      description: "Modern grievance platform",
      date: "Available now",
      iconClassName: "text-purple-500",
      titleClassName: "text-purple-500",
      className:
        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Sparkles className="text-purple-300 size-4" />,
      title: "Real-time Tracking",
      description: "Monitor complaint status",
      date: "Live updates",
      iconClassName: "text-purple-500",
      titleClassName: "text-purple-500",
      className:
        "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Sparkles className="text-purple-300 size-4" />,
      title: "AI-Powered",
      description: "Smart categorization & routing",
      date: "24/7 support",
      iconClassName: "text-purple-500",
      titleClassName: "text-purple-500",
      className:
        "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
    },
  ];

  // Key Features data
  const keyFeatures = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "24/7 Accessibility",
      description: "Submit and track complaints anytime, anywhere through our responsive platform accessible on all devices."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Real-time Analytics",
      description: "Government officials get comprehensive dashboards with real-time insights and performance metrics."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Secure & Compliant",
      description: "Bank-grade security with end-to-end encryption ensuring citizen data privacy and government compliance."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "AI-Powered Routing",
      description: "Smart categorization and automatic routing to the right department reduces response time significantly."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-7a1 1 0 011-1h4a1 1 0 011 1v7h6M4 19V9a2 2 0 012-2h12a2 2 0 012 2v10" />
        </svg>
      ),
      title: "Multi-Channel Support",
      description: "Citizens can submit complaints via web, mobile app, SMS, or even voice calls - all integrated seamlessly."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Transparency First",
      description: "Full visibility into complaint status, department actions, and resolution timeline for complete transparency."
    }
  ];

  const handleLogout = () => {
    setIsAuthenticated(false);
    console.log('User logged out');
  };

  const toggleAuthState = () => {
    setIsAuthenticated(!isAuthenticated);
  };
  return (
<>    

  <div 
      className="relative min-h-screen w-full overflow-hidden bg-[#0a0613] font-serif font-light text-white antialiased"
      style={{
        background: "linear-gradient(135deg, #0a0613 0%, #150d27 100%)",
      }}
    >      {/* Navbar Component */}
      <Navbar
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
        title="Nirvana"      /> 

      {/* Hero Section */}
      <Hero />

      {/* Animated List Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl text-white">Current Issues</h2>
            <p className="text-lg text-white">Problems citizens face with traditional systems</p>
          </div>              <div className="max-w-2xl mx-auto">            
            <div className="h-[300px] flex flex-col justify-center">
              <AnimatedList className="max-w-full" delay={3000}>
              <div className="flex items-center p-4 space-x-4 border rounded-lg bg-purple-500/5 backdrop-blur-sm border-purple-500/20">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/20">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-white ">Complaint lost in bureaucracy</p>
                  <p className="text-sm text-purple-300/70">Filed 3 months ago, no response</p>
                </div>
              </div>

              <div className="flex items-center p-4 space-x-4 border rounded-lg bg-purple-500/5 backdrop-blur-sm border-purple-500/20">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/20">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-white ">No tracking system</p>
                  <p className="text-sm text-purple-300/70">Citizens left in the dark</p>
                </div>
              </div>

              <div className="flex items-center p-4 space-x-4 border rounded-lg bg-purple-500/5 backdrop-blur-sm border-purple-500/20">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/20">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-white ">Poor communication</p>
                  <p className="text-sm text-purple-300/70">Multiple departments, no coordination</p>
                </div>
              </div>

              <div className="flex items-center p-4 space-x-4 border rounded-lg bg-purple-500/5 backdrop-blur-sm border-purple-500/20">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/20">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-white ">Manual paperwork delays</p>
                  <p className="text-sm text-purple-300/70">Weeks for simple approvals</p>
                </div>
              </div>

              <div className="flex items-center p-4 space-x-4 border rounded-lg bg-purple-500/5 backdrop-blur-sm border-purple-500/20">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/20">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-white ">Disconnected systems</p>
                  <p className="text-sm text-purple-300/70">No integration between departments</p>
                </div>
              </div>

              <div className="flex items-center p-4 space-x-4 border rounded-lg bg-purple-500/5 backdrop-blur-sm border-purple-500/20">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/20">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-white ">Citizens feel unheard</p>
                  <p className="text-sm text-purple-300/70">Lack of transparency in process</p>
                </div>              </div>            </AnimatedList>
            </div>
          </div>
        </div>      </section>      {/* Key Features Section */}
      <section className="px-4 py-16 mt-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl text-white">Key Features</h2>
            <p className="max-w-2xl mx-auto text-lg text-white">
              Comprehensive features designed to transform how citizens interact with government services
            </p>
          </div>
          
          <FeatureGrid features={keyFeatures} columns={3} />
        </div>
      </section>      {/* Audience Section */}
      <AudienceSection />

      {/* Video Demo Section */}
        <motion.div
          className="relative mt-16 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
        >
          <div className="mb-8 text-center">
            <h3 className="mb-4 font-serif text-2xl text-white md:text-3xl">
              See Nirvana in Action
            </h3>
            <p className="max-w-2xl mx-auto text-lg text-white/80">
              Watch how our platform transforms citizen-government interactions with real-time tracking, 
              AI-powered routing, and transparent communication.
            </p>
          </div>
          
          <HeroVideoDialog
            animationStyle="from-center"
            videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
            thumbnailSrc="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop&crop=entropy"
            thumbnailAlt="Watch Nirvana Platform Demo - Smart Governance in Action"
            className="max-w-4xl mx-auto overflow-hidden border shadow-2xl rounded-2xl border-purple-500/20 shadow-purple-500/10"
          />
        </motion.div>      {/* FAQ Section */}
      <NirvanaFaq />

      {/* Call to Action Section */}
      <CTASection />

      {/* Footer */}
      <FooterLayout />
    </div>
    </>
  );
}
