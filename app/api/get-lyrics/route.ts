// app/api/get-lyrics/route.ts
import { NextResponse } from "next/server";
import {
  findLyricsForTrack,
  findLyricsForPlaylist,
  getGeniusLyricsUrl,
  scrapeLyricsFromGenius,
} from "../../scripts/get-lyrics.js";

export async function POST(request: Request) {
  const { type, url, artist, track, accessToken } = await request.json();

  // Call your backend method here with the input, for example:
  // const lyrics = await getLyricsFromBackend(input, type);

  // For now, mock a response:
  console.log(`getting lyrics for ${track} ${artist}`);
  const lyrics =
    type === "manual"
      ? await scrapeLyricsFromGenius(await getGeniusLyricsUrl(track, artist))
      : type === "track"
      ? (await findLyricsForTrack(accessToken, url))?.lyrics
      : `token = ${accessToken}`;
  console.log(lyrics);

  return NextResponse.json({ lyrics });
}
