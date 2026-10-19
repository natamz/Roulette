export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const audio = new AudioUtil(`${config.app.baseURL}audio/`);
  nuxtApp.provide("audio", audio);

  // 効果音は既定でオフなので、起動時には読み込まない
  // オンなら、最初に鳴らすときに待たないよう、起動が終わってから読み込んでおく
  onNuxtReady(() => {
    if (isEnabled()) audio.preload();
  });
});

const fileNames = ["click_A.wav", "click_B.wav", "result_1.wav", "result_2.wav", "result_3.wav", "result_4.wav", "result_5.wav", "start.wav"] as const;
type FileName = typeof fileNames[number];

function isEnabled() {
  return localStorage.getItem("audio") == "true";
}

export class AudioUtil {
  private readonly baseURL: string;
  // AudioContext はユーザーの操作の前に作ると止まった状態で作られるので、最初に鳴らすとき（クリックの中）に作る
  private output?: { context: AudioContext; gain: GainNode };
  // 読み込みもデコードも1ファイル1回だけ。失敗したら undefined（鳴らさない）
  private readonly files = new Map<FileName, Promise<ArrayBuffer | undefined>>();
  private readonly buffers = new Map<FileName, Promise<AudioBuffer | undefined>>();

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  click() {
    this.play("click_A.wav");
  }

  click_B() {
    this.play("click_B.wav");
  }

  start() {
    this.play("start.wav");
  }

  result() {
    const type = localStorage.getItem("audioResultType");
    switch (type) {
      case "1":
        return this.play("result_1.wav");
      case "2":
        return this.play("result_2.wav");
      case "3":
        return this.play("result_3.wav");
      case "4":
        return this.play("result_4.wav");
      case "5":
        return this.play("result_5.wav");
      case "99": {
        const arr = ["result_1.wav", "result_2.wav", "result_3.wav", "result_4.wav", "result_5.wav"] as const;
        return this.play(arr[Math.floor(Math.random() * arr.length)] ?? "result_1.wav");
      }
      default:
        return this.play("result_1.wav");
    }
  }

  // 全部の効果音を並行して読み込む（AudioContext は作らない）
  preload() {
    for (const name of fileNames) this.load(name);
  }

  private load(name: FileName) {
    let file = this.files.get(name);
    if (!file) {
      file = fetch(`${this.baseURL}${name}`)
        .then(response => (response.ok ? response.arrayBuffer() : undefined))
        .catch(() => undefined);
      this.files.set(name, file);
    }
    return file;
  }

  // 読み込みが終わっていなければ、終わってから鳴らす
  private async play(name: FileName) {
    if (!isEnabled()) return;

    if (!this.output) {
      const context = new AudioContext();
      const gain = context.createGain();
      gain.gain.value = 0.5;
      gain.connect(context.destination);
      this.output = { context, gain };
    }
    const { context, gain } = this.output;

    let buffer = this.buffers.get(name);
    if (!buffer) {
      // decodeAudioData は渡した ArrayBuffer を使えなくするので、デコードした結果を取っておく
      buffer = this.load(name)
        .then(data => (data ? context.decodeAudioData(data) : undefined))
        .catch(() => undefined);
      this.buffers.set(name, buffer);
    }
    // オンにした直後なら、ほかの効果音もここで読み込み始める
    this.preload();

    const audioBuffer = await buffer;
    if (!audioBuffer) return;
    const source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(gain);
    source.start(0);
  }
}
