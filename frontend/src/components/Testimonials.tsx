
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

export function Testimonials() {
  const testimonials = [
    {
      name: "Michael Johnson",
      location: "Portland, OR",
      rating: 5,
      text: "ShareSphere has completely changed how I think about ownership. Instead of buying expensive tools I rarely use, I can borrow from my neighbors. I've saved over $2,000 this year alone and made some great friends in the process!",
      avatar: "MJ"
    },
    {
      name: "Sarah Chen",
      location: "Seattle, WA", 
      rating: 5,
      text: "I love being able to help my neighbors while making a little extra income. The platform is so easy to use, and I've met amazing people in my community through lending my camping gear and kitchen appliances.",
      avatar: "SC"
    },
    {
      name: "David Rodriguez",
      location: "Austin, TX",
      rating: 5,
      text: "As someone who moves frequently, ShareSphere has been a lifesaver. I don't have to worry about buying and then getting rid of items. The community here is incredibly trustworthy and helpful.",
      avatar: "DR"
    }
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Community Success Stories
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Hear from real users who've transformed their neighborhoods through sharing and connecting on ShareSphere.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "{testimonial.text}"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold mr-3">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.location}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
