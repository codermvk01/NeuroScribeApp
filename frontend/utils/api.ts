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
    name: "voice.m4a",
    type: "audio/m4a",
  } as any);

  formData.append("metadata", JSON.stringify(metadata));

  const response = await authorizedFetch("/tests/voice/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Upload failed");
  }

  return response.json();
}

export async function uploadPicture(uri: string, metadata: object) {
  const formData = new FormData();

  formData.append("file", {
    uri,
    name: "drawing.jpg",
    type: "image/jpeg",
  } as any);

  formData.append("metadata", JSON.stringify(metadata));

  const response = await authorizedFetch("/tests/picture/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Upload failed");
  }

  return response.json();
}
