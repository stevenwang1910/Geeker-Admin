<template>
  <div class="newScreen-container">
    <div class="newScreen-content" ref="newScreenRef">
      <div class="newScreen-header">
        <div class="header-lf">
          <span class="header-screening" @click="router.push(HOME_URL)">首页</span>
        </div>
        <div class="header-ct">
          <div class="header-ct-title">
            <span>新大屏可视化展示平台</span>
            <div class="header-ct-warning">平台预警信息（0条）</div>
          </div>
        </div>
        <div class="header-ri">
          <span class="header-download">统计报告</span>
          <span class="header-time">当前时间：{{ time }}</span>
        </div>
      </div>
      <div class="newScreen-main">
        <div class="newScreen-lf">
          <div class="newScreen-top">
            <div class="newScreen-main-title">
              <span>实时数据统计</span>
              <img src="./images/newScreen-title.png" alt="" />
            </div>
            <div class="newScreen-main-chart">
              <RealTimeAccessChart />
            </div>
          </div>
          <div class="newScreen-center">
            <div class="newScreen-main-title">
              <span>数据比例</span>
              <img src="./images/newScreen-title.png" alt="" />
            </div>
            <div class="newScreen-main-chart">
              <DataRatioChart />
            </div>
          </div>
          <div class="newScreen-bottom">
            <div class="newScreen-main-title">
              <span>数据趋势</span>
              <img src="./images/newScreen-title.png" alt="" />
            </div>
            <div class="newScreen-main-chart">
              <DataTrendChart />
            </div>
          </div>
        </div>
        <div class="newScreen-ct">
          <div class="newScreen-map">
            <div class="newScreen-map-title">全国数据分布</div>
            <ChinaMapChart />
          </div>
          <div class="newScreen-cb">
            <div class="newScreen-main-title">
              <span>未来30天数据趋势图</span>
              <img src="./images/newScreen-title.png" alt="" />
            </div>
            <div class="newScreen-main-chart">
              <OverNext30Chart />
            </div>
          </div>
        </div>
        <div class="newScreen-rg">
          <div class="newScreen-top">
            <div class="newScreen-main-title">
              <span>热门数据排行</span>
              <img src="./images/newScreen-title.png" alt="" />
            </div>
            <div class="newScreen-main-chart">
              <HotDataChart />
            </div>
          </div>
          <div class="newScreen-center">
            <div class="newScreen-main-title">
              <span>年度数据对比</span>
              <img src="./images/newScreen-title.png" alt="" />
            </div>
            <div class="newScreen-main-chart">
              <!-- <AnnualDataChart /> -->
            </div>
          </div>
          <div class="newScreen-bottom">
            <div class="newScreen-main-title">
              <span>数据来源统计</span>
              <img src="./images/newScreen-title.png" alt="" />
            </div>
            <div class="newScreen-main-chart">
              <!-- <DataSourceChart /> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="newScreen">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { HOME_URL } from "@/config";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import RealTimeAccessChart from "./components/RealTimeAccessChart.vue";
import DataRatioChart from "./components/DataRatioChart.vue";
import DataTrendChart from "./components/DataTrendChart.vue";
import ChinaMapChart from "./components/ChinaMapChart.vue";
import OverNext30Chart from "./components/OverNext30Chart.vue";
import HotDataChart from "./components/HotDataChart.vue";

const router = useRouter();
const newScreenRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (newScreenRef.value) {
    newScreenRef.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
    newScreenRef.value.style.width = `1920px`;
    newScreenRef.value.style.height = `1080px`;
  }
  window.addEventListener("resize", resize);
});

// 设置响应式
const resize = () => {
  if (newScreenRef.value) {
    newScreenRef.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
  }
};

// 根据浏览器大小推断缩放比例
const getScale = (width = 1920, height = 1080) => {
  let ww = window.innerWidth / width;
  let wh = window.innerHeight / height;
  return ww < wh ? ww : wh;
};

// 获取当前时间
let timer: NodeJS.Timer | null = null;
let time = ref<string>(dayjs().format("YYYY年MM月DD HH:mm:ss"));
timer = setInterval(() => {
  time.value = dayjs().format("YYYY年MM月DD HH:mm:ss");
}, 1000);

onBeforeUnmount(() => {
  window.removeEventListener("resize", resize);
  clearInterval(timer as unknown as number);
});
</script>
<style lang="scss" scoped>
@import "./index";
</style>
