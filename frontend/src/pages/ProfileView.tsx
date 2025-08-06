import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProfile, updateProfile, apiFetch } from "@/lib/api";
import { MapPin, Mail, Edit, Save, X, Package, Star, User } from "lucide-react";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  location?: string;
}

interface Item {
  _id: string;
  title: string;
  category: { label: string };
  status: string;
}

export default function ProfileView() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    location: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [profileData, itemsData] = await Promise.all([
          getProfile(),
          apiFetch("/items/mine"),
        ]);

        setProfile(profileData);
        setMyItems(itemsData);
        setFormState({
          name: profileData.name,
          email: profileData.email,
          location: profileData.location || "",
        });
        if (profileData._id && !localStorage.getItem("userId")) {
          localStorage.setItem("userId", profileData._id);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch profile data.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updatedProfile = await updateProfile(formState);
      setProfile(updatedProfile);
      setEditMode(false);
      toast({
        title: "Success!",
        description: "Your profile has been updated.",
        className: "bg-green-100 text-green-800",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    if (profile) {
      setFormState({
        name: profile.name,
        email: profile.email,
        location: profile.location || "",
      });
    }
  };

  if (isLoading)
    return (
      <div className="p-8 text-center text-lg font-semibold">
        Loading Profile...
      </div>
    );

  if (!profile)
    return (
      <div className="p-8 text-center text-red-500">
        Could not load profile.
      </div>
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <Card className="w-full rounded-2xl shadow-lg overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-indigo-400 to-violet-500"></div>
          <div className="px-6 pb-6">
            <div className="flex justify-between items-start -mt-16">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-300 flex items-center justify-center shadow-md">
                <User className="w-16 h-16 text-slate-500" />
              </div>
              <div className="pt-16">
                {editMode ? (
                  <div className="flex gap-2">
                    <Button onClick={handleSaveChanges} disabled={isSaving}>
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      <X className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setEditMode(true)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit Profile
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-4">
              {editMode ? (
                <Input
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  className="text-3xl font-bold h-12"
                />
              ) : (
                <h1 className="text-3xl font-bold text-slate-800">
                  {profile.name}
                </h1>
              )}
              <div className="flex items-center gap-2 mt-2 text-slate-500">
                <MapPin className="h-5 w-5" />
                {editMode ? (
                  <Input
                    name="location"
                    value={formState.location}
                    onChange={handleInputChange}
                    placeholder="Your Location"
                    className="h-9"
                  />
                ) : (
                  <p>{profile.location || "Location not set"}</p>
                )}
              </div>
              <div className="flex items-center gap-4 mt-4 text-sm text-slate-600">
                <span>
                  <strong className="text-slate-800">{myItems.length}</strong>{" "}
                  Items Lent
                </span>
                <span>
                  <strong className="text-slate-800">4.8</strong> Community
                  Rating
                </span>
              </div>
            </div>
          </div>
        </Card>
        <Card className="w-full rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Your Listed Items</CardTitle>
          </CardHeader>
          <CardContent>
            {myItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myItems.map((item) => (
                  <div
                    key={item._id}
                    className="border rounded-lg p-4 flex items-center gap-4"
                  >
                    <div className="bg-slate-100 p-3 rounded-md">
                      <Package className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-slate-500">
                        {item.category.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 py-8">
                You haven't listed any items yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1 space-y-8">
        <Card className="w-full rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 mt-1 text-slate-400 flex-shrink-0" />
              {editMode ? (
                <Input
                  name="email"
                  value={formState.email}
                  onChange={handleInputChange}
                />
              ) : (
                <div>
                  <p className="text-sm font-semibold">Email</p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-indigo-600 hover:underline"
                  >
                    {profile.email}
                  </a>
                </div>
              )}
            </div>
            <div className="flex items-start gap-3">
              <Star className="h-5 w-5 mt-1 text-slate-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold">Community Standing</p>
                <p className="text-slate-600">Top Rated Lender</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
