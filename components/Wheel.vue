<template>
  <canvas id="canvas" width="300" height="300"></canvas>
</template>

<script lang="ts">
const CENTER_X = 150;
const CENTER_Y = 150;

export default {
  props: {
    items: Array,
  },
  setup() {},
  methods: {
    draw() {
      let count = 0;
      let a = 360 / this.items.length;
      console.log(a);

      this.items.forEach((element) => {
        this.drawPart(count, count + a, element.color);
        count += a;
      });
    },

    drawPart(start_deg: number, end_deg: number, color: String) {
      var start_rad = ((360 - start_deg) * Math.PI) / 180;
      var end_rad = ((360 - end_deg) * Math.PI) / 180;

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
