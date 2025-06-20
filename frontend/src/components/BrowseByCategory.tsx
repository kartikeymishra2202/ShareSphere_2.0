import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";

type Category = {
  _id: string;
  label: string;
  color: string;
  icon: string;
  items: number;
  description: string;
  tag: string;
};

const BrowseByCategory: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [translateX, setTranslateX] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiFetch("/categories");
        setCategories(data);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load categories";
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [toast]);

  const featuredItems = [
    {
      title: "Electric Drill Set",
      image: "https://images.unsplash.com/photo-1587174486073-e4d7b15a5829",
      price: "$15/day",
      location: "Downtown, NY",
    },
    {
      title: "Lawn Mower",
      image: "https://images.unsplash.com/photo-1590080875435-cb7aebbf3d61",
      price: "$20/day",
      location: "Queens, NY",
    },
    {
      title: "Stand Mixer",
      image: "https://images.unsplash.com/photo-1606811842107-dba00e62c0f1",
      price: "$10/day",
      location: "Brooklyn, NY",
    },
    {
      title: "Projector",
      image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e",
      price: "$25/day",
      location: "Harlem, NY",
    },
    {
      title: "Camping Tent",
      image: "https://images.unsplash.com/photo-1559091228-0fc99b8375c8",
      price: "$8/day",
      location: "Bronx, NY",
    },
  ];

  const filtered =
    selectedCategory === "all"
      ? categories
      : categories.filter((c) => c._id === selectedCategory);

  const slideWidth = 300 + 20; // card + gap
  const maxTranslate = -(slideWidth * (featuredItems.length - 3)); // max visible cards = 3

  const handleNext = () => {
    const newTranslate = Math.max(translateX - slideWidth, maxTranslate);
    setTranslateX(newTranslate);
  };

  const handlePrev = () => {
    const newTranslate = Math.min(translateX + slideWidth, 0);
    setTranslateX(newTranslate);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Browse by Category
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find exactly what you need or discover what you can share with your
          community by exploring our diverse categories.
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        <button
          className={`px-5 py-2 rounded-full font-medium text-sm ${
            selectedCategory === "all"
              ? "bg-[#4CAF50] text-white"
              : "bg-neutral-200 text-gray-700"
          }`}
          onClick={() => setSelectedCategory("all")}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            className={`px-5 py-2 rounded-full font-medium text-sm ${
              selectedCategory === cat._id
                ? "bg-[#4CAF50] text-white"
                : "bg-neutral-200 text-gray-700"
            }`}
            onClick={() => setSelectedCategory(cat._id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-16">
        {filtered.map((cat, i) => (
          <div
            key={cat._id}
            className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div
              className="h-48 relative"
              style={{ backgroundColor: `${cat.color}1A` }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${cat.color}33` }}
                >
                  <div className="text-2xl" style={{ color: cat.color }}>
                    📦
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{cat.label}</h3>
              <p className="text-sm text-gray-600 mb-3">{cat.description}</p>
              <div className="flex justify-between items-center">
                <span
                  className="text-sm font-medium"
                  style={{ color: cat.color }}
                >
                  {cat.items} items
                </span>
                <span
                  className="text-xs py-1 px-2 rounded-full"
                  style={{
                    backgroundColor: `${cat.color}1A`,
                    color: cat.color,
                  }}
                >
                  {cat.tag}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Items Section */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-bold mb-2">
            Featured Items
          </h3>
          <p className="text-gray-600">
            Discover popular items available in your neighborhood
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex gap-5 transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(${translateX}px)` }}
          >
            {featuredItems.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[300px] bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 font-semibold">
                      {item.price}
                    </span>
                    <span className="text-sm text-gray-600">
                      {item.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {translateX < 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {translateX > maxTranslate && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseByCategory;
