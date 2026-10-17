interface templateItem {
  name: string;
  rate: number;
  color: string;
}
interface template {
  name: { [key: string]: string };
  items: templateItem[];
}

export const templates: ReadonlyArray<template> = [
  {
    name: {
      ja: "6面さいころ",
      en: "6-sided dice",
    },
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
    name: {
      ja: "10面さいころ",
      en: "10-sided dice",
    },
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
    name: {
      ja: "〇X",
      en: "〇X",
    },
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
    name: {
      ja: "じゃんけん",
      en: "Rock, paper, scissors",
    },
    items: [
      { name: "✊", rate: 1, color: "#ffbf7f" },
      { name: "✋", rate: 1, color: "#7fbfff" },
      { name: "✌", rate: 1, color: "#bfff7f" },
    ],
  },
];
