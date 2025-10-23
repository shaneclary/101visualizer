import { useState } from "react";
import { computePPI } from "@/lib/measure";

type Props = {
  image: string; // base64
  onCalibrated: (ppi: number) => void;
};

export default function ReferencePicker({ image, onCalibrated }: Props) {
  const [p1, setP1] = useState<{x:number;y:number} | null>(null);
  const [p2, setP2] = useState<{x:number;y:number} | null>(null);
  const [real, setReal] = useState<string>("60"); // default 60 inches (door width-ish)

  function onClick(e: React.MouseEvent<HTMLDivElement>) {
    const r = (e.target as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    if (!p1) setP1({x,y});
    else setP2({x,y});
  }

  const ready = p1 && p2 && parseFloat(real) > 0;

  function confirm() {
    if (!ready || !p1 || !p2) return;
    const ppi = computePPI(p1, p2, parseFloat(real));
    onCalibrated(ppi);
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-2 text-sm text-gray-700">
        Tap two points spanning a known real-world length (e.g., door width), then enter inches.
      </div>
      <div
        className="relative w-full overflow-hidden rounded-lg shadow"
        onClick={onClick}
        style={{ touchAction: "manipulation" }}
      >
        <img src={image} className="w-full block" alt="ref" />
        {p1 && (
          <div className="absolute w-3 h-3 bg-red-600 rounded-full" style={{ left: p1.x - 6, top: p1.y - 6 }} />
        )}
        {p2 && (
          <div className="absolute w-3 h-3 bg-blue-600 rounded-full" style={{ left: p2.x - 6, top: p2.y - 6 }} />
        )}
        {p1 && p2 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="yellow" strokeWidth="2" />
          </svg>
        )}
      </div>

      <div className="flex items-center gap-2 mt-2">
        <label className="text-sm">Real length (in):</label>
        <input
          className="border rounded px-2 py-1 w-24"
          inputMode="decimal"
          value={real}
          onChange={(e) => setReal(e.target.value)}
        />
        <button
          onClick={confirm}
          disabled={!ready}
          className="ml-auto bg-black text-white px-3 py-2 rounded disabled:opacity-40"
        >
          Set scale
        </button>
      </div>
    </div>
  );
}