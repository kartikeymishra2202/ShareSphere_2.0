import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Package,
  Send,
  Inbox,
  LayoutDashboard,
  Search,
  UserCircle,
  ArrowLeft,
} from "lucide-react";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onAddItemClick: () => void;
}

export const Sidebar = ({
  activeView,
  setActiveView,
  onAddItemClick,
}: SidebarProps) => {
  const navItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "my-items", label: "My Items", icon: Package },
    { id: "sent-requests", label: "Sent Requests", icon: Send },
    { id: "received-requests", label: "Received Requests", icon: Inbox },
    { id: "browse", label: "Browse Items", icon: Search },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex-col font-sans hidden md:flex">
      <div className="h-20 flex items-center px-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500">
          ShareSphere
        </h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          const className = `w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
            isActive
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          }`;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={className}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 m-4 rounded-lg bg-slate-100 text-center">
        <p className="text-sm font-semibold text-slate-800 mb-2">
          Ready to Share?
        </p>
        <Button
          onClick={onAddItemClick}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Item
        </Button>
      </div>
      <div className="px-4 py-3 border-t border-slate-200">
        <button
          onClick={() => setActiveView("profile")}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 w-full"
        >
          <UserCircle className="h-10 w-10 text-slate-400" />
          <div>
            <p className="font-semibold text-sm text-slate-700 text-left">
              My Profile
            </p>
            <p className="text-xs text-slate-500">View and edit your profile</p>
          </div>
        </button>
      </div>
      <div className="p-4 border-t border-slate-200">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Landing Page
        </Link>
      </div>
    </aside>
  );
};
