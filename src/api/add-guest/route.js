async function handler(request) {
  const apiKey = process.env.LUMA_API_KEY;

  const { email, name, event_api_id } = await request;

  if (!email || !name || !event_api_id) {
    return {
      error:
        "Missing required fields: email, name, and event_api_id are required",
    };
  }

  try {
    const response = await fetch(
      "https://api.lu.ma/public/v1/event/add-guests",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "x-luma-api-key": apiKey,
        },
        body: JSON.stringify({
          guests: [
            {
              email,
              name,
            },
          ],
          event_api_id,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      error: "Failed to add guest",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}