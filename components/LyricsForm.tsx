"use client";

import { useState, useEffect } from "react";
import axios from "axios";

// Helper function to get a specific cookie by name
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};

export default function LyricsForm() {
  const [url, setUrl] = useState(
    "https://open.spotify.com/track/2KrN3MCNztKcSleZgHEj83?si=b9f223f056bd4896&nd=1&dlsi=92f2effe6fd143bc"
  );
  const [artist, setArtist] = useState(""); // For manual artist input
  const [track, setTrack] = useState(""); // For manual track input
  const [type, setType] = useState<"playlist" | "track" | "manual">("playlist");
  const [templateId, setTemplateId] = useState("1E34WLQKNi5OBRjVTrHHwsQ6K5XX1fya79-3ywXlvFgw");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [spotifyAccessToken, setSpotifyAccessToken] = useState<string | null>(null); // State for access token
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null); // State for access token

  const options = [
    { label: "Spotify Playlist", value: "playlist" },
    { label: "Spotify Track URL", value: "track" },
    { label: "Manual Input", value: "manual" },
  ];

  useEffect(() => {
    // Retrieve Spotify token from cookies
    const storedSToken = getCookie("spotify_access_token");
    setSpotifyAccessToken(storedSToken ?? "");

    // Retrieve Google token from local storage (if still using local storage for Google access token)
    const storedGToken = localStorage.getItem("google_access_token");
    setGoogleAccessToken(storedGToken);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let requestData;
      if (type === "manual") {
        requestData = { type, artist, track };
      } else {
        requestData = { type, url, spotifyAccessToken, googleAccessToken, templateId };
      }

      const response = await axios.post("/api/get-lyrics", requestData);
      setResult(response.data.lyrics); // Assuming response contains 'lyrics'
    } catch (err) {
      setResult(`Error fetching lyrics: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result).then(() => {
        alert("Lyrics copied to clipboard!");
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Get Lyrics</h1>
      <form className="space-y-4">
        <div className="flex border-b mb-4">
          {options.map((option) => (
            <span
              key={option.value}
              onClick={() => setType(option.value as "playlist" | "track" | "manual")}
              className={`p-2 flex-1 text-center cursor-pointer ${
                type === option.value ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {option.label}
            </span>
          ))}
        </div>

        {type === "manual" ? (
          <>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Enter Artist Name"
              className="p-2 w-full border border-gray-300"
            />
            <input
              type="text"
              value={track}
              onChange={(e) => setTrack(e.target.value)}
              placeholder="Enter Track Name"
              className="p-2 w-full border border-gray-300"
            />
          </>
        ) : (
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={type === "playlist" ? "Enter Spotify Playlist URL" : "Enter Spotify Track URL"}
            className="p-2 w-full border border-gray-300"
          />
        )}
        <input
          type="text"
          placeholder="Google Doc Lyrics Template Id"
          className="p-2 w-full border border-gray-300"
          defaultValue={"1E34WLQKNi5OBRjVTrHHwsQ6K5XX1fya79-3ywXlvFgw"}
          onChange={(e) => setTemplateId(e.target.value)}
        ></input>
        <button onClick={handleSubmit} className="p-2 bg-blue-600 text-white w-full" disabled={loading}>
          {loading ? "Fetching..." : "Get Lyrics"}
        </button>
      </form>

      {result && (
        <button
          onClick={handleCopyToClipboard}
          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Copy to Clipboard
        </button>
      )}
      {result && <div className="mt-4 p-4 bg-gray-100 whitespace-pre-wrap">{result}</div>}
    </div>
  );
}
