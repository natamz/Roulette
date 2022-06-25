interface templateItem {
  name: string;
  rate: number;
  color: string;
}
interface template {
  name: string;
  items: templateItem[];
}

export const templates: ReadonlyArray<template> = [
  {
    name: "6面サイコロ",
    items: [
      { name: "1", rate: 1, color: "#ff9e9e" },
      { name: "2", rate: 1, color: "#ff9eff" },
      { name: "3", rate: 1, color: "#9e9eff" },
      { name: "4", rate: 1, color: "#9effff" },
      { name: "5", rate: 1, color: "#9eff9e" },
      { name: "6", rate: 1, color: "#ffff9e" },
    ],
  },
  {
    name: "10面サイコロ",
    items: [
      { name: "1", rate: 1, color: "#ff9e9e" },
      { name: "2", rate: 1, color: "#ff9eff" },
      { name: "3", rate: 1, color: "#ce9eff" },
      { name: "4", rate: 1, color: "#9e9eff" },
      { name: "5", rate: 1, color: "#9eceff" },
      { name: "6", rate: 1, color: "#9effff" },
      { name: "7", rate: 1, color: "#9effce" },
      { name: "8", rate: 1, color: "#9eff9e" },
      { name: "9", rate: 1, color: "#ceff9e" },
      { name: "10", rate: 1, color: "#ffff9e" },
    ],
  },
  {
    name: "〇X",
    items: [
      { name: "〇", rate: 1, color: "#ff6347" },
      { name: "X", rate: 1, color: "#4169e1" },
      { name: "〇", rate: 1, color: "#ff6347" },
      { name: "X", rate: 1, color: "#4169e1" },
      { name: "〇", rate: 1, color: "#ff6347" },
      { name: "X", rate: 1, color: "#4169e1" },
    ],
  },
  {
    name: "じゃんけん",
    items: [
      { name: "✊グー", rate: 1, color: "#ffbf7f" },
      { name: "✌チョキ", rate: 1, color: "#bfff7f" },
      { name: "✋パー", rate: 1, color: "#7fbfff" },
    ],
  },
];
