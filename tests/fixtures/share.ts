// リファクタ前の rouletteShare.client.ts と同じ処理（LZString で [{n, c, r}] を圧縮）で生成した ?q= の値。
// 既存ユーザーの共有URLとの互換性を確認するためのもので、この値は変更しない。
export const legacyShareQuery
  = "NobwRAdmBcaJcMgfhkIcMhnhjAGjAYxmAxAGIAsRAzKQGwZgBOMAjAL7rhSyDVDIDcMCABIDwbgbX3qOWHgBM9AJwUCpanWilmrXAGUArgGcAFgEseAMh4AdMABUApgFsADupoBDU8Nx4iAYQCCBAKwAGeQY-RgBdIA";

export const legacyShareItems = [
  { name: "ラーメン", color: "#F44336", rate: 1 },
  { name: "カレー 🍛", color: "#2196F3", rate: 3 },
  { name: "Sushi & \"Tempura\"", color: "#4CAF50", rate: 10 },
];
