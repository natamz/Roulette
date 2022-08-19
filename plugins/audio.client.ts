export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("audio", new AudioUtil());
});

class AudioUtil {
  click() {
    if (localStorage.getItem("audio") != "true") return;
    play(buffs["click_A.wav"]);
  }
  click_B() {
    if (localStorage.getItem("audio") != "true") return;
    play(buffs["click_B.wav"]);
  }
  start() {
    if (localStorage.getItem("audio") != "true") return;
    play(buffs["start.wav"]);
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
      case "4":
        return play(buffs["result_4.wav"]);
      case "5":
        return play(buffs["result_5.wav"]);
      case "99":
        const arr = [
          "result_1.wav",
          "result_2.wav",
          "result_3.wav",
          "result_4.wav",
          "result_5.wav",
        ];
        return play(buffs[arr[Math.floor(Math.random() * arr.length)]]);
      default:
        return play(buffs["result_1.wav"]);
    }
  }
}

const audioContext = new AudioContext();
const gain = audioContext.createGain();
gain.connect(audioContext.destination);

const fileNames: string[] = [
  "click_A.wav",
  "click_B.wav",
  "result_1.wav",
  "result_2.wav",
  "result_3.wav",
  "result_4.wav",
  "result_5.wav",
  "start.wav",
];
const buffs: AudioBuffer[] = [];

(async () => {
  fileNames.forEach(async (item) => {
    const response = await fetch(`./audio/${item}`);
    const buffer = await response.arrayBuffer();
    buffs[item] = await audioContext.decodeAudioData(buffer);
  });
})();

function createSourceNode(audioBuffer: AudioBuffer): AudioBufferSourceNode {
  const sourceNode = audioContext.createBufferSource();
  sourceNode.buffer = audioBuffer;
  return sourceNode;
}

function play(audioBuffer: AudioBuffer) {
  const source = createSourceNode(audioBuffer);
  gain.gain.value = 0.5;
  source.connect(gain);
  source.start(0);
}
