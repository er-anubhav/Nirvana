'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Twitter, 
  Linkedin, 
  Facebook,
  ArrowRight,
  Shield,
  Zap,
  Users
} from 'lucide-react';

interface FooterLinkGroupProps {
  title: string;
  links: {
    label: string;
    href: string;
    external?: boolean;
  }[];
}

function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  return (
    <div>
      <h3 className="text-white text-lg mb-4 font-serif">{title}</h3>
      <ul className="space-y-3">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              target={link.external ? '_blank' : '_self'}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="text-white hover:text-purple-300 transition-colors duration-200 text-sm group flex items-center"
            >
              {link.label}
              {link.external && (
                <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface SocialIconsProps {
  className?: string;
}

function SocialIcons({ className }: SocialIconsProps) {
  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/nirvana-platform', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/nirvana-platform', label: 'LinkedIn' },
    { icon: Facebook, href: 'https://facebook.com/nirvana-platform', label: 'Facebook' },
    { icon: Github, href: 'https://github.com/nirvana-platform', label: 'GitHub' },
  ];

  return (
    <div className={`flex space-x-4 ${className}`}>
      {socialLinks.map((social, index) => {
        const Icon = social.icon;
        return (
          <a
            key={index}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="w-10 h-10 rounded-full flex items-center justify-cente hover:text-white transition-all duration-200 hover:scale-110"
          >
            <Icon className="w-5 h-5" />
          </a>
        );
      })}
    </div>
  );
}

interface ContactInfoProps {
  className?: string;
}

function ContactInfo({ className }: ContactInfoProps) {
  const contactDetails = [
    {
      icon: Mail,
      label: 'Email',
      value: 'contact@nirvana-platform.com',
      href: 'mailto:contact@nirvana-platform.com'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567'
    },
    {
      icon: MapPin,
      label: 'Address',
      value: 'San Francisco, CA',
      href: 'https://maps.google.com/?q=San+Francisco,+CA'
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-white text-lg mb-4 font-serif">Contact Us</h3>
      {contactDetails.map((contact, index) => {
        const Icon = contact.icon;
        return (
          <a
            key={index}
            href={contact.href}
            target={contact.href.startsWith('http') ? '_blank' : '_self'}
            rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="flex items-center space-x-3 text-white transition-colors duration-200 group"
          >
            <Icon className="w-6 h-4 text-white" />
            <div>
              <span className="text-xs text-white block">{contact.label}</span>
              <span className="text-sm">{contact.value}</span>
            </div>
          </a>
        );
      })}
    </div>
  );
}

interface FooterLayoutProps {
  className?: string;
}

export default function FooterLayout({ className }: FooterLayoutProps) {
  const productLinks = [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Security', href: '/security' },
    { label: 'Integrations', href: '/integrations' },
    { label: 'API Documentation', href: '/docs', external: true },
  ];

  const companyLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press Kit', href: '/press' },
    { label: 'Blog', href: '/blog' },
    { label: 'Case Studies', href: '/case-studies' },
  ];

  const supportLinks = [
    { label: 'Help Center', href: '/help' },
    { label: 'Community', href: '/community' },
    { label: 'Training', href: '/training' },
    { label: 'System Status', href: 'https://status.nirvana-platform.com', external: true },
    { label: 'Contact Support', href: '/support' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Compliance', href: '/compliance' },
  ];

  return (
    <footer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Logo */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-serif text-white">Nirvana</span>
              </div>
              
              <p className="text-white text-sm leading-relaxed mb-6 max-w-sm">
                Transforming government services through intelligent automation, real-time tracking, 
                and transparent communication between citizens and departments.
              </p>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-2 bg-purple-500/10 px-3 py-1 rounded-full">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-purple-300">SOC 2 Compliant</span>
                </div>
                <div className="flex items-center space-x-2 bg-purple-500/10 px-3 py-1 rounded-full">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-purple-300">50+ Cities</span>
                </div>
              </div>
              
              <SocialIcons />
            </motion.div>
          </div>

          {/* Product Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <FooterLinkGroup title="Product" links={productLinks} />
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FooterLinkGroup title="Company" links={companyLinks} />
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <FooterLinkGroup title="Support" links={supportLinks} />
          </motion.div>
        </div>{/* Newsletter Signup and Contact */}

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="border-t border-purple-500/20 pt-8 flex flex-col lg:flex-row justify-between items-center"
        >
          <div className="text-white text-sm mb-4 lg:mb-0">
            © 2025 Nirvana Platform. All rights reserved.
          </div>
          
          {/* Legal Links */}
          <div className="flex flex-wrap gap-6">
            {legalLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-white hover:text-purple-300 text-sm transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

// Export all subcomponents for individual use
export { FooterLinkGroup, SocialIcons, ContactInfo };
