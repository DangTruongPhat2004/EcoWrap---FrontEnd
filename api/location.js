/**
 * Vercel Serverless Function to proxy requests to provinces.open-api.vn
 * This avoids SSL certificate issues by handling requests server-side
 */

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Get the path after /api/location/
    const path = req.url.replace("/api/location", "");

    // Province API URL (HTTP - no SSL issues server-side)
    const apiUrl = `http://provinces.open-api.vn/api${path}`;

    console.log(`Proxying location request to: ${apiUrl}`);

    // Fetch from the API
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Get response data
    const data = await response.json();

    // Return the data
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Location proxy error:", error);
    res.status(500).json({
      error: "Location proxy error",
      message: error.message,
    });
  }
}
