"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function SpotifyAuthButton() {
  const [token, setToken] = useState<string | null>(null);

  const clientId = "8f63907af9e64b928b302cef4b09f848";
  //   const redirectUri = "http://localhost:3000/";
  const redirectUri = "https://get-lyrics-ivory.vercel.app/";

  const scopes = [
    "user-read-private",
    "user-read-email",
    // Add other scopes as needed
  ].join(" ");

  const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(
    scopes
  )}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  // Function to check for existing token in local storage
  useEffect(() => {
    const storedToken = localStorage.getItem("spotify_access_token");
    if (storedToken) {
      setToken(storedToken);
    }

    // Check for authorization code in URL after redirect
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      getAccessToken(code); // Exchange code for access token
    }
  }, []);

  // Function to handle Spotify login
  const handleLogin = () => {
    window.location.href = SPOTIFY_AUTH_URL;
  };

  // After OAuth flow, exchange code for token
  const getAccessToken = async (code: string) => {
    try {
      const response = await axios.post("/api/spotify-auth", { code }); // Create this API route in Next.js
      const { access_token } = response.data;
      localStorage.setItem("spotify_access_token", access_token); // Store token in local storage
      setToken(access_token);
    } catch (error) {
      console.error("Error exchanging code for token:", error);
    }
  };

  return (
    <div className="spotify-auth">
      {!token ? (
        <button onClick={handleLogin} className="bg-green-500 text-white p-2 rounded">
          Connect to Spotify
        </button>
      ) : (
        <p>Connected to Spotify</p>
      )}
    </div>
  );
}
