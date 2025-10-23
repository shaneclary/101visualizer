import { useEffect, useRef, useState } from "react";
import { compositeBaseWithOverlay, Transform } from "@/lib/composite";

type Props = {
  baseImage: string; // uploaded room
  overlayImage: string; // fireplace PNG/SVG
  aspectRatio: number;  // overlay aspect ratio (w/h)
  minWidthIn: number;
  maxWidthIn: number;
  ppi: number;          // pixels per inch from calibration
  onComposite: (dataUrl: string) => void;
};

export default function OverlayEditor({
  baseImage, overlayImage, aspectRatio, minWidthIn, maxWidthIn, ppi, onComposite
}: Props) {
  const [t, setT] = useState<Transform>({ x: 0, y: 0, widthPx: 400, rotationDeg: 0 });
  const [baseDims, setBaseDims] = useState<{w:number;h:number}>({ w: 0, h: 0 });
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setBaseDims({ w: img.width, h: img.height });
      // start near bottom center
      setT(s => ({ ...s, x: img.width / 2, y: img.height * 0.75, widthPx: Math.min(img.width * 0.6, ppi * maxWidthIn) }));
    };
    img.src = baseImage;
  }, [baseImage, ppi, maxWidthIn]);

  function pxToIn(px:number){ return px / Math.max(1e-6, ppi); }
  function clampWidthPx(w:number){
    return Math.min(Math.max(w, ppi * minWidthIn), ppi * maxWidthIn);
  }

  async function makeComposite() {
    const url = await compositeBaseWithOverlay(baseImage, overlayImage, aspectRatio, t);
    onComposite(url);
  }

  // drag
  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const target = e.currentTarget;
    (target as any).setPointerCapture(e.pointerId);
    const start = { x: e.clientX, y: e.clientY, t0: { ...t } };
    function move(ev: PointerEvent){
      const dx = ev.clientX - start.x;
      const dy = ev.clientY - start.y;
      setT(prev => ({ ...prev, x: start.t0.x + dx, y: start.t0.y + dy }));
    }
    function up(ev: PointerEvent){
      (target as any).releasePointerCapture(e.pointerId);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  return (
    <div className="w-full max-w-md">
      <div className="relative w-full overflow-hidden rounded-lg shadow" style={{ touchAction: "none" }} onPointerDown={onPointerDown}>
        <img ref={imgRef} src={baseImage} className="w-full block select-none" alt="room" />
        {/* overlay proxy for user feedback */}
        {baseDims.w > 0 && (
          <div
            className="absolute border-2 border-amber-600 bg-amber-600/20 rounded"
            style={{
              width: t.widthPx * (400 / baseDims.w), // scale to CSS size (rough)
              height: (t.widthPx / aspectRatio) * (400 / baseDims.w),
              left: (t.x - t.widthPx / 2) * (400 / baseDims.w),
              top: (t.y - (t.widthPx / aspectRatio) / 2) * (400 / baseDims.w)
            }}
          />
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm">Width (in)</label>
          <input
            type="range"
            min={minWidthIn}
            max={maxWidthIn}
            step={0.5}
            value={pxToIn(t.widthPx)}
            onChange={(e) => setT(prev => ({ ...prev, widthPx: clampWidthPx(parseFloat(e.target.value) * ppi) }))}
            className="w-full"
          />
          <div className="text-xs text-gray-600">{pxToIn(t.widthPx).toFixed(1)} in</div>
        </div>
        <div>
          <label className="text-sm">Rotation (°)</label>
          <input
            type="range"
            min={-5}
            max={5}
            step={0.1}
            value={t.rotationDeg}
            onChange={(e) => setT(prev => ({ ...prev, rotationDeg: parseFloat(e.target.value) }))}
            className="w-full"
          />
          <div className="text-xs text-gray-600">{t.rotationDeg.toFixed(1)}°</div>
        </div>
      </div>

      <button onClick={makeComposite} className="mt-3 w-full bg-black text-white py-2 rounded">
        Generate Preview
      </button>
    </div>
  );
}