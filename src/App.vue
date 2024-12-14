

<template>
  <div id="container"></div>
  <div class="tools">
    <div class="item" @click="onDrawPoint">绘制点</div>
    <div class="item" @click="onDrawLine">绘制线</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RenderPoints } from "./render/RenderPoints";
import { RenderLines } from "./render/RenderLines";
import Konva from "konva";

const result: any = ref(null);
let renderPoints: RenderPoints;
let renderLines: RenderLines;
onMounted(() => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const stage = new Konva.Stage({
    container: "container",
    width: width,
    height: height,
  });

  const layer = new Konva.Layer();

  renderPoints = new RenderPoints(stage, layer);

  renderLines = new RenderLines(stage, layer);

  stage.add(layer);

  layer.draw();
});

const onDrawPoint = () => {
  if (renderLines) {
    renderLines.enabled = false;
  }
  if (renderPoints) {
    renderPoints.enabled = !renderPoints.enabled;
  }
};

const onDrawLine = () => {
  if (renderPoints) {
    renderPoints.enabled = false;
  }

  if (renderLines) {
    renderLines.enabled = !renderLines.enabled;
  }
};
</script>


<style scoped lang="scss">
.container {
  background: #eee;
}

.tools {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  .item {
    width: 100px;
    border: 1px solid #000;
    margin-right: 20px;
    display: flex;
    justify-content: center;
    cursor: pointer;
  }
}
</style>
