import { toast } from "sonner";

const API_URL = "https://sharesphere-2-0.onrender.com/api";

const REQUEST_TIMEOUT = 60000;
const LONG_REQUEST_THRESHOLD = 5000;
const SPIN_UP_TOAST_ID = "server-spin-up";

export const getToken = () => localStorage.getItem("token");

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT);

  const loadingToastTimerId = setTimeout(() => {
    toast.loading("Our server is spinning up... Please wait a moment!", {
      id: SPIN_UP_TOAST_ID,
    });
  }, LONG_REQUEST_THRESHOLD);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    return res.json();
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.error("Request timeout");
      toast.error("The request timed out. Please try again.", {
        id: "timeout-error",
      });
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
    clearTimeout(loadingToastTimerId);
    toast.dismiss(SPIN_UP_TOAST_ID);
  }
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
