// localStorage の数値設定を読む。未設定や数値でない値のときは fallback を返す
// Number(null) は 0 になるので、null を先に弾く
export function parseNumberSetting(value: string | null, fallback: number): number {
  if (value === null || value.trim() === "") return fallback;
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}
