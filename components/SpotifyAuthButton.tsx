"use client";

import { useState, useEffect } from "react";

export default function SpotifyAuthButton() {
  const [token, setToken] = useState<string | null>(null);

  const clientId = "8f63907af9e64b928b302cef4b09f848";
  const redirectUri =
    (process.env.NODE_ENV === "development" ? "http://localhost:3000/" : "https://get-lyrics-ivory.vercel.app/") +
    "spotify-auth";

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
  }, []);

  // Function to handle Spotify login
  const handleLogin = () => {
    window.location.href = SPOTIFY_AUTH_URL;
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
