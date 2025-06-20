
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, Users } from "lucide-react";

export function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Borrow, Lend,</span>{' '}
                <span className="block text-green-600 xl:inline">Connect</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Join our community platform where neighbors share resources, save money, and reduce waste. Borrow what you need, lend what you don't use, and build stronger communities.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link to="/signup">
                    <Button className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md bg-green-600 text-white hover:bg-green-700 md:py-4 md:text-lg md:px-10">
                      Get Started
                    </Button>
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link to="/how-it-works">
                    <Button variant="outline" className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                      Learn How It Works
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="mt-8 flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2 overflow-hidden">
                    <div className="inline-block h-8 w-8 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-semibold">J</div>
                    <div className="inline-block h-8 w-8 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-semibold">M</div>
                    <div className="inline-block h-8 w-8 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-semibold">+</div>
                  </div>
                  <span className="text-sm text-gray-600">Join 2,500+ community members already sharing</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Hero Image/Demo Section */}
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="h-56 w-full bg-gray-900 sm:h-72 md:h-96 lg:w-full lg:h-full relative overflow-hidden rounded-l-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-600/20"></div>
          <div className="relative z-10 h-full flex items-center justify-center p-8">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-500 h-5 w-5" />
                  <span className="font-semibold text-gray-900">Power Drill</span>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Available for 5 days</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">A</div>
                  <span className="text-sm text-gray-600">I need this for a weekend project!</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-semibold">B</div>
                  <span className="text-sm text-gray-600">It's all yours! I can drop it off Saturday.</span>
                </div>
              </div>
              
              <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
                Approve Request
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
