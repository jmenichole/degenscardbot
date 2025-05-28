let cachedData = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000;
let apikey = process.env.LUMA_API_KEY;

async function handler() {
  const now = Date.now();

  if (cachedData && now - lastFetchTime < CACHE_DURATION) {
    return cachedData;
  }

  try {
    const response = await fetch(
      "https://api.lu.ma/public/v1/calendar/list-events",
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-luma-api-key": apikey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    cachedData = data;
    lastFetchTime = now;
    return data;
  } catch (error) {
    return {
      error: "Failed to fetch events",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}