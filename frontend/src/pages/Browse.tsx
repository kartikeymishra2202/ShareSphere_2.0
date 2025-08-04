import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "@/lib/api"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Tag, Star, Heart, Package } from "lucide-react";


interface Item {
  _id: string;
  title: string;
  category: { _id: string; label: string };
  status: string;
}

interface Category {
  _id: string;
  label: string;
}


const ItemCard = ({ item }: { item: Item }) => {
  return (
    <Card className="w-full overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all duration-300 group shadow-lg hover:shadow-xl rounded-2xl">
      <div className="relative">
        
        <div className="h-56 bg-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <Package className="w-16 h-16 text-slate-400" />
        </div>
        <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-red-100 transition-colors">
          <Heart className="h-5 w-5 text-slate-600 hover:fill-red-500 hover:text-red-500" />
        </button>
      </div>
      <CardContent className="p-5">
        <h3 className="text-xl font-bold text-slate-800 truncate">
          {item.title}
        </h3>
        <p className="text-slate-500 text-sm mt-1">
          {item.category?.label || "Uncategorized"}
        </p>
        <div className="flex items-center mt-3 text-amber-500">
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 text-slate-300 fill-current" />
          <span className="text-xs text-slate-500 ml-2">(100+ ratings)</span>
        </div>
        <Link to={`/item/${item._id}`}>
          <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

const Browse = () => {
  
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  
  useEffect(() => {
    const fetchData = async () => {
      try {
      
        const [itemsData, categoriesData] = await Promise.all([
          apiFetch("/items"),
          apiFetch("/categories"),
        ]);
        setItems(itemsData);
        setCategories(categoriesData);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
       
        if (selectedCategory === "all") {
          return true;
        }
        return item.category?._id === selectedCategory;
      })
      .filter((item) => {
       
        return item.title.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [items, searchTerm, selectedCategory]);

  if (loading)
    return (
      <div className="p-8 text-center text-lg font-semibold">
        Loading community items...
      </div>
    );
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="bg-slate-50 min-h-screen">
 
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500"
          >
            Lendr
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/dashboard" className="hover:text-indigo-600">
              Dashboard
            </Link>
            <Link to="/browse" className="text-indigo-600 font-semibold">
              Browse
            </Link>
            <Link to="/profile" className="hover:text-indigo-600">
              Profile
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
       
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
            <div className="col-span-1 md:col-span-3 lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                What are you looking for?
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by item title..."
                  className="pl-10 h-12 text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category
              </label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="h-12 text-base">
                  <Tag className="h-5 w-5 text-slate-400 mr-2" />
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="lg:col-start-4">
              <Button className="w-full h-12 text-base bg-indigo-600 hover:bg-indigo-700">
                Search
              </Button>
            </div>
          </div>
        </div>

       
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Browse Community Items
          </h1>
          <p className="text-slate-500 mt-1">
            Found {filteredItems.length} available items for you.
          </p>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {filteredItems.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>

        {filteredItems.length === 0 && !loading && (
          <div className="text-center py-20 col-span-full">
            <h2 className="text-xl font-semibold text-slate-700">
              No items found
            </h2>
            <p className="text-slate-500 mt-2">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Browse;
