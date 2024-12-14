

<template>
  <div id="container"></div>
  <div class="tools">
    <div class="item" @click="onDrawPoint">绘制点</div>
    <div class="item" @click="onDrawLine">绘制线</div>
    <div class="item" @click="generageArea">生成面</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RenderPoints } from "./render/RenderPoints";
import { RenderLines } from "./render/RenderLines";
import Konva from "konva";
import { Graph } from "./render/Graph";
import { renderArea } from "./tools/RenderArea";
import { convexHull, filterArea } from "./tools/toArea";

let renderPoints: RenderPoints;
let renderLines: RenderLines;

let layer: Konva.Layer;
onMounted(() => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const stage = new Konva.Stage({
    container: "container",
    width: width,
    height: height,
  });

  const _layer = new Konva.Layer();

  layer = _layer;
  renderPoints = new RenderPoints(stage, _layer);

  renderLines = new RenderLines(stage, _layer);

  stage.add(_layer);

  _layer.draw();
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

const generageArea = () => {
  if (!renderLines || !renderPoints) return;

  const points = renderPoints.data;

  const allData = renderLines.allData;

  console.log(points, allData);

  let graph = new Graph();

  points.forEach((item: any) => {
    graph.addNode(item.pid);
  });
  allData.forEach((item: any) => {
    graph.addEdge(item[0].pid, item[1].pid);
  });

  let cycles = graph.getAllSimpleCycles();

  const result = graph.removeDuplicateArrays(cycles);

  console.log(result);

  // let area = result.filter((item: any) => item.length == 3);

  filterArea(result, points, allData);

  console.log("三角面", result);

  const border: any = points.map((item: any) => item.point);

  // 示例：使用一组点计算凸包
  // import { convex } from "@turf/convex";
  // 使用truf库
  const hull = convexHull(border);

  console.log("Convex Hull:", hull);

  let group = new Konva.Group();

  layer.add(group);
  renderArea(points, result, group);

  // let line = new Konva.Line({
  //   points: hull.flat(),
  //   fill: "#ffddee",
  //   stroke: "#f00",
  //   closed: true,
  // });

  // group.add(line);

  layer.batchDraw();
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

function convexHull(border: any) {
  throw new Error("Function not implemented.");
}
