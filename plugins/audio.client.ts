import { Context } from "@nuxt/types";
import { Inject } from "@nuxt/types/app";

export default function (context: Context, inject: Inject): void {
  inject("audio", new AudioUtil());
}

class AudioUtil {
  click() {
    if (localStorage.getItem("audio") != "true") return;
    play(buffs["click.wav"]);
  }
  result() {
    if (localStorage.getItem("audio") != "true") return;

    const type = localStorage.getItem("audioResultType");
    switch (type) {
      case "1":
        return play(buffs["result_1.wav"]);
      case "2":
        return play(buffs["result_2.wav"]);
      case "3":
        return play(buffs["result_3.wav"]);
      default:
        return play(buffs["result_1.wav"]);
    }
  }
}

const audioContext = new AudioContext();
const fileNames: string[] = [
  "click.wav",
  "result_1.wav",
  "result_2.wav",
  "result_3.wav",
];
const buffs: AudioBuffer[] = [];

(async () => {
  fileNames.forEach(async (item) => {
    const response = await fetch(`/audio/${item}`);
    const buffer = await response.arrayBuffer();
    buffs[item] = await audioContext.decodeAudioData(buffer);
  });
})();

function createSourceNode(audioBuffer: AudioBuffer): AudioBufferSourceNode {
  const sourceNode = audioContext.createBufferSource();
  sourceNode.buffer = audioBuffer;
  sourceNode.connect(audioContext.destination);
  return sourceNode;
}

function play(audioBuffer: AudioBuffer) {
  createSourceNode(audioBuffer).start(0);
}
