import React from "react";

const HowItWorks: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          How ShareSphere Works
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Borrowing and lending has never been easier. Join our community and
          start sharing in three simple steps.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="hidden md:flex justify-center mb-12">
        <div className="flex items-center w-full max-w-4xl">
          <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold z-10">
            1
          </div>
          <div className="flex-1 h-1 bg-green-500"></div>
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold z-10">
            2
          </div>
          <div className="flex-1 h-1 bg-blue-500"></div>
          <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold z-10">
            3
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 animate__animated animate__fadeInUp`}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div
              className={`w-16 h-16 rounded-full ${step.bgColor}/20 flex items-center justify-center mb-6`}
            >
              {step.icon}
            </div>
            <div
              className={`md:hidden w-10 h-10 rounded-full ${step.bgColor} text-white flex items-center justify-center font-bold mb-4`}
            >
              {index + 1}
            </div>
            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
            <p className="text-gray-600 mb-4">{step.description}</p>
            <ul className="space-y-2 mb-6">
              {step.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${step.textColor} mt-1 mr-2`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <a
              href="#signup"
              className={`${step.textColor} font-semibold hover:underline inline-flex items-center`}
            >
              {step.cta}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

const steps = [
  {
    title: "Create Your Profile",
    description:
      "Sign up and create your profile with your location to connect with neighbors in your community.",
    features: [
      "Quick verification process",
      "Set your lending preferences",
      "Browse local inventory",
    ],
    cta: "Create Profile",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-green-500"
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
    bgColor: "bg-green-500",
    textColor: "text-green-500",
  },
  {
    title: "List or Browse Items",
    description:
      "Add items you're willing to lend or search for items to borrow in your neighborhood.",
    features: [
      "Simple photo upload process",
      "Categorize items effectively",
      "Filter by distance and availability",
    ],
    cta: "Explore Categories",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-blue-500"
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
    bgColor: "bg-blue-500",
    textColor: "text-blue-500",
  },
  {
    title: "Connect and Share",
    description:
      "Request items, approve requests, and arrange exchanges through our in-app messaging.",
    features: [
      "Secure in-app messaging",
      "Digital borrowing agreements",
      "Leave feedback after exchanges",
    ],
    cta: "Learn More",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-orange-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      </svg>
    ),
    bgColor: "bg-orange-500",
    textColor: "text-orange-500",
  },
];

export default HowItWorks;
