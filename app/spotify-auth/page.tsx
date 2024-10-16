"use client";
import { useEffect, useRef } from "react"; // Import useRef
import { useRouter } from "next/navigation";
import axios from "axios";

const SpotifyAuthPage = () => {
  const router = useRouter();
  const hasTokenBeenExchanged = useRef(false); // Use useRef to track token exchange

  useEffect(() => {
    // Get the authorization code from the URL
    const code = new URLSearchParams(window.location.search).get("code");
    console.log("code", code);

    // Check if the code exists and if the token has not been exchanged
    if (code && !hasTokenBeenExchanged.current) {
      // Function to exchange the code for an access token
      const exchangeCodeForToken = async () => {
        try {
          const response = await axios.post("/api/spotify-auth", { code });
          const { access_token } = response.data;

          // Store the token in local storage
          localStorage.setItem("spotify_access_token", access_token);

          // Clean up the URL to prevent re-triggering the token exchange
          window.history.replaceState({}, document.title, window.location.pathname);

          // Set the flag to indicate that the token exchange has occurred
          hasTokenBeenExchanged.current = true;

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
