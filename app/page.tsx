// app/page.tsx
import LyricsForm from "@/components/LyricsForm";
import SpotifyAuthButton from "@/components/SpotifyAuthButton";

export default function HomePage() {
  return (
    <main className="p-8">
      <SpotifyAuthButton />
      <LyricsForm />
    </main>
  );
}
