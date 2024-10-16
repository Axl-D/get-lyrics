"use client";

import { useState, useEffect } from "react";

export default function GoogleAuthButton() {
  const [token, setToken] = useState<string | null>(null);

  const clientId = "913181503739-s9sqaf5g5muatp89883g16plv5sn8luj.apps.googleusercontent.com";
  const redirectUri =
    (process.env.NODE_ENV === "development" ? "http://localhost:3000/" : "https://get-lyrics-ivory.vercel.app/") +
    "google-auth";

  const scopes = ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/documents"].join(" ");

  const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(
    scopes
  )}&redirect_uri=${encodeURIComponent(redirectUri)}&access_type=offline`;

  // Function to check for existing token in local storage
  useEffect(() => {
    const storedToken = localStorage.getItem("google_access_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Function to handle Google login
  const handleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <div className="google-auth">
      {!token ? (
        <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded">
          Connect to Google
        </button>
      ) : (
        <p>Connected to Google</p>
      )}
    </div>
  );
}
