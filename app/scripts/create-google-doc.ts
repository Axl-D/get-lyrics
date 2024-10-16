import { google } from "googleapis";

export async function copyTemplate(googleAccessToken: string, templateId: string, newDocName: string) {
  // Initialize the OAuth2 client with the access token
  const authClient = new google.auth.OAuth2();
  authClient.setCredentials({
    access_token: googleAccessToken,
  });

  // Create a Google Drive API client
  const drive = google.drive({ version: "v3", auth: authClient });

  try {
    // Copy the template file
    const copy = await drive.files.copy({
      fileId: templateId,
      requestBody: {
        name: newDocName,
      },
    });

    return copy.data.id;
  } catch (error) {
    console.error("Error copying Google Doc template:", error);
    throw error;
  }
}

// Step 4: Insert lyrics into Google Docs template
// async function insertLyricsToGoogleDoc(googleAccessToken: string, docId: string, lyrics: string) {
//   const authClient = new google.auth.OAuth2();
//   authClient.setCredentials({
//     access_token: googleAccessToken,
//   });
//   const docs = google.docs({ version: "v1", auth: authClient });

//   // Example: Replace the placeholder "{{lyrics}}" in the template with actual lyrics
//   await docs.documents.batchUpdate({
//     documentId: docId,
//     requestBody: {
//       requests: [
//         {
//           replaceAllText: {
//             containsText: {
//               text: "{{lyrics}}",
//               matchCase: true,
//             },
//             replaceText: lyrics,
//           },
//         },
//       ],
//     },
//   });

//   console.log("Lyrics inserted into Google Doc.");
// }

// Step 5: Main function to authenticate and call the Docs API

// export async function createLyricsDoc(artistName, trackName, lyrics, templateId) {
//   fs.readFile("credentials.json", (err, content) => {
//     if (err) return console.log("Error loading client secret file:", err);
//     authorize(JSON.parse(content), async (auth) => {
//       try {
//         // Create a new document by copying the template
//         const newDocName = `${artistName} - ${trackName}`;
//         const newDocId = await copyTemplate(auth, templateId, newDocName);

//         insertLyricsToGoogleDoc(auth, newDocId, lyrics);
//       } catch (error) {
//         console.error("Error during Google Doc creation or update:", error);
//       }
//     });
//   });
// }
