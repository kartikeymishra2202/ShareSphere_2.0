import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import {
  Menu,
  X,
  LogOut,
  Users,
  Package,
  Handshake,
  Star,
  ArrowRight,
  Library,
  Tent,
  Utensils,
  Wrench,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    toast({
      title: "Logged out successfully!",
    });

    window.location.href = "/";
  };

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#testimonials", label: "Testimonials" },
  ];

  const AuthButtons = () => (
    <div className="flex items-center gap-2">
      {isAuthenticated ? (
        <>
          <Link to="/dashboard">
            <Button variant="ghost" className="text-slate-600">
              Dashboard
            </Button>
          </Link>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </>
      ) : (
        <>
          <Link to="/signin">
            <Button variant="ghost" className="text-slate-600">
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
              Get Started
            </Button>
          </Link>
        </>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          to="/"
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500"
        >
          ShareSphere
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex">
          <AuthButtons />
        </div>

        <div className="md:hidden">
          <Button
            onClick={() => setIsOpen(!isOpen)}
            variant="ghost"
            size="icon"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden border-t bg-white px-4 pb-4">
          <nav className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-base font-medium text-slate-700"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 border-t pt-4">
            <AuthButtons />
          </div>
        </div>
      )}
    </header>
  );
};

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-slate-50">
      <div className="container relative z-10 mx-auto px-4 py-20 text-center md:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <h1 className="text-4xl font-extrabold tracking-tighter text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
          Borrow Anything, <br />
          Lend Everything.{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500">
            Connect.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          Unlock the potential of your neighborhood. ShareSphere is the
          community platform to borrow items you need and lend out what you
          don't, saving money and building a stronger community.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Join the Community <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

const Stats = () => {
  const stats = [
    { number: "2,500+", label: "Active Members" },
    { number: "4,800+", label: "Items Shared" },
    { number: "$350k+", label: "Community Savings" },
    { number: "98%", label: "Positive Reviews" },
  ];

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-bold tracking-tighter text-indigo-600">
                {stat.number}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <Users className="h-8 w-8 text-indigo-500" />,
      title: "Find & Request",
      description:
        "Browse thousands of items shared by your neighbors. Find what you need and send a secure borrowing request.",
    },
    {
      icon: <Package className="h-8 w-8 text-indigo-500" />,
      title: "List Your Items",
      description:
        "Have items collecting dust? List them in minutes, set your own terms, and start earning from your unused stuff.",
    },
    {
      icon: <Handshake className="h-8 w-8 text-indigo-500" />,
      title: "Connect & Exchange",
      description:
        "Use our secure chat to coordinate a convenient pickup. Meet your neighbors and build a trusted local network.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-slate-50 py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Start Sharing in 3 Easy Steps
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            From finding a power drill to listing your camping gear, it's simple
            and secure.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card
              key={step.title}
              className="bg-white p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 text-slate-600">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const CategoriesSection = () => {
  const categories = [
    { icon: Wrench, name: "Tools & DIY" },
    { icon: Tent, name: "Outdoor Gear" },
    { icon: Utensils, name: "Kitchen Appliances" },
    { icon: Library, name: "Books & Media" },
  ];

  return (
    <section id="features" className="py-20 sm:py-28 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Anything You Can Imagine
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            From party supplies to power tools, find what you need in dozens of
            categories.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="group flex flex-col items-center gap-4 rounded-xl border bg-slate-50 p-6 transition-colors hover:bg-indigo-50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-110">
                <cat.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <p className="font-semibold text-slate-800">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Michael Johnson",
      location: "Portland, OR",
      text: "ShareSphere has completely changed how I think about ownership. I've saved over $2,000 this year alone and made some great friends in the process!",
      avatarInitial: "MJ",
    },
    {
      name: "Sarah Chen",
      location: "Seattle, WA",
      text: "I love being able to help my neighbors while making a little extra income. The platform is so easy to use, and I've met amazing people.",
      avatarInitial: "SC",
    },
    {
      name: "David Rodriguez",
      location: "Austin, TX",
      text: "As someone who moves frequently, this has been a lifesaver. I don't have to worry about buying and then getting rid of items. Incredibly trustworthy!",
      avatarInitial: "DR",
    },
  ];

  return (
    <section id="testimonials" className="bg-slate-50 py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Loved by Communities Everywhere
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.name}
              className="flex flex-col justify-between bg-white p-6"
            >
              <div>
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 italic">"{testimonial.text}"</p>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-500 font-bold text-white">
                  {testimonial.avatarInitial}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 py-20 sm:py-28">
        <div className="relative isolate overflow-hidden rounded-2xl bg-indigo-600 px-6 py-16 text-center shadow-xl sm:px-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to start sharing?
          </h2>
          <p className="mt-4 text-lg text-indigo-100">
            Join thousands of neighbors building stronger, more resourceful
            communities today.
          </p>
          <Link to="/signup" className="mt-8">
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-slate-100"
            >
              Create Your Free Account
            </Button>
          </Link>
          <div
            className="absolute -top-24 left-0 -z-10 h-64 w-64 rounded-full bg-white/10"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 right-0 -z-10 h-64 w-64 rounded-full bg-white/10"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} ShareSphere. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-slate-600">
            <Link to="/privacy" className="hover:text-indigo-600">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-indigo-600">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const LandingPage = () => {
  return (
    <div className="bg-white">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <HowItWorksSection />
        <CategoriesSection />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
