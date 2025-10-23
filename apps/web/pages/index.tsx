import Link from "next/link";

export default function Home() {
  return (
    <main style={{ fontFamily: "ui-sans-serif, system-ui", padding: "2rem", maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: 8 }}>🔥 101 Visualizer MVP</h1>
      <p style={{ color: "#444", marginBottom: 16 }}>
        Upload a photo, set scale with a known measurement, and drop in a fireplace to preview fit.
      </p>
      <Link href="/upload" className="inline-block bg-black text-white px-5 py-3 rounded">
        Get started → Upload
      </Link>
      <p style={{ marginTop: 24, fontSize: 12, color: "#666" }}>
        Tip: for the most accurate scale, include a known width (e.g., 36&rdquo; door) in your photo.
      </p>
    </main>
  );
}