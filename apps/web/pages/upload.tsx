import { useState, useRef } from "react";

export default function UploadPage() {
  const [image, setImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  // simple mock preview overlay
  function addFireplace() {
    if (!image) return;
    const overlay = document.createElement("canvas");
    const base = new Image();
    base.src = image;
    base.onload = () => {
      overlay.width = base.width;
      overlay.height = base.height;
      const ctx = overlay.getContext("2d")!;
      ctx.drawImage(base, 0, 0);
      // demo placeholder rectangle (fireplace)
      ctx.fillStyle = "rgba(160,80,40,0.7)";
      const w = base.width * 0.4;
      const h = base.height * 0.25;
      ctx.fillRect(base.width / 2 - w / 2, base.height - h - 20, w, h);
      setPreview(overlay.toDataURL("image/png"));
    };
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4">📸 Upload Your Space</h1>

      {!image && (
        <button
          onClick={() => fileInput.current?.click()}
          className="bg-black text-white px-6 py-3 rounded-full text-lg"
        >
          Choose Photo
        </button>
      )}

      <input
        type="file"
        accept="image/*"
        ref={fileInput}
        onChange={handleFile}
        className="hidden"
      />

      {image && !preview && (
        <>
          <img
            src={image}
            alt="uploaded"
            className="w-full max-w-md rounded-lg shadow-md mb-4"
          />
          <button
            onClick={addFireplace}
            className="bg-amber-600 text-white px-6 py-2 rounded-lg"
          >
            Add Fireplace
          </button>
        </>
      )}

      {preview && (
        <>
          <img
            src={preview}
            alt="preview"
            className="w-full max-w-md rounded-lg shadow-lg mb-4"
          />
          <a
            href={preview}
            download="101visualizer-preview.png"
            className="underline text-blue-600"
          >
            Download Preview
          </a>
        </>
      )}
    </main>
  );
}