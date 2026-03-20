export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const limit = Math.min(Number(searchParams.get("limit") || 20), 50); // Cap limit
    const offset = Math.max(Number(searchParams.get("offset") || 0), 0);
    const clientId = process.env.JAMENDO_CLIENT_ID;
    if (!clientId) {
      return Response.json({ success: false, error: "API key missing" }, { status: 500 });
    }

    const searchQuery = encodeURIComponent(query);
    const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=json&limit=${limit}&offset=${offset}&search=${searchQuery}`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Jamendo API error: ${res.status}`);
    }

    const data = await res.json();

    return Response.json({
      success: true,
      count: data.results?.length || 0,
      offset,
      limit,
      tracks: data.results || [],
    }, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    console.error("Music API error:", error);
    return Response.json({
      success: false,
      error: "Failed to fetch music tracks",
    }, { status: 500 });
  }
}
