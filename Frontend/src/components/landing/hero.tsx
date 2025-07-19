"use client";
 
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ContainerScroll } from "../ui/container-scroll";
import { HeroVideoDialog } from "../ui/hero-video-dialog";
 
export default function Hero() {
  return (    <section
      className="relative w-full pt-32 pb-10 overflow-hidden antialiased font-light text-white md:pb-16 md:pt-20"
    >
 
      <div className="container relative z-10 max-w-2xl px-4 mx-auto font-serif text-center md:max-w-4xl md:px-6 lg:max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >          <span className="mb-8 inline-block rounded-full border border-[#9b87f5]/30 bg-[#9b87f5]/10 px-4 py-2 text-md  text-[#9b87f5] backdrop-blur-sm">
           Nirvana - Smart Governance, Simplified
          </span>
          <h1 className="max-w-6xl mx-auto mb-8 text-3xl font-light leading-tight md:text-6xl lg:text-5xl">
            Faster, Transparent 
            <span className="block text-white/90">Communication</span>
            <span className="block text-3xl text-white/80">&</span>
            <span className="block text-5xl text-white/90">Trusted by Citizens</span>
          </h1>
          <p className="max-w-4xl mx-auto mb-12 text-lg leading-relaxed text-white/80 md:text-xl lg:text-2xl">
            Nirvana streamlines how citizens raise issues and track updates — making complaint management 
            <span className="text-white"> seamless, accountable, and accessible</span> across departments. 
            <span className="block mt-2 text-xl text-[#9b87f5]/90">Perfect for modern cities and forward-thinking institutions.</span>
          </p>          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8">
            <Link
              href="/dashboard"
              className="group relative w-full overflow-hidden rounded-full border border-[#9b87f5]/30 bg-gradient-to-r from-[#9b87f5] to-[#7c3aed] px-10 py-4 text-lg  text-white shadow-2xl shadow-[#9b87f5]/25 transition-all duration-300 hover:scale-105 hover:border-[#9b87f5]/50 hover:shadow-[0_0_30px_rgba(155,135,245,0.6)] sm:w-auto"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 transition-opacity duration-300 rounded-full opacity-0 bg-gradient-to-r from-white/20 to-transparent group-hover:opacity-100" />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center justify-center w-full gap-3 px-8 py-4 text-lg transition-all duration-300 border rounded-full group border-white/20 text-white/90 backdrop-blur-sm hover:border-white/40 hover:bg-white/5 hover:text-white sm:w-auto"
            >
              <span>Learn how it works</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-y-1"
              >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </a>
          </div>        </motion.div>

        
                <motion.div
          className="relative mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          <div className="relative flex w-full h-40 overflow-hidden md:h-64">
            <img
              src="https://blocks.mvp-subha.me/assets/earth.png"
              alt="Earth"
              className="absolute top-0 px-4 mx-auto -translate-x-1/2 left-1/2 -z-10 opacity-80"
            />
          </div>
          <ContainerScroll titleComponent={undefined}>
        <Image
          src={`/dashboard.png`}
          alt="hero"
          height={720}
          width={1400}
          className="object-cover object-left-top h-full mx-auto rounded-2xl"
          draggable={false}
        />
      </ContainerScroll>
        </motion.div>
      </div>
    </section>
  );
}
