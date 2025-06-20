
import { Wrench, TreePine, Utensils, Monitor, Home, Snowflake, Calendar, Car } from "lucide-react";
import { Card } from "@/components/ui/card";

export function Categories() {
  const categories = [
    { icon: Wrench, name: "Tools & DIY", count: "450+ items", color: "text-green-600", bgColor: "bg-green-50" },
    { icon: TreePine, name: "Outdoor & Garden", count: "320+ items", color: "text-blue-600", bgColor: "bg-blue-50" },
    { icon: Utensils, name: "Kitchen Appliances", count: "280+ items", color: "text-orange-600", bgColor: "bg-orange-50" },
    { icon: Monitor, name: "Electronics", count: "190+ items", color: "text-purple-600", bgColor: "bg-purple-50" },
    { icon: Home, name: "Sports & Recreation", count: "365+ items", color: "text-green-600", bgColor: "bg-green-50" },
    { icon: Snowflake, name: "Event Supplies", count: "125+ items", color: "text-blue-600", bgColor: "bg-blue-50" },
    { icon: Calendar, name: "Home Improvement", count: "200+ items", color: "text-orange-600", bgColor: "bg-orange-50" },
    { icon: Car, name: "Vehicles & Transport", count: "85+ items", color: "text-purple-600", bgColor: "bg-purple-50" }
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Browse by Category
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Find exactly what you need or discover what you can share with your community by exploring our shared categories.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className={`inline-flex items-center justify-center w-12 h-12 ${category.bgColor} rounded-lg mb-4 group-hover:scale-110 transition-transform`}>
                <category.icon className={`w-6 h-6 ${category.color}`} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600">
                {category.count}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
