<template>
  <canvas ref="canvas" id="canvas" width="500" height="500"></canvas>
</template>

<script lang="ts">
import WheelItem from "@/types/WheelItem";

// canvasの中心座標
const CENTER_X: number = 250;
const CENTER_Y: number = 250;

// radianに変換
function ToRadian(deg: number): number {
  return ((deg % 360) * Math.PI) / 180;
}

export default {
  data(): { result: string; isRunning: boolean } {
    return {
      result: "",
      isRunning: false,
    };
  },
  props: {
    items: { type: Object as () => WheelItem, default: [] },
  },
  methods: {
    draw(start_deg: number = 0) {
      this.ctx.clearRect(0, 0, 500, 500);

      let deg: number = 360 / this.items.length;

      this.items.forEach((element: WheelItem) => {
        this.drawPart(start_deg, start_deg + deg, element);
        this.drawLabel((start_deg * 2 + deg) / 2, element.value);
        start_deg += deg;
      });
      this.drawTriangle();
    },

    drawPart(start_deg: number, end_deg: number, element: WheelItem) {
      const start_rad: number = ToRadian(start_deg);
      const end_rad: number = ToRadian(end_deg);

      this.ctx.beginPath();
      this.ctx.moveTo(CENTER_X, CENTER_Y);
      this.ctx.fillStyle = element.color;
      this.ctx.arc(CENTER_X, CENTER_Y, 200, start_rad, end_rad);
      this.ctx.fill();
    },

    drawLabel(deg: number, text: string) {
      this.ctx.font = "32px serif";
      this.ctx.fillStyle = "#000000";
      this.ctx.textBaseline = "center";
      this.ctx.textAlign = "center";

      const rad: number = ToRadian(deg);
      this.ctx.fillText(
        text,
        CENTER_X + Math.cos(rad) * 75,
        CENTER_Y + Math.sin(rad) * 75
      );
    },
    drawTriangle() {
      this.ctx.beginPath();
      this.ctx.moveTo(250, 50);
      this.ctx.lineTo(230, 10);
      this.ctx.lineTo(270, 10);
      this.ctx.fillStyle = "#000000";
      this.ctx.fill();
    },

    start() {
      // 連打防止
      if (this.isRunning) return;
      this.isRunning = true;

      const num = Math.random() * 360;
      let speed: number = 5000;

      let timer = setInterval(() => {
        speed *= 0.98;

        this.draw(-num - speed - 90);

        if (speed < 1) {
          // 停止
          clearInterval(timer);
          this.isRunning = false;

          const i = Math.floor(num / (360 / this.items.length));
          const result = this.items[i].value;
          this.$emit("stopped", result);
        }
      }, 33);
    },
  },
  mounted() {
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.draw();
  },
  watch: {
    items: {
      handler() {
        this.draw();
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
canvas {
  width: 100%;
  height: auto;
}
</style>
