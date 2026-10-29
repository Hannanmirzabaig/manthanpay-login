
// Backend URL
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
).replace(/\/+$/, "");

// Common API request function
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("manthanpayAuthToken");

  // Auth APIs are public
  const isAuthEndpoint = endpoint.split("?")[0].startsWith("/api/auth/");

  const headers = new Headers(options.headers || {});

  headers.set("Accept", "application/json");

  const isFormData =
    typeof FormData !== "undefined" &&
    options.body instanceof FormData;

  const isPlainObject =
    options.body !== null &&
    typeof options.body === "object" &&
    !isFormData &&
    (Object.getPrototypeOf(options.body) === Object.prototype ||
      Object.getPrototypeOf(options.body) === null);

  // Convert JavaScript object into JSON string
  if (isPlainObject) {
    headers.set("Content-Type", "application/json");
  }

  // Send JWT only with protected APIs
  if (!isAuthEndpoint && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const requestBody = isPlainObject
    ? JSON.stringify(options.body)
    : options.body;

  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
    body: requestBody,
  });

  const responseText = await response.text();

  let data = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }
  }

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;

    if (typeof data === "string" && data.trim()) {
      message = data;
    } else if (data && typeof data === "object") {
      message = data.message || data.error || message;
    } else if (response.statusText) {
      message = `${message} ${response.statusText}`;
    }

    throw new Error(message);
  }

  return data;
}

// DASHBOARD APIs

export function getDashboardStats() {
  return apiRequest("/api/admin/dashboard");
}

export function getTransactions() {
  return apiRequest("/api/admin/transactions");
}

export function getUsers() {
  return apiRequest("/api/admin/users");
}

export function getAgents() {
  return apiRequest("/api/admin/agents");
}

export function getSettlements() {
  return apiRequest("/api/admin/settlements");
}

export function getServices() {
  return apiRequest("/api/admin/services");
}

export function getReports() {
  return apiRequest("/api/admin/reports");
}

export function getMoneyTransfer() {
  return apiRequest("/api/admin/money-transfers");
}

export function getRefunds() {
  return apiRequest("/api/admin/refunds");
}
