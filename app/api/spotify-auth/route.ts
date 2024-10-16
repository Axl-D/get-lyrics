// app/api/spotify-auth/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  const { code } = await request.json(); // Use request.json() to parse the JSON body

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = "http://localhost:3000/"; // Replace with your actual redirect URI

  const tokenUrl = "https://accounts.spotify.com/api/token";

  try {
    const response = await axios.post(
      tokenUrl,
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId || "", // Default to empty string if undefined
        client_secret: clientSecret || "", // Default to empty string if undefined
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;

    // Return the tokens in the response using NextResponse
    return NextResponse.json({ access_token, refresh_token, expires_in });
  } catch (error) {
    console.error("Error exchanging code for tokens:", error); // Log the error for debugging
    return NextResponse.json({ error: "Failed to exchange code for tokens" }, { status: 500 });
  }
}
``;
