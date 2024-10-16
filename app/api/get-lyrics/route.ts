// app/api/get-lyrics/route.ts
import { NextResponse } from "next/server";
import {
  findLyricsForTrack,
  // findLyricsForPlaylist,
  getGeniusLyricsUrl,
  scrapeLyricsFromGenius,
} from "../../scripts/get-lyrics.js";

import { copyTemplate } from "../../scripts/create-google-doc";

export async function POST(request: Request) {
  const { type, url, artist, track, spotifyAccessToken, googleAccessToken, templateId } = await request.json();

  // Call your backend method here with the input, for example:
  // const lyrics = await getLyricsFromBackend(input, type);

  // For now, mock a response:
  console.log(`getting lyrics for ${track} ${artist}`);

  var lyrics = "";
  if (type === "track") {
    const trackDetails = await findLyricsForTrack(spotifyAccessToken, url);
    lyrics = trackDetails?.lyrics ?? "";

    console.log(
      "token",
      googleAccessToken,
      "templateId",
      templateId,
      "track",
      `${trackDetails?.artistName} - ${trackDetails?.trackName}`
    );

    copyTemplate(googleAccessToken, templateId, `${trackDetails?.artistName} - ${trackDetails?.trackName}`);
  } else if (type === "manual") {
    lyrics = await scrapeLyricsFromGenius(await getGeniusLyricsUrl(track, artist));
  } else {
  }

  return NextResponse.json({ lyrics });
}
