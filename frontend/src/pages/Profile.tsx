import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  location?: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", location: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getProfile().then((data) => {
      setProfile(data);
      setForm({
        name: data.name,
        email: data.email,
        location: data.location || "",
      });
      if (data._id && !localStorage.getItem("userId")) {
        localStorage.setItem("userId", data._id);
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await updateProfile(form);
      setSuccess("Profile updated!");
      setEdit(false);
      setProfile({ ...profile, ...form });
    } catch {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-md mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {edit ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Location</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {success && (
                <div className="text-green-600 text-sm">{success}</div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </form>
          ) : (
            <div className="space-y-2">
              <div>
                <span className="font-medium">Name:</span> {profile.name}
              </div>
              <div>
                <span className="font-medium">Email:</span> {profile.email}
              </div>
              <div>
                <span className="font-medium">Location:</span>{" "}
                {profile.location || "-"}
              </div>
              <Button className="mt-4 w-full" onClick={() => setEdit(true)}>
                Edit Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
