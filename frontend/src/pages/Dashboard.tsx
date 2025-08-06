import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Package,
  Send,
  Inbox,
  MessageSquare,
  User,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";


import { Sidebar } from "./Sidebar";
import { BottomNavBar } from "./BottomNavbar";
import { AddItemModal } from "./AddItemModal";
import { ChatBox } from "./ChatBox";
import BrowseView from "./BrowseView";
import ProfileView from "./ProfileView";
import EditItemView from "./EditItemView";
import ItemDetailView from "./ItemDetailView";


import { Item, Request } from "./types";

const MOBILE_BREAKPOINT = 768;
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}

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

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [viewingItemId, setViewingItemId] = useState<string | null>(null);

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

  const handleItemUpdated = () => {
    toast({ title: "Success!", description: "Item updated successfully." });
    fetchData();
  };

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
    fetchData();
  };

  const handleReject = async (id: string) => {
    await apiFetch(`/requests/${id}/reject`, { method: "PATCH" });
    toast({ title: "Request Rejected" });
    fetchData();
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

  const renderContent = () => {
    if (editingItemId) {
      return (
        <EditItemView
          itemId={editingItemId}
          onBack={() => setEditingItemId(null)}
          onItemUpdated={handleItemUpdated}
        />
      );
    }
    if (viewingItemId) {
      return (
        <ItemDetailView
          itemId={viewingItemId}
          onBack={() => setViewingItemId(null)}
        />
      );
    }
    switch (activeView) {
      case "browse":
        return <BrowseView onViewDetails={setViewingItemId} />;
      case "profile":
        return <ProfileView />;
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingItemId(item._id)}
                    >
                      Manage
                    </Button>
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

  const getHeaderInfo = () => {
    if (editingItemId)
      return {
        title: "Edit Your Item",
        description: "Update the details for your listed item.",
      };
    if (viewingItemId)
      return {
        title: "Item Details",
        description: "View details and request to borrow this item.",
      };
    return {
      title:
        {
          overview: `Good Evening, User!`,
          "my-items": "My Items",
          "sent-requests": "Sent Requests",
          "received-requests": "Received Requests",
          browse: "Browse Community Items",
          profile: "My Profile",
        }[activeView] || "Dashboard",
      description:
        {
          overview: "Here's your lending summary for today.",
          "my-items": "Manage your listed items from this panel.",
          "sent-requests": "Track the status of your item requests.",
          "received-requests": "Manage incoming requests for your items.",
          browse: "Find and borrow items shared by the community.",
          profile: "View and update your personal information.",
        }[activeView] || "Welcome to your dashboard.",
    };
  };

  const { title, description } = getHeaderInfo();

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
        className={`flex h-screen overflow-hidden bg-slate-50 font-sans ${
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
              {title}
            </h2>
            <p className="text-slate-500 mt-1 text-sm md:text-base">
              {description}
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
