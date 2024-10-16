// app/api/spotify-auth/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function POST(request: Request) {
  const { code } = await request.json();
  const clientId = process.env.SPOTIFY_CLIENT_ID; // Ensure you set this in your .env file
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET; // Ensure you set this in your .env file
  const redirectUri =
    (process.env.NODE_ENV === "development" ? "http://localhost:3000/" : "https://get-lyrics-ivory.vercel.app/") +
    "spotify-auth"; // Ensure you set this in your .env file

  try {
    const response = await axios.post("https://accounts.spotify.com/api/token", null, {
      params: {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    // Check if the error is an AxiosError
    if (axios.isAxiosError(error)) {
      console.error("Error exchanging code for token:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
  }
}
