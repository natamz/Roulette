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

// 時刻をミリ秒で返す
function GetTime() {
  return new Date().getTime();
}

export default {
  data(): { result: string; isRunning: boolean; sumOfItemsRate: number } {
    return {
      result: "",
      isRunning: false,
      sumOfItemsRate: 0,
    };
  },
  props: {
    items: { type: Object as () => WheelItem, default: [] },
  },
  methods: {
    draw(start_deg: number = 0) {
      this.ctx.clearRect(0, 0, 500, 500);

      const deg: number = 359.9 / this.sumOfItemsRate;

      this.items.forEach((element: WheelItem) => {
        const element_deg = deg * element.rate;
        this.drawPart(start_deg, start_deg + element_deg, element);
        this.drawLabel((start_deg * 2 + element_deg) / 2, element.value);
        start_deg += element_deg;
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

      // 回転時間
      const time = 8000;
      const startTime = GetTime();

      const num = Math.random() * 360;

      const a = 1e-4 ** (1 / time);

      let timer = setInterval(() => {
        const t = GetTime() - startTime;
        const d = 10000 * a ** t;
        this.draw(-num - d - 90);

        if (d < 0.5) {
          // 停止
          clearInterval(timer);
          this.isRunning = false;

          this.$emit("stopped", this.getResult(num + d));
        }
      }, 30);
    },

    getResult(deg: number): number {
      const i = Math.floor(deg / (360 / this.sumOfItemsRate));
      let a = 0;
      for (const item of this.items) {
        a += item.rate;
        if (a > i) {
          return item.id;
        }
      }
    },

    calcSumOfItemsRate() {
      this.sumOfItemsRate = this.items.reduce(
        (num: number, item: WheelItem) => {
          return num + item.rate;
        },
        0
      );
    },
  },
  mounted() {
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.calcSumOfItemsRate();
    this.draw();
  },
  watch: {
    items: {
      handler() {
        this.calcSumOfItemsRate();
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
