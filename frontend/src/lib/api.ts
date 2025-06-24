const API_URL = "https://sharesphere-2-0.onrender.com";

export const getToken = () => localStorage.getItem("token");

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }

  return res.json();
}

export const getAllItems = () => apiFetch("/items");
export const getItemById = (id: string) => apiFetch(`/items/${id}`);
export const getCategoryById = (id: string) => apiFetch(`/categories/${id}`);
export const getFeaturedItemById = (id: string) =>
  apiFetch(`/featured-items/${id}`);
export const getRequestById = (id: string) => apiFetch(`/requests/${id}`);
export const cancelRequest = (id: string) =>
  apiFetch(`/requests/${id}`, { method: "DELETE" });
export const getProfile = () => apiFetch("/auth/profile");

export interface UpdateProfileData {
  name: string;
  email: string;
  location?: string;
}

export const updateProfile = (data: UpdateProfileData) =>
  apiFetch("/auth/profile", { method: "PUT", body: JSON.stringify(data) });
