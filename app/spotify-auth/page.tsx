// app/spotify-auth/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const SpotifyAuthPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Get the authorization code from the URL
    const code = new URLSearchParams(window.location.search).get("code");

    if (code) {
      // Function to exchange the code for an access token
      const exchangeCodeForToken = async () => {
        try {
          const response = await axios.post("/api/spotify-auth", { code });
          const { access_token } = response.data;

          // Store the token in local storage
          localStorage.setItem("spotify_access_token", access_token);

          // Redirect to the homepage or another page
          router.push("/"); // Change this to your desired route
        } catch (error) {
          console.error("Error exchanging code for token:", error);
          // Handle error accordingly (show a message, etc.)
        }
      };

      exchangeCodeForToken();
    }
  }, [router]);

  return <div>Loading...</div>; // Optional loading state while processing
};

export default SpotifyAuthPage;
