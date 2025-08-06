import React, { useEffect, useState } from "react";
import { apiFetch, getItemById } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

interface Item {
  _id: string;
  title: string;
  category: { _id: string; label: string };
}
interface Category {
  _id: string;
  label: string;
}

interface EditItemViewProps {
  itemId: string;
  onBack: () => void;
  onItemUpdated: () => void;
}

export default function EditItemView({
  itemId,
  onBack,
  onItemUpdated,
}: EditItemViewProps) {
  const [item, setItem] = useState<Item | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ title: "", category: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getItemById(itemId).then((data) => {
      setItem(data);
      setForm({ title: data.title, category: data.category?._id || "" });
    });
    apiFetch("/categories").then(setCategories);
  }, [itemId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiFetch(`/items/${itemId}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
      onItemUpdated();
      onBack();
    } catch {
      setError("Failed to update item");
    } finally {
      setLoading(false);
    }
  };

  if (!item) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-md mx-auto">
      <Button variant="outline" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to My Items
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Edit Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Title</label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Category</label>
              <Select
                name="category"
                value={form.category}
                onValueChange={(value) => setForm({ ...form, category: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
