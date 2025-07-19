import { FaqSection } from "@/components/ui/faq";

const NIRVANA_FAQS = [
  {
    question: "How does Nirvana improve citizen complaint resolution?",
    answer: "Nirvana uses AI-powered routing to automatically categorize and direct complaints to the right department, reducing response time by up to 60%. Citizens can track their complaint status in real-time and receive automatic updates throughout the resolution process.",
  },
  {
    question: "What makes Nirvana different from traditional government systems?",
    answer: "Unlike legacy systems, Nirvana provides complete transparency with real-time tracking, automated workflows, and intelligent categorization. Citizens no longer face bureaucratic delays or lost paperwork. Our platform integrates all government departments into one unified system.",
  },
  {
    question: "Is Nirvana secure for handling sensitive citizen data?",
    answer: "Absolutely. Nirvana employs bank-grade security with end-to-end encryption, multi-factor authentication, and compliance with government data protection standards. All citizen data is protected and handled according to strict privacy regulations.",
  },
  {
    question: "How can government departments integrate with Nirvana?",
    answer: "Nirvana offers seamless integration through APIs and existing government systems. Our technical team provides comprehensive onboarding, staff training, and ongoing support to ensure smooth adoption across all departments.",
  },
  {
    question: "What types of complaints can be filed through Nirvana?",
    answer: "Nirvana handles all types of civic complaints including infrastructure issues, public services, health and safety concerns, utilities, transportation, and administrative services. The platform automatically routes each complaint to the appropriate department.",
  },
  {
    question: "How does the real-time tracking feature work?",
    answer: "Citizens receive a unique tracking ID for each complaint and can monitor progress through our web portal or mobile app. They get automatic notifications when their complaint is reviewed, assigned, being processed, or resolved, ensuring complete transparency.",
  },
];

export function NirvanaFaq() {
  return (
    <FaqSection
      title="Frequently Asked Questions"
      description="Everything you need to know about Nirvana's smart governance platform"
      items={NIRVANA_FAQS}
      contactInfo={{
        title: "Still have questions?",
        description: "Our team is here to help you understand how Nirvana can transform your city's governance",
        buttonText: "Contact Our Team",
        onContact: () => {
          // In a real implementation, this could open a contact form or navigate to a contact page
          console.log("Contact support clicked");
          window.open("mailto:support@nirvana-platform.com", "_blank");
        },
      }}
    />
  );
}
