import { Context } from "@nuxt/types";
import { Inject } from "@nuxt/types/app";

export default function (context: Context, inject: Inject): void {
  inject("audio", new AudioUtil());
}

class AudioUtil {
  click() {
    if (localStorage.getItem("audio") != "true") return;
    new Audio("/audio/click.wav").play();
  }
  result() {
    if (localStorage.getItem("audio") != "true") return;

    const type = localStorage.getItem("audioResultType");
    switch (type) {
      case "1":
        return new Audio("/audio/result_1.wav").play();
      case "2":
        return new Audio("/audio/result_2.wav").play();
      case "3":
        return new Audio("/audio/result_3.wav").play();
      default:
        return new Audio("/audio/result_1.wav").play();
    }
  }
}
