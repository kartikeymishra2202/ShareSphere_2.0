import React from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Package,
  Send,
  LayoutDashboard,
  Search,
  UserCircle,
  Inbox,
} from "lucide-react";

interface BottomNavBarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onAddItemClick: () => void;
}

export const BottomNavBar = ({
  activeView,
  setActiveView,
  onAddItemClick,
}: BottomNavBarProps) => {
  const navItems = [
    { id: "overview", label: "Home", icon: LayoutDashboard },
    { id: "browse", label: "Browse", icon: Search },
    { id: "sent-requests", label: "Sent Requests", icon: Send },
    { id: "add-item", label: "Add", icon: Plus },
    { id: "received-requests", label: "Received Requests", icon: Inbox },
    { id: "my-items", label: "Items", icon: Package },
    { id: "profile", label: "Profile", icon: UserCircle },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-t-lg z-50 h-20">
      <div className="flex justify-around items-center h-full">
        {navItems.map((item) => {
          if (item.id === "add-item") {
            return (
              <Button
                key={item.id}
                onClick={onAddItemClick}
                className="bg-indigo-600 rounded-full h-14 w-14 shadow-lg -translate-y-4 flex items-center justify-center"
              >
                <Plus className="h-7 w-7 text-white" />
              </Button>
            );
          }
          const isActive = activeView === item.id;
          const className = `flex flex-col items-center justify-center gap-1 transition-colors ${
            isActive ? "text-indigo-600" : "text-slate-500"
          }`;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={className}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
