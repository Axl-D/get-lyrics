import { NextResponse } from "next/server";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function POST(request: Request) {
  const { code } = await request.json();
  const clientId = process.env.GOOGLE_CLIENT_ID; // Add your Google Client ID in .env
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET; // Add your Google Client Secret in .env
  const redirectUri =
    (process.env.NODE_ENV === "development" ? "http://localhost:3000/" : "https://get-lyrics-ivory.vercel.app/") +
    "google-auth"; // Match your redirect URI

  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", null, {
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
    console.error("Error exchanging code for token:", error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json({ error: error.response?.data || error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
