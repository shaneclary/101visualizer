export type Transform = {
  x: number;  // center x in px
  y: number;  // center y in px
  widthPx: number; // scaled width in px (height derived by aspect)
  rotationDeg: number;
};

export async function compositeBaseWithOverlay(
  baseDataUrl: string,
  overlayDataUrl: string,
  aspectRatio: number,
  t: Transform
): Promise<string> {
  const base = await loadImage(baseDataUrl);
  const overlay = await loadImage(overlayDataUrl);

  const canvas = document.createElement("canvas");
  canvas.width = base.width;
  canvas.height = base.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(base, 0, 0);

  const w = t.widthPx;
  const h = w / aspectRatio;

  ctx.save();
  ctx.translate(t.x, t.y);
  ctx.rotate((t.rotationDeg * Math.PI) / 180);
  ctx.drawImage(overlay, -w / 2, -h / 2, w, h);
  ctx.restore();

  return canvas.toDataURL("image/png");
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}