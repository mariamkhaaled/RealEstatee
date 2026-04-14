const API_BASE = "http://localhost:5000/api";

export interface FetchOptions extends Omit<RequestInit, "body" | "headers"> {
  body?: { [key: string]: any };
  headers?: { [key: string]: string };
  skipErrorHandler?: boolean;
}

export interface ApiResponse<T = any> {
  status: string;
  message: string;
  data?: T;
  token?: string;
}

export const fetchWrapper = async <T = any>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> => {
  const {
    method = "GET",
    headers: customHeaders = {},
    body,
    skipErrorHandler = false,
    ...restOptions
  } = options;

  const url = `${API_BASE}${endpoint}`;

  // تجميع الـ Headers بشكل نظيف
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      ...restOptions,
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status}`);
    }

    return data;
  } catch (error: any) {
    const message = error?.message || "An unexpected error occurred";

    if (!skipErrorHandler) {
      console.error("API Error:", message);
      // هنا مريم ممكن تزود toast.error(message) عشان تظهر لليوزر
    }

    throw new Error(message);
  }
};
