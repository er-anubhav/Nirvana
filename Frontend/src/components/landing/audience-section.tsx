'use client';
import React from 'react';
import { CircularTestimonials } from '@/components/ui/circular-testimonials';

// Testimonial data for different user types
const testimonials = [
  {
    quote: "As a citizen, I was frustrated with the endless paperwork and lack of transparency. Nirvana changed everything - I can file complaints online, track progress in real-time, and actually get responses. It's like having a direct line to the government.",
    name: "Rajesh Kumar",
    designation: "Citizen & Small Business Owner",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  },
  {
    quote: "Our department handles thousands of complaints monthly. Nirvana's smart categorization and automated workflows have reduced our response time by 60%. We can now focus on solving problems instead of managing paperwork.",
    name: "Dr. Anita Verma",
    designation: "Director, Public Health Department",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
  },
  {
    quote: "The analytics dashboard gives us unprecedented insights into citizen concerns. We can identify recurring issues, allocate resources better, and make data-driven policy decisions. Nirvana is essential for modern governance.",
    name: "Vikram Singh",
    designation: "Secretary, Urban Development",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  },
];

// Who benefits from Nirvana
const audienceData = [
  {
    title: "Citizens",
    description: "Easy complaint filing, real-time tracking, transparent communication",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: "Government Officials",
    description: "Streamlined workflows, better resource allocation, data-driven insights",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: "Department Heads",
    description: "Automated routing, performance analytics, improved accountability",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export default function AudienceSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif text-white mb-4">
            Who It's For
          </h2>
          <p className="text-lg text-purple-300/80 max-w-3xl mx-auto">
            Nirvana serves every stakeholder in the government ecosystem, from citizens seeking services 
            to officials managing complex workflows
          </p>
        </div>

        {/* Audience Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {audienceData.map((audience, index) => (
            <div
              key={index}
              className="group relative p-8 bg-gradient-to-br from-purple-500/10 to-purple-600/5 
                         backdrop-blur-sm border border-purple-500/20 rounded-2xl 
                         hover:border-purple-400/40 transition-all duration-300
                         hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="text-purple-400 mb-6 group-hover:text-purple-300 transition-colors">
                {audience.icon}
              </div>
              <h3 className="text-xl text-white mb-4 font-serif">
                {audience.title}
              </h3>
              <p className="text-purple-300/80 leading-relaxed">
                {audience.description}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonials Section */}

          <div className="text-center pt-16 mb-12">
            <h3 className="text-2xl sm:text-3xl font-serif text-white mb-4">
              What People Are Saying
            </h3>
            <p className="text-purple-300/80 max-w-2xl mx-auto">
              Real feedback from government officials and citizens who have experienced 
              the transformation that Nirvana brings
            </p>
          </div>

          <div className="flex justify-center">
            <CircularTestimonials
              testimonials={testimonials}
              autoplay={true}
              colors={{
                name: "#ffffff",
                designation: "#c4b5fd",
                testimony: "#fffff",
                arrowBackground: "#7c3aed",
                arrowForeground: "#ffffff",
                arrowHoverBackground: "#8b5cf6",
              }}
              fontSizes={{
                name: "1.25rem",
                designation: "0.875rem",
                quote: "1rem",
              }}
            />
          </div>
        </div>
    </section>
  );
}
