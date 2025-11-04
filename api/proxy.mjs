/**
 * Vercel Serverless Function to proxy requests to the backend API
 * This avoids Mixed Content errors by handling HTTP requests server-side
 * Handles all API routes except location (which has its own function)
 */

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Get the path after /api/proxy
    const url = new URL(req.url, `https://${req.headers.host}`);
    const path = url.pathname.replace("/api/proxy", "");
    const queryString = url.search;

    // Backend API URL - path already includes /api/ prefix
    const backendUrl = `http://14.225.205.215${path}${queryString}`;

    console.log(`Proxying ${req.method} request to: ${backendUrl}`);

    // Build headers for the backend request
    const headers = {};

    // Forward authorization header
    if (req.headers["authorization"]) {
      headers["Authorization"] = req.headers["authorization"];
    }

    // Forward content-type if present (important for multipart/form-data)
    if (req.headers["content-type"]) {
      headers["Content-Type"] = req.headers["content-type"];
    }

    // Prepare request body
    let body = undefined;
    if (req.method !== "GET" && req.method !== "HEAD") {
      // For JSON requests, stringify the body
      if (headers["Content-Type"]?.includes("application/json")) {
        body = JSON.stringify(req.body);
      } else {
        // For other content types (like form-data), pass body as-is
        body = req.body;
      }
    }

    // Forward the request to the backend
    const response = await fetch(backendUrl, {
      method: req.method,
      headers: headers,
      body: body,
    });

    // Get response data
    const contentType = response.headers.get("content-type");

    // Handle JSON responses
    if (contentType?.includes("application/json")) {
      const data = await response.json();
      return res.status(response.status).json(data);
    }

    // Handle text responses
    const data = await response.text();
    return res.status(response.status).send(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({
      error: "Proxy error",
      message: error.message,
    });
  }
}
