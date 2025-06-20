
export function Stats() {
  const stats = [
    { number: "2,500+", label: "Active Members", color: "text-green-600" },
    { number: "4,800+", label: "Items Shared", color: "text-blue-600" },
    { number: "$350k+", label: "Money Saved", color: "text-orange-600" },
    { number: "15+", label: "Categories", color: "text-purple-600" }
  ];

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                {stat.number}
              </div>
              <div className="text-gray-600 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
