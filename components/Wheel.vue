<template>
  <canvas ref="canvas" id="canvas" width="300" height="300"></canvas>

  <div>
    {{ result }}
    <v-btn @click="start">start</v-btn>
  </div>
</template>

<script lang="ts">
// canvasの中心座標
const CENTER_X: number = 150;
const CENTER_Y: number = 150;

export interface WheelItem {
  id: number;
  value: string;
  color: string;
}

// radianに変換
function ToRadian(deg: number): number {
  return ((deg % 360) * Math.PI) / 180;
}

export default {
  data(): { result: string } {
    return {
      result: "",
    };
  },
  props: {
    items: { type: Object as () => WheelItem, default: [] },
  },
  methods: {
    draw(start_deg: number = 0) {
      this.ctx.clearRect(0, 0, 300, 300);

      let deg: number = 360 / this.items.length;

      this.items.forEach((element: WheelItem) => {
        this.drawPart(start_deg, start_deg + deg, element);
        start_deg += deg;
      });
    },

    drawPart(start_deg: number, end_deg: number, element: WheelItem) {
      const start_rad: number = ToRadian(start_deg);
      const end_rad: number = ToRadian(end_deg);

      this.ctx.beginPath();
      this.ctx.moveTo(CENTER_X, CENTER_Y);
      this.ctx.fillStyle = element.color;
      this.ctx.arc(CENTER_X, CENTER_Y, 100, start_rad, end_rad);
      this.ctx.fill();
    start() {
      const num = Math.random() * 360;
      const i = Math.floor(num / (360 / this.items.length));
      this.result = this.items[i].value;
      let speed: number = 10000;

      let timer = setInterval(() => {
        speed *= 0.985;

        this.draw(-num - speed - 90);

        if (speed < 0.1) {
          // 停止
          clearInterval(timer);
        }
      }, 10);
    },
  },
  mounted() {
    this.ctx = this.$refs.canvas.getContext("2d");
    this.draw();
  },
};
</script>

<style lang="scss" scoped>
canvas {
  border: 1px solid rgb(107, 107, 107);
}
</style>
