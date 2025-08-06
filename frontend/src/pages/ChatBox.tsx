import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { io as clientIO, Socket } from "socket.io-client";
import type { Message } from "./types";

interface ChatBoxProps {
  requestId: string;
  currentUserId: string;
}

export const ChatBox = ({ requestId, currentUserId }: ChatBoxProps) => {
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
      setMessages((prev) => [...prev, data.message]);
      const senderId =
        typeof data.message.senderID === "object"
          ? data.message.senderID._id
          : data.message.senderID;
      if (senderId?.toString() !== currentUserId?.toString()) {
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
