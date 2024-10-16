"use client";

import { useState } from "react";
import axios from "axios";

export default function LyricsForm() {
  const [url, setUrl] = useState("");
  const [artist, setArtist] = useState(""); // For manual artist input
  const [track, setTrack] = useState(""); // For manual track input
  const [type, setType] = useState<"playlist" | "track" | "manual">("playlist");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const options = [
    { label: "Spotify Playlist", value: "playlist" },
    { label: "Spotify Track URL", value: "track" },
    { label: "Manual Input", value: "manual" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let requestData;
      if (type === "manual") {
        requestData = { type, artist, track };
      } else {
        const accessToken = localStorage.getItem("spotify_access_token");
        requestData = { type, url, accessToken };
      }

      const response = await axios.post("/api/get-lyrics", requestData);
      setResult(response.data.lyrics); // Assuming response contains 'lyrics'
    } catch (err) {
      setResult("Error fetching lyrics.");
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
