// app/page.tsx
import LyricsForm from "@/components/LyricsForm";
import SpotifyAuthButton from "@/components/SpotifyAuthButton";
import GoogleAuthButton from "@/components/GoogleAuthButton";

export default function HomePage() {
  return (
    <main className="p-8">
      <div className="flex space-x-4 mb-4">
        <div className="flex-1">
          <SpotifyAuthButton />
        </div>
        <div className="flex-1">
          <GoogleAuthButton />
        </div>
      </div>
      <LyricsForm />
    </main>
  );
}
