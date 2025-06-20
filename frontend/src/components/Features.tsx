import React from "react";

interface FeatureItem {
  icon: JSX.Element;
  title: string;
  description: string;
  highlights: string[];
  color: string; // tailwind color e.g. "green", "blue", "orange"
}

const features: FeatureItem[] = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-[#4CAF50]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    title: "User Profiles",
    description:
      "Build trust with detailed profiles showing ratings, reviews, and lending history. Verify your identity to increase trustworthiness.",
    highlights: [
      "ID verification options",
      "Reputation system",
      "Lending history tracking",
    ],
    color: "green",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-[#2196F3]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
    title: "Item Listings",
    description:
      "Create detailed listings with photos, descriptions, availability calendars, and condition details for all your shareable items.",
    highlights: [
      "Multi-photo uploads",
      "Category organization",
      "Availability calendar",
    ],
    color: "blue",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-[#FF9800]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
    title: "Search and Filter",
    description:
      "Find exactly what you need with powerful search tools. Filter by category, distance, availability, and owner ratings.",
    highlights: [
      "Location-based discovery",
      "Advanced filtering options",
      "Saved searches",
    ],
    color: "orange",
  },
];

const FeatureSection: React.FC = () => {
  return (
    <section className="py-16 px-4 lg:px-20 bg-white">
      {/* ✅ Heading */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Powerful Features to Connect &amp; Share
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Our platform makes borrowing and lending simple, secure, and social
          with these key features designed for community building.
        </p>
      </div>

      {/* ✅ Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <div
            key={feature.title}
            className="bg-neutral-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 animate__animated animate__fadeInUp"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div
              className={`w-16 h-16 mb-6 bg-${feature.color}-500/20 rounded-full flex items-center justify-center`}
            >
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            <ul className="space-y-2 mb-4">
              {feature.highlights.map((point) => (
                <li key={point} className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-${feature.color}-500 mt-0.5 mr-2`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
