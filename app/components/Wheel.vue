<template>
  <div class="canvas_container">
    <canvas
      id="canvas"
      ref="canvas"
      width="500"
      height="500"
    />
    <canvas
      ref="canvas_label"
      width="500"
      height="500"
    />
  </div>
</template>

<script lang="ts">
import type RouletteItem from "~/models/entities/RouletteItem";
import { decayDistance, itemSectors, pickItemId } from "~/utils/wheel";

// canvasの中心座標
const CENTER_X: number = 250;
const CENTER_Y: number = 250;

// radianに変換
function ToRadian(deg: number): number {
  return (deg * Math.PI) / 180;
}

// 時刻をミリ秒で返す
function GetTime() {
  return new Date().getTime();
}

export default {
  props: {
    items: { type: Array as () => RouletteItem[], default: () => [] },
  },
  emits: ["stopped"],
  data(): { result: string; isRunning: boolean; deg: number; ctx: CanvasRenderingContext2D | null; ctx_label: CanvasRenderingContext2D | null } {
    return {
      result: "",
      isRunning: false,
      // 円の角度。テーマや項目が変わって描き直すときも、止まった角度のまま描く（#204）
      deg: 0,
      ctx: null,
      ctx_label: null,
    };
  },
  computed: {
    // 指針は背景の上に描くので、テーマの文字色に合わせる
    pointerColor(): string {
      return this.$vuetify.theme.current.colors["on-background"] ?? "#000000";
    },
  },
  watch: {
    pointerColor() {
      this.draw();
    },
    items: {
      handler() {
        this.draw();
      },
      deep: true,
    },
  },
  mounted() {
    this.ctx = (this.$refs.canvas as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D;

    this.ctx_label = (this.$refs.canvas_label as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D;
    this.ctx_label.font = "32px serif";
    this.ctx_label.textBaseline = "middle";
    this.ctx_label.textAlign = "center";

    this.draw();
  },
  methods: {
    draw() {
      this.ctx?.clearRect(0, 0, 500, 500);
      this.ctx_label?.clearRect(0, 0, 500, 500);

      // ラベルは扇形の上に描くので黒。指針の色は drawTriangle() で変える
      if (this.ctx_label) this.ctx_label.fillStyle = "#000000";

      // 扇形の範囲は判定（pickItemId）と同じものを使う
      itemSectors(this.items).forEach(({ item, start, end }) => {
        this.drawPart(this.deg + start, this.deg + end, item);
        this.drawLabel(this.deg + (start + end) / 2, item.name);
      });
      this.drawTriangle();
    },

    drawPart(start_deg: number, end_deg: number, element: RouletteItem) {
      const start_rad: number = ToRadian(start_deg);
      const end_rad: number = ToRadian(end_deg);

      if (this.ctx) {
        this.ctx.beginPath();
        this.ctx.moveTo(CENTER_X, CENTER_Y);
        this.ctx.fillStyle = element.color;
        this.ctx.arc(CENTER_X, CENTER_Y, 200, start_rad, end_rad);
        this.ctx.fill();
      }
    },

    drawLabel(deg: number, text: string) {
      const rad: number = ToRadian(deg);
      this.ctx_label?.fillText(text, CENTER_X + Math.cos(rad) * 100, CENTER_Y + Math.sin(rad) * 100);
    },
    drawTriangle() {
      if (this.ctx_label) {
        this.ctx_label.fillStyle = this.pointerColor;
        this.ctx_label.beginPath();
        this.ctx_label.moveTo(250, 50);
        this.ctx_label.lineTo(230, 10);
        this.ctx_label.lineTo(270, 10);
        this.ctx_label.fill();
      }
    },

    start() {
      // 連打防止
      if (this.isRunning) return;
      this.isRunning = true;

      // 回転時間
      const time = Number(localStorage.getItem("rotationTime"));
      const startTime = GetTime();

      const num = Math.random() * 360;

      const timer = setInterval(() => {
        const t = GetTime() - startTime;
        const d = decayDistance(t, time);
        this.deg = -num - d - 90;
        this.draw();

        if (d < 0.5) {
          // 停止
          clearInterval(timer);
          this.isRunning = false;

          this.$emit("stopped", this.getResult(num + d));
        }
      }, 30);
    },

    getResult(deg: number): number {
      return pickItemId(this.items, deg);
    },
  },
};
</script>

<style lang="scss" scoped>
.canvas_container {
  position: relative;
  padding: 0;
  box-sizing: content-box;
  &:before {
    padding-top: 100%;
    content: "";
    display: block;
  }
}
canvas {
  width: 100%;
  height: auto;
  position: absolute;
  box-sizing: content-box;
  left: 0;
  top: 0;
  padding: 0;
  margin: 0;
}
</style>
