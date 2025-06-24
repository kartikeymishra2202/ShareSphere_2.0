import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getItemById, apiFetch, getProfile } from "@/lib/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ItemDetailItem {
  _id: string;
  title: string;
  category: { _id: string; label: string };
  status: string;
  ownerID: { _id: string; name: string };
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  location?: string;
}

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<ItemDetailItem | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [requesting, setRequesting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemData, userData] = await Promise.all([
          getItemById(id!),
          getProfile().catch(() => null),
        ]);
        setItem(itemData);
        setProfile(userData);
      } catch {
        setError("Failed to load item");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleRequest = async () => {
    setRequesting(true);
    setError("");
    setSuccess("");
    try {
      await apiFetch("/requests", {
        method: "POST",
        body: JSON.stringify({ itemID: item?._id }),
      });
      setSuccess("Request sent!");
    } catch {
      setError(
        "Could not send request. You may have already requested this item or are not allowed."
      );
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!item)
    return (
      <div className="p-8 text-center text-red-500">
        {error || "Item not found"}
      </div>
    );

  const isOwner = profile && item.ownerID && profile._id === item.ownerID._id;

  return (
    <div className="max-w-lg mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{item.title}</CardTitle>
          <CardDescription>
            {item.category?.label || "Uncategorized"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <b>Status:</b> {item.status}
          </div>
          <div className="mb-2">
            <b>Owner:</b> {item.ownerID?.name || "Unknown"}
          </div>
          {success && <div className="text-green-600 mb-2">{success}</div>}
          {error && <div className="text-red-500 mb-2">{error}</div>}
          {!isOwner && (
            <Button
              onClick={handleRequest}
              disabled={requesting}
              className="mt-4"
            >
              {requesting ? "Requesting..." : "Request to Borrow"}
            </Button>
          )}
          {isOwner && (
            <div className="text-sm text-gray-500 mt-2">You own this item.</div>
          )}
        </CardContent>
      </Card>
      <Button
        variant="outline"
        className="mt-4 w-full"
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
    </div>
  );
};

export default ItemDetail;
