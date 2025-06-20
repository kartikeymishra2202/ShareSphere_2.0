const API_URL = "http://localhost:5000/api";

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
