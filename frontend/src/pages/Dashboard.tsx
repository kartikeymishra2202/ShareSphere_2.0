import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Package,
  Send,
  Inbox,
  LayoutDashboard,
  User,
  Calendar,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeft,
  Search,
  UserCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { io as clientIO, Socket } from "socket.io-client";

const MOBILE_BREAKPOINT = 768;
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

interface Item {
  _id: string;
  title: string;
  category: { label: string };
  status: string;
  requests: string[];
}
interface Request {
  _id: string;
  itemID: { title: string };
  requesterID?: { name: string; email: string; location: string };
  ownerID?: { name: string; email: string; location: string };
  status: string;
  requestDate: string;
}
interface Category {
  _id: string;
  label: string;
}
interface Message {
  _id?: string;
  senderID: { _id: string; name?: string } | string;
  text: string;
  timestamp?: string;
}

const AddItemModal = ({
  open,
  onOpenChange,
  onItemAdded,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemAdded: () => void;
}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && categories.length === 0) {
      apiFetch("/categories")
        .then(setCategories)
        .catch(() => setError("Could not load categories."));
    }
  }, [open, categories.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await apiFetch("/items", {
        method: "POST",
        body: JSON.stringify({ title, category }),
      });
      onItemAdded();
      onOpenChange(false);
      setTitle("");
      setCategory("");
    } catch (err) {
      setError("Failed to add item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] sm:max-w-[480px] bg-white rounded-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">
            Add a New Item
          </DialogTitle>
          <DialogDescription>
            List an item to share it with the community.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor="title" className="font-medium text-slate-600">
                Title
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 rounded-md border border-slate-300 px-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                placeholder="e.g., Electric Drill"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor="category" className="font-medium text-slate-600">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 rounded-md border border-slate-300 px-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                <option value="">Select a category...</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            {error && (
              <p className="text-center text-red-500 text-sm">{error}</p>
            )}
          </div>
          <DialogFooter className="!grid-cols-2 gap-2 sm:flex">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {" "}
              {loading ? "Adding..." : "Add Item"}{" "}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ChatBox = ({
  requestId,
  currentUserId,
}: {
  requestId: string;
  currentUserId: string;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = clientIO("http://localhost:5000");
    setSocket(s);
    s.emit("join", requestId);
    return () => {
      s.disconnect();
    };
  }, [requestId]);

  useEffect(() => {
    let active = true;
    const fetchMessages = async () => {
      try {
        const chat = await apiFetch(`/requests/${requestId}/chat`);
        if (active) setMessages(chat.messages || []);
      } catch {
        if (active) setError("Failed to load chat");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchMessages();
    return () => {
      active = false;
    };
  }, [requestId]);

  useEffect(() => {
    if (!socket) return;
    const handler = (data: { message: Message }) => {
      const senderId = (
        data.message.senderID &&
        (typeof data.message.senderID === "object"
          ? data.message.senderID._id
          : data.message.senderID)
      )?.toString();
      const userId = currentUserId?.toString();
      setMessages((prev) => [...prev, data.message]);
      if (senderId !== userId) {
        toast({ title: "New message", description: data.message.text });
      }
    };
    socket.on("chat:new_message", handler);
    return () => {
      socket.off("chat:new_message", handler);
    };
  }, [socket, currentUserId, toast]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    try {
      await apiFetch(`/requests/${requestId}/chat`, {
        method: "POST",
        body: JSON.stringify({ text: input }),
      });
      setInput("");
    } catch {
      setError("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-96">
      <div className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4 bg-slate-50">
        {loading ? (
          <div className="text-slate-500">Loading chat...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-slate-500 py-8">
            No messages yet.
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={msg._id || i} className="mb-3">
              <p className="font-semibold text-slate-800 text-sm">
                {typeof msg.senderID === "object"
                  ? msg.senderID.name || "User"
                  : "User"}
              </p>
              <div className="bg-white p-2 rounded-md text-slate-700 break-words">
                {msg.text}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ""}
              </div>
            </div>
          ))
        )}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={sending}
        />
        <Button
          type="submit"
          disabled={sending || !input.trim()}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Send
        </Button>
      </form>
    </div>
  );
};


const Sidebar = ({
  activeView,
  setActiveView,
  onAddItemClick,
}: {
  activeView: string;
  setActiveView: (view: string) => void;
  onAddItemClick: () => void;
}) => {
  const navItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard, type: "view" },
    { id: "my-items", label: "My Items", icon: Package, type: "view" },
    { id: "sent-requests", label: "Sent Requests", icon: Send, type: "view" },
    {
      id: "received-requests",
      label: "Received Requests",
      icon: Inbox,
      type: "view",
    },
    {
      id: "browse",
      label: "Browse Items",
      icon: Search,
      type: "link",
      path: "/browse",
    },
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
          if (item.type === "link") {
            return (
              <Link to={item.path!} key={item.id} className={className}>
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          }
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
        <Link
          to="/profile"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100"
        >
          <UserCircle className="h-10 w-10 text-slate-400" />
          <div>
            <p className="font-semibold text-sm text-slate-700">
              Update Profile
            </p>
            <p className="text-xs text-slate-500">View your profile</p>
          </div>
        </Link>
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


const BottomNavBar = ({
  activeView,
  setActiveView,
  onAddItemClick,
}: {
  activeView: string;
  setActiveView: (view: string) => void;
  onAddItemClick: () => void;
}) => {
  const navItems = [
    { id: "overview", label: "Home", icon: LayoutDashboard, type: "view" },
    { id: "my-items", label: "My Items", icon: Package, type: "view" },
    { id: "add-item", label: "Add", icon: Plus, type: "action" },
    {
      id: "browse",
      label: "Browse",
      icon: Search,
      type: "link",
      path: "/browse",
    },
    {
      id: "profile",
      label: "Profile",
      icon: UserCircle,
      type: "link",
      path: "/profile",
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-t-lg z-50 h-20">
      <div className="flex justify-around items-center h-full">
        {navItems.map((item) => {
          if (item.type === "action") {
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
          if (item.type === "link") {
            return (
              <Link to={item.path!} key={item.id} className={className}>
                <item.icon className="h-6 w-6" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          }
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


const PerformanceCard = ({
  title,
  value,
  trend,
  percentage,
  Icon,
}: {
  title: string;
  value: string | number;
  trend: "up" | "down";
  percentage: number;
  Icon: React.ElementType;
}) => {
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  const trendColor = trend === "up" ? "text-green-500" : "text-red-500";
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between text-slate-500 mb-4">
        <p className="font-semibold">{title}</p>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <span className="text-4xl font-bold text-slate-800">{value}</span>
        <div
          className={`flex items-center text-sm font-semibold mt-2 ${trendColor}`}
        >
          <TrendIcon className="h-5 w-5 mr-1" />
          <span>{percentage}%</span>
          <span className="text-slate-400 font-normal ml-2">this month</span>
        </div>
      </div>
    </div>
  );
};
const ActionableRequestCard = ({
  request,
  onApprove,
  onReject,
}: {
  request: Request;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-shadow hover:shadow-md">
    <div className="flex items-center gap-4">
      <div className="bg-slate-100 h-12 w-12 rounded-full flex-shrink-0 flex items-center justify-center">
        <User className="h-6 w-6 text-slate-500" />
      </div>
      <div>
        <p className="font-semibold text-slate-800">
          <span className="text-indigo-600">
            {request.requesterID?.name || "A user"}
          </span>{" "}
          wants to borrow your{" "}
          <span className="text-indigo-600">{request.itemID.title}</span>
        </p>
        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
          <Calendar className="h-4 w-4" />
          <span>
            {new Date(request.requestDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
      <Button
        size="sm"
        className="bg-green-500 hover:bg-green-600"
        onClick={() => onApprove(request._id)}
      >
        Approve
      </Button>
      <Button size="sm" variant="outline" onClick={() => onReject(request._id)}>
        Reject
      </Button>
    </div>
  </div>
);


const Dashboard = () => {
  const isMobile = useIsMobile();
  const [activeView, setActiveView] = useState("overview");
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [sentRequests, setSentRequests] = useState<Request[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [isAddItemModalOpen, setAddItemModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatRequestId, setChatRequestId] = useState<string | null>(null);
  const currentUserId = useMemo(() => localStorage.getItem("userId") || "", []);

  const fetchData = useCallback(async () => {
    try {
      const [itemsRes, sentRes, receivedRes] = await Promise.all([
        apiFetch("/items/mine"),
        apiFetch("/requests/sent"),
        apiFetch("/requests/received"),
      ]);
      setMyItems(itemsRes);
      setSentRequests(sentRes);
      setReceivedRequests(receivedRes);
    } catch (err: unknown) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dashboard data",
      });
    }
  }, [toast]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/signin";
      return;
    }
    setIsLoading(true);
    fetchData().finally(() => setIsLoading(false));
  }, [fetchData]);

  const pendingRequests = useMemo(
    () => receivedRequests.filter((r) => r.status.toLowerCase() === "pending"),
    [receivedRequests]
  );
  const lentItemsCount = useMemo(
    () =>
      receivedRequests.filter((r) => r.status.toLowerCase() === "approved")
        .length,
    [receivedRequests]
  );

  const handleItemAdded = () => {
    toast({
      title: "Success!",
      description: "Your item has been listed.",
      className: "bg-green-100 text-green-800",
    });
    fetchData();
  };
  const handleApprove = async (id: string) => {
    await apiFetch(`/requests/${id}/approve`, { method: "PATCH" });
    toast({ title: "Request Approved!" });
    setReceivedRequests((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status: "Approved" } : r))
    );
  };
  const handleReject = async (id: string) => {
    await apiFetch(`/requests/${id}/reject`, { method: "PATCH" });
    toast({ title: "Request Rejected" });
    setReceivedRequests((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status: "Rejected" } : r))
    );
  };
  const openChat = (requestId: string) => {
    setChatRequestId(requestId);
    setChatOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "approved":
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "lent":
        return "bg-sky-100 text-sky-800 border-sky-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

 
  const renderContent = () => {
    switch (activeView) {
      case "my-items":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myItems.length > 0 ? (
              myItems.map((item) => (
                <Card
                  key={item._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-slate-800">
                        {item.title}
                      </CardTitle>
                      <Badge
                        className={`border ${getStatusColor(item.status)}`}
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {item.category?.label || "Uncategorized"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">
                      {item.requests.length} pending requests
                    </span>
                    <Link to={`/edit-item/${item._id}`}>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="col-span-full text-center text-slate-500 py-10">
                You haven't listed any items yet.
              </p>
            )}
          </div>
        );
      case "sent-requests":
        return (
          <div className="space-y-4">
            {sentRequests.length > 0 ? (
              sentRequests.map((req) => (
                <Card
                  key={req._id}
                  className="bg-white p-4 rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {req.itemID.title}
                    </h3>
                    <p className="text-sm text-slate-500">
                      To: {req.ownerID?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(req.requestDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <Badge className={`border ${getStatusColor(req.status)}`}>
                      {req.status}
                    </Badge>
                    {req.status.toLowerCase() === "approved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openChat(req._id)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-center text-slate-500 py-10">
                You haven't sent any requests.
              </p>
            )}
          </div>
        );
      case "received-requests":
        return (
          <div className="space-y-4">
            {receivedRequests.length > 0 ? (
              receivedRequests.map((req) => (
                <Card
                  key={req._id}
                  className="bg-white p-4 rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {req.itemID.title}
                    </h3>
                    <p className="text-sm text-slate-500">
                      From: {req.requesterID?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(req.requestDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {req.status.toLowerCase() === "pending" ? (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => handleApprove(req._id)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(req._id)}
                        >
                          Reject
                        </Button>
                      </>
                    ) : (
                      <>
                        <Badge
                          className={`border ${getStatusColor(req.status)}`}
                        >
                          {req.status}
                        </Badge>
                        {req.status.toLowerCase() === "approved" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openChat(req._id)}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Chat
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-center text-slate-500 py-10">
                You have no requests to show.
              </p>
            )}
          </div>
        );
      case "overview":
      default:
        return (
          <>
            {pendingRequests.length > 0 && (
              <section className="mb-10">
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  Needs Your Attention ({pendingRequests.length})
                </h3>
                <div className="space-y-3">
                  {pendingRequests.map((req) => (
                    <ActionableRequestCard
                      key={req._id}
                      request={req}
                      onApprove={handleApprove}
                      onReject={handleReject}
                    />
                  ))}
                </div>
              </section>
            )}
            <section>
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Performance Overview
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <PerformanceCard
                  title="Total Items Listed"
                  value={myItems.length}
                  trend="up"
                  percentage={10}
                  Icon={Package}
                />
                <PerformanceCard
                  title="Items Currently Lent"
                  value={lentItemsCount}
                  trend="up"
                  percentage={5}
                  Icon={Send}
                />
                <PerformanceCard
                  title="Items Borrowed"
                  value={
                    sentRequests.filter(
                      (r) => r.status.toLowerCase() === "approved"
                    ).length
                  }
                  trend="down"
                  percentage={8}
                  Icon={Inbox}
                />
              </div>
            </section>
          </>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <AddItemModal
        open={isAddItemModalOpen}
        onOpenChange={setAddItemModalOpen}
        onItemAdded={handleItemAdded}
      />
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="w-[90vw] max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Chat about Request</DialogTitle>
          </DialogHeader>
          {chatRequestId && (
            <ChatBox requestId={chatRequestId} currentUserId={currentUserId} />
          )}
        </DialogContent>
      </Dialog>
      <div
        className={`flex min-h-screen bg-slate-50 font-sans ${
          isAddItemModalOpen || chatOpen ? "blur-sm" : ""
        } transition-all duration-300`}
      >
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          onAddItemClick={() => setAddItemModalOpen(true)}
        />
        <main
          className={`flex-1 w-full overflow-y-auto p-4 md:p-10 ${
            isMobile ? "pb-28" : ""
          }`}
        >
          <header className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
              {activeView === "overview"
                ? `Good Evening, User!`
                : `${
                    activeView.charAt(0).toUpperCase() +
                    activeView.slice(1).replace("-", " ")
                  }`}
            </h2>
            <p className="text-slate-500 mt-1 text-sm md:text-base">
              {activeView === "overview"
                ? `Here's your lending summary for today.`
                : `Manage your ${activeView.replace(
                    "-",
                    " "
                  )} from this panel.`}
            </p>
          </header>
          {renderContent()}
        </main>
        <BottomNavBar
          activeView={activeView}
          setActiveView={setActiveView}
          onAddItemClick={() => setAddItemModalOpen(true)}
        />
      </div>
    </>
  );
};

export default Dashboard;
