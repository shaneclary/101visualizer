// One transparent SVG "fireplace" placeholder as a data URL (replace with PNGs later)
const FIREPLACE_SVG = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'>
    <rect x='150' y='220' width='500' height='220' fill='rgba(120,70,40,0.85)'/>
    <rect x='150' y='200' width='500' height='30' fill='rgba(90,50,30,0.9)'/>  <!-- mantle -->
    <rect x='170' y='250' width='120' height='190' fill='rgba(90,50,30,0.95)'/> <!-- left leg -->
    <rect x='510' y='250' width='120' height='190' fill='rgba(90,50,30,0.95)'/> <!-- right leg -->
    <rect x='320' y='270' width='160' height='120' fill='black' fill-opacity='0.7'/> <!-- firebox -->
  </svg>`
);

export type StyleItem = {
  id: string;
  name: string;
  minWidthIn: number;  // manufacturable constraints (inches)
  maxWidthIn: number;
  aspectRatio: number; // width/height for consistent scaling
  imageDataUrl: string; // data URL or https to transparent PNG
};

export const STYLES: StyleItem[] = [
  {
    id: "mantel-placeholder",
    name: "Mantel – Placeholder",
    minWidthIn: 48,
    maxWidthIn: 100,
    aspectRatio: 800 / 500,
    imageDataUrl: `data:image/svg+xml;charset=utf-8,${FIREPLACE_SVG}`
  }
  // add real items later
];