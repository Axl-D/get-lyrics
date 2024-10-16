import fetch from "node-fetch";
import * as cheerio from "cheerio";
import "dotenv/config";
// import { createLyricsDoc } from "./create-google-doc.ts";

// 0. Get Spotify Access token
async function getSpotifyToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${process.env.SPOTIFY_ACCESS_TOKEN}`, // Basic Auth
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error(`Error fetching token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token; // This is the Bearer token you’ll use
}

// 0.1 extract track/playlist Id from a spotify url
function extractSpotifyId(url) {
  const match = url.match(/(?:playlist|track)\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

// 1.0 Fetch spotify playlist
// async function getSpotifyPlaylistTracks(accessToken, playlistId) {
//   const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });
//   const data = await response.json();
//   return data.items.map((item) => ({
//     trackName: item.track.name,
//     artistName: item.track.artists[0].name,
//   }));
// }

// 1.1 Get song info from Spotify (Spotify access token is needed)
async function getSpotifyTrackInfo(accessToken, trackId) {
  const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data || !data.name || !data.artists || data.artists.length === 0) {
    throw new Error("Invalid Spotify track data");
  }

  return {
    trackName: data.name,
    artistName: data.artists[0].name,
  };
}

// 2. Fetch the Genius URL for the song
export async function getGeniusLyricsUrl(trackName, artistName) {
  const response = await fetch(`https://api.genius.com/search?q=${trackName} ${artistName}`, {
    headers: {
      Authorization: `Bearer ${process.env.GENIUS_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Genius API error: ${response.statusText}`);
  }

  const data = await response.json();

  // Check if hits exist and if it's an array
  if (!data || !data.response || !Array.isArray(data.response.hits) || data.response.hits.length === 0) {
    throw new Error("No Genius lyrics found for this track.");
  }

  // Return the first hit's URL
  const lyricsUrl = data.response.hits[0].result.url;
  return lyricsUrl;
}

// 3. Scrape the lyrics from the Genius page
export async function scrapeLyricsFromGenius(lyricsUrl) {
  const response = await fetch(lyricsUrl);

  if (!response.ok) {
    throw new Error(`Error scraping Genius page: ${response.statusText}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Genius uses a <div> with a unique class to display the lyrics
  const lyricsContainer = $('div[class^="Lyrics__Container"]');

  // Initialize an empty string to hold formatted lyrics
  let lyrics = "";

  // Iterate over the container's child elements
  lyricsContainer.each((i, elem) => {
    $(elem)
      .contents()
      .each((i, el) => {
        // Add line breaks for <br> elements
        if (el.tagName === "br") {
          lyrics += "\n";
        }
        // Add a new paragraph for block elements (like divs that separate verses)
        else if (el.tagName === "div") {
          lyrics += "\n\n";
        }
        // Otherwise, append the text content
        else {
          lyrics += $(el).text();
        }
      });
  });

  // Return the lyrics with the original structure
  return lyrics.trim();
}

// 4. Full flow: Get the lyrics for a Spotify track
export async function findLyricsForTrack(accessToken, trackUrl) {
  try {
    const trackId = extractSpotifyId(trackUrl);

    // Get track metadata from Spotify

    if (accessToken == null) {
      accessToken = await getSpotifyToken();
    }

    const { trackName, artistName } = await getSpotifyTrackInfo(accessToken, trackId);
    console.log(`Track: ${trackName}, Artist: ${artistName}`);

    // Get Genius lyrics URL
    const lyricsUrl = await getGeniusLyricsUrl(trackName, artistName);
    console.log(`Scraping lyrics from: ${lyricsUrl}`);

    // Scrape the lyrics
    const lyrics = await scrapeLyricsFromGenius(lyricsUrl);
    // console.log("Lyrics:", lyrics);
    return { lyrics: lyrics, artistName: artistName, trackName: trackName };
  } catch (error) {
    console.error("Error fetching lyrics:", error.message);
  }
}

// export async function findLyricsForPlaylist(playlistUrl) {
//   try {
//     const playlistId = extractSpotifyId(playlistUrl);

//     const accessToken = await getSpotifyToken();
//     const tracks = await getSpotifyPlaylistTracks(accessToken, playlistId);

//     for (var i = 0; i < tracks.length; i++) {
//       try {
//         const lyricsUrl = await getGeniusLyricsUrl(tracks[i].trackName, tracks[i].artistName);
//         const lyrics = await scrapeLyricsFromGenius(lyricsUrl);
//         tracks[i].lyricsUrl = lyricsUrl;
//         tracks[i].lyrics = lyrics;

//         const templateId = "1E34WLQKNi5OBRjVTrHHwsQ6K5XX1fya79-3ywXlvFgw";
//         await createLyricsDoc(tracks[i].artistName, tracks[i].trackName, tracks[i].lyrics, templateId);
//       } catch (error) {
//         console.log("no lyrics found for ", tracks[i].trackName, tracks[i].artistName);
//         tracks[i].lyricsUrl = null;
//         tracks[i].lyrics = null;
//       }
//     }
//     return tracks;
//   } catch (error) {
//     console.error("Error while processing playlist:", error.message);
//   }
// }
