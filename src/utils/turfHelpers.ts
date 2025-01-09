export function isValidBbox(bbox: number[]): boolean {
  return bbox.every((coord) => Number.isFinite(coord));
}
