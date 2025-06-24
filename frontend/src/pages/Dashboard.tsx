import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Package,
  Send,
  Inbox,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { io as clientIO, Socket } from "socket.io-client";

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

interface Message {
  _id?: string;
  senderID: { _id: string; name?: string } | string;
  text: string;
  timestamp?: string;
}

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
    const active = true;
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
      console.log(
        "senderId:",
        senderId,
        "currentUserId:",
        userId,
        senderId === userId
      );
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
    <div className="flex flex-col h-80">
      <div className="flex-1 overflow-y-auto border rounded p-2 mb-2 bg-gray-50">
        {loading ? (
          <div>Loading chat...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-gray-500">No messages yet.</div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className="mb-2">
              <b>{msg.senderID?.name || "User"}:</b> {msg.text}
              <div className="text-xs text-gray-400">
                {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ""}
              </div>
            </div>
          ))
        )}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={sending}
        />
        <Button type="submit" disabled={sending || !input.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [sentRequests, setSentRequests] = useState<Request[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatRequestId, setChatRequestId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/signin";
      return;
    }

    const fetchData = async () => {
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
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load dashboard data";
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "available":
        return "bg-green-100 text-green-800";
      case "lent":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await apiFetch(`/requests/${id}/approve`, { method: "PATCH" });
      toast({ title: "Request approved" });
      setReceivedRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "Approved" } : r))
      );
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve request",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await apiFetch(`/requests/${id}/reject`, { method: "PATCH" });
      toast({ title: "Request rejected" });
      setReceivedRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "Rejected" } : r))
      );
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject request",
      });
    }
  };

  const openChat = (requestId: string) => {
    setChatRequestId(requestId);
    setChatOpen(true);
  };

  const closeChat = () => setChatOpen(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your items and track your lending activity
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="my-items">My Items</TabsTrigger>
            <TabsTrigger value="sent-requests">Sent Requests</TabsTrigger>
            <TabsTrigger value="received-requests">
              Received Requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Items Listed
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{myItems.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {myItems.length > 0 ? "Active listings" : "No items yet"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Requests
                  </CardTitle>
                  <Inbox className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {
                      receivedRequests.filter(
                        (r) => r.status.toLowerCase() === "pending"
                      ).length
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Need your attention
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Items Borrowed
                  </CardTitle>
                  <Send className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {
                      sentRequests.filter(
                        (r) => r.status.toLowerCase() === "approved"
                      ).length
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Currently active
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Community Rating
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.9</div>
                  <p className="text-xs text-muted-foreground">
                    Excellent reputation
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {receivedRequests.length > 0 ? (
                    receivedRequests.slice(0, 3).map((request) => (
                      <div
                        key={request._id}
                        className="flex items-center space-x-3"
                      >
                        {getStatusIcon(request.status)}
                        <div>
                          <p className="font-medium">
                            New request for {request.itemID.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(request.requestDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No recent activity</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/add-item">
                    <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Item
                    </Button>
                  </Link>
                  <Link to="/browse">
                    <Button variant="outline" className="w-full justify-start">
                      <Package className="h-4 w-4 mr-2" />
                      Browse Items
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="outline" className="w-full justify-start">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Update Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="my-items" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Items</h2>
              <Link to="/add-item">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myItems.length > 0 ? (
                myItems.map((item) => (
                  <Card key={item._id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        {item.category?.label || "Uncategorized"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {item.requests.length} pending requests
                        </span>
                        <Link to={`/edit-item/${item._id}`}>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No items yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start sharing by adding your first item
                  </p>
                  <Link to="/add-item">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Item
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sent-requests" className="space-y-6">
            <h2 className="text-2xl font-bold">Sent Requests</h2>
            <div className="space-y-4">
              {sentRequests.length > 0 ? (
                sentRequests.map((request) => (
                  <Card key={request._id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(request.status)}
                          <div>
                            <h3 className="font-medium">
                              {request.itemID.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Requested from{" "}
                              {request.ownerID?.name || "Unknown"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(request.requestDate).toLocaleDateString()}
                          </p>
                          <div className="text-xs mt-2 text-left">
                            <b>Lender:</b> {request.ownerID?.name || "Unknown"}
                            <br />
                            <b>Email:</b> {request.ownerID?.email || "-"}
                            <br />
                            <b>Location:</b> {request.ownerID?.location || "-"}
                          </div>
                          {request.status.toLowerCase() === "approved" && (
                            <Button
                              size="sm"
                              className="mt-2"
                              onClick={() => openChat(request._id)}
                            >
                              Chat
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No sent requests
                  </h3>
                  <p className="text-gray-600">
                    You haven't requested any items yet
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="received-requests" className="space-y-6">
            <h2 className="text-2xl font-bold">Received Requests</h2>
            <div className="space-y-4">
              {receivedRequests.length > 0 ? (
                receivedRequests.map((request) => (
                  <Card key={request._id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(request.status)}
                          <div>
                            <h3 className="font-medium">
                              {request.itemID.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Requested by{" "}
                              {request.requesterID?.name || "Unknown"}
                            </p>
                            <div className="text-xs mt-1">
                              <b>Borrower:</b>{" "}
                              {request.requesterID?.name || "Unknown"}
                              <br />
                              <b>Email:</b> {request.requesterID?.email || "-"}
                              <br />
                              <b>Location:</b>{" "}
                              {request.requesterID?.location || "-"}
                            </div>
                            {request.status.toLowerCase() === "approved" && (
                              <Button
                                size="sm"
                                className="mt-2"
                                onClick={() => openChat(request._id)}
                              >
                                Chat
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(request._id)}
                            disabled={
                              request.status.toLowerCase() !== "pending"
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(request._id)}
                            disabled={
                              request.status.toLowerCase() !== "pending"
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <Inbox className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No received requests
                  </h3>
                  <p className="text-gray-600">
                    No one has requested your items yet
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Dialog open={chatOpen} onOpenChange={closeChat}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Chat</DialogTitle>
          </DialogHeader>
          {chatRequestId && (
            <ChatBox
              requestId={chatRequestId}
              currentUserId={localStorage.getItem("userId") || ""}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
