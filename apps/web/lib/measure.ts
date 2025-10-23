export function distancePx(a: {x:number;y:number}, b:{x:number;y:number}) {
  const dx = a.x - b.x, dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

/** given two points in the photo and a known real length (inches), return pixels-per-inch */
export function computePPI(p1:{x:number;y:number}, p2:{x:number;y:number}, realInches:number) {
  const px = distancePx(p1, p2);
  return px / Math.max(0.01, realInches);
}