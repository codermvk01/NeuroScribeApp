import * as SecureStore from "expo-secure-store";

/* =========================
   API CONFIG
========================= */

const API_BASE_URL = "http://192.168.1.105:5000/api";

const getToken = async () => {
  return await SecureStore.getItemAsync("authToken");
};

/* =========================
   AUTH APIs
========================= */

export const signup = async (data: {
  name: string;
  email: string;
  password: string;
  aadhaar: string;
  phone: string;
  age?: string;
  locality?: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }

  return json;
};


export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data; // contains token
};

/* =========================
   AUTHORIZED FETCH (JWT)
========================= */

export const authorizedFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = await getToken();

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
};

/* =========================
   EXISTING AUDIO UPLOAD
   (UNCHANGED)
========================= */

export async function uploadAudio(uri: string, metadata: object) {
  const formData = new FormData();
  formData.append("file", {
    uri,
    name: "voice-test.wav",
    type: "audio/wav",
  } as any);
  formData.append("metadata", JSON.stringify(metadata));

  const API_URL = "https://your-backend.com/api/upload"; // Replace later

  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to upload");
  }

  return response.json();
}
