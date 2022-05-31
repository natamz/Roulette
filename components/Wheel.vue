<template>
  <canvas id="canvas" width="300" height="300"></canvas>
</template>

<script lang="ts">
// canvasの中心座標
const CENTER_X: number = 150;
const CENTER_Y: number = 150;

// radianに変換
function ToRadian(deg: number): number {
  return ((360 - deg) * Math.PI) / 180;
}

export default {
  props: {
    items: { type: Array, default: [] },
  },
  methods: {
    draw() {
      let start_deg: number = 0;
      let deg: number = 360 / this.items.length;

      this.items.forEach((element: { color: string }) => {
        this.drawPart(start_deg, start_deg + deg, element.color);
        start_deg += deg;
      });
    },

    drawPart(start_deg: number, end_deg: number, color: string) {
      let start_rad: number = ToRadian(start_deg);
      let end_rad: number = ToRadian(end_deg);
      this.ctx.beginPath();
      this.ctx.moveTo(CENTER_X, CENTER_Y);
      this.ctx.fillStyle = color;
      this.ctx.arc(CENTER_X, CENTER_Y, 100, start_rad, end_rad, true);
      this.ctx.fill();
    },
  },
  mounted() {
    this.ctx = this.$el.getContext("2d");
    this.draw();
  },
};
</script>

<style lang="scss" scoped>
canvas {
  border: 1px solid rgb(107, 107, 107);
}
</style>
