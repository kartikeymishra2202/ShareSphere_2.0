import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { getAllItems, getCategoryById } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Category {
  _id: string;
  label: string;
  color: string;
  icon: string;
  description: string;
  tag: string;
}

const AddItem = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const defaultCategories = [
    {
      label: "Tools and DIY",
      color: "#4CAF50",
      icon: "wrench",
      description: "All kinds of tools and DIY equipment",
      tag: "tools",
    },
    {
      label: "Outdoor and Garden",
      color: "#2196F3",
      icon: "tree",
      description: "Outdoor, garden, and camping gear",
      tag: "outdoor",
    },
    {
      label: "Kitchen Appliances",
      color: "#FF9800",
      icon: "utensils",
      description: "Kitchen and cooking appliances",
      tag: "kitchen",
    },
    {
      label: "Electronics",
      color: "#9C27B0",
      icon: "monitor",
      description: "Electronics and gadgets",
      tag: "electronics",
    },
  ];

  const addDefaultCategories = async () => {
    for (const cat of defaultCategories) {
      await apiFetch("/categories", {
        method: "POST",
        body: JSON.stringify(cat),
      });
    }
    const cats = await apiFetch("/categories");
    setCategories(cats);
  };

  useEffect(() => {
    apiFetch("/categories").then(setCategories);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiFetch("/items", {
        method: "POST",
        body: JSON.stringify({ title, category }),
      });
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Title</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Category</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <Button
                  type="button"
                  className="mt-2"
                  onClick={addDefaultCategories}
                >
                  Add Default Categories
                </Button>
              )}
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Adding..." : "Add Item"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddItem;
