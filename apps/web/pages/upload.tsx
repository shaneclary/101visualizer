import { useRef, useState } from "react";
import ReferencePicker from "@/components/ReferencePicker";
import OverlayEditor from "@/components/OverlayEditor";
import { STYLES } from "@/lib/catalog";

export default function UploadPage() {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [ppi, setPpi] = useState<number | null>(null);
  const [styleId, setStyleId] = useState<string>(STYLES[0].id);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onloadend = () => setImage(r.result as string);
    r.readAsDataURL(f);
  }

  const style = STYLES.find(s => s.id === styleId)!;

  return (
    <main className="min-h-screen bg-gray-50" style={{ fontFamily: "ui-sans-serif, system-ui" }}>
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-3">📸 Upload & Calibrate</h1>

        {!image && (
          <button onClick={() => fileInput.current?.click()} className="bg-black text-white px-5 py-3 rounded">
            Choose Photo
          </button>
        )}
        <input type="file" accept="image/*" ref={fileInput} onChange={handleFile} className="hidden" />

        {image && ppi === null && (
          <div className="mt-4">
            <ReferencePicker image={image} onCalibrated={setPpi} />
          </div>
        )}

        {image && ppi !== null && !preview && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm mb-1">Fireplace style</label>
              <select
                value={styleId}
                onChange={(e) => setStyleId(e.target.value)}
                className="border rounded px-3 py-2 w-full bg-white"
              >
                {STYLES.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <OverlayEditor
              baseImage={image}
              overlayImage={style.imageDataUrl}
              aspectRatio={style.aspectRatio}
              minWidthIn={style.minWidthIn}
              maxWidthIn={style.maxWidthIn}
              ppi={ppi}
              onComposite={(url) => setPreview(url)}
            />
          </div>
        )}

        {preview && (
          <div className="mt-6">
            <img src={preview} alt="preview" className="w-full rounded shadow" />
            <div className="flex gap-3 mt-3">
              <a className="bg-amber-600 text-white px-4 py-2 rounded" href={preview} download="101visualizer-preview.png">
                Download Preview
              </a>
              <button className="px-4 py-2 border rounded" onClick={() => setPreview(null)}>
                Back & adjust
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}