
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CTA() {
  return (
    <div className="bg-gradient-to-r from-green-600 to-blue-600">
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          <span className="block">Ready to join our community?</span>
          <span className="block">Start sharing today.</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-green-100">
          Join thousands of neighbors who are already saving money, reducing waste, and building stronger communities through ShareSphere.
        </p>
        <Link to="/signup">
          <Button className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50 sm:w-auto">
            Join ShareSphere Today
          </Button>
        </Link>
      </div>
    </div>
  );
}
