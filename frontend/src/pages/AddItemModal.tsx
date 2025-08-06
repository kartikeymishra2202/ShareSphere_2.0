import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { apiFetch } from "@/lib/api";
import type { Category } from "./types";

interface AddItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemAdded: () => void;
}

export const AddItemModal = ({
  open,
  onOpenChange,
  onItemAdded,
}: AddItemModalProps) => {
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
              {loading ? "Adding..." : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
