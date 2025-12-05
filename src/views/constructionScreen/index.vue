<template>
  <div class="constructionScreen-container">
    <div class="constructionScreen-content" ref="constructionScreenRef">
      <div class="constructionScreen-header">
        <div class="header-lf">
          <span class="header-screening" @click="router.push(HOME_URL)">首页</span>
        </div>
        <div class="header-ct">
          <div class="header-ct-title">
            <span>智慧建筑可视化大数据展示平台</span>
            <div class="header-ct-warning">施工现场预警信息（{{ alarmData.length }}条）</div>
          </div>
        </div>
        <div class="header-ri">
          <span class="header-download">施工报告</span>
          <span class="header-time">当前时间：{{ time }}</span>
        </div>
      </div>
      <div class="constructionScreen-main">
        <div class="constructionScreen-lf">
          <div class="constructionScreen-top">
            <div class="constructionScreen-main-title">
              <span>实时施工人员统计</span>
              <img src="../dataScreen/images/dataScreen-title.png" alt="" />
            </div>
            <div class="constructionScreen-main-chart">
              <RealTimePersonnelChart />
            </div>
          </div>
          <div class="constructionScreen-center">
            <div class="constructionScreen-main-title">
              <span>设备运行状态</span>
              <img src="../dataScreen/images/dataScreen-title.png" alt="" />
            </div>
            <div class="constructionScreen-main-chart">
              <EquipmentStatusChart />
            </div>
          </div>
          <div class="constructionScreen-bottom">
            <div class="constructionScreen-main-title">
              <span>安全隐患统计</span>
              <img src="../dataScreen/images/dataScreen-title.png" alt="" />
            </div>
            <div class="constructionScreen-main-chart">
              <SafetyHazardChart />
            </div>
          </div>
        </div>
        <div class="constructionScreen-ct">
          <div class="constructionScreen-map">
            <div class="constructionScreen-map-title">施工现场实时监控</div>
            <vue3-seamless-scroll
              :list="alarmData"
              class="constructionScreen-alarm"
              :step="0.5"
              :hover="true"
              :limit-scroll-num="3"
            >
              <div class="constructionScreen-alarm">
                <div class="map-item" v-for="item in alarmData" :key="item.id">
                  <img src="../dataScreen/images/dataScreen-alarm.png" alt="" />
                  <span class="map-alarm sle">{{ item.label }} 预警：{{ item.warnMsg }}</span>
                </div>
              </div>
            </vue3-seamless-scroll>
            <ConstructionSiteMapChart />
          </div>
          <div class="constructionScreen-cb">
            <div class="constructionScreen-main-title">
              <span>项目进度趋势图</span>
              <img src="../dataScreen/images/dataScreen-title.png" alt="" />
            </div>
            <div class="constructionScreen-main-chart">
              <ProjectProgressChart />
            </div>
          </div>
        </div>
        <div class="constructionScreen-rg">
          <div class="constructionScreen-top">
            <div class="constructionScreen-main-title">
              <span>材料消耗统计</span>
              <img src="../dataScreen/images/dataScreen-title.png" alt="" />
            </div>
            <div class="constructionScreen-main-chart">
              <MaterialConsumptionChart />
            </div>
          </div>
          <div class="constructionScreen-center">
            <div class="constructionScreen-main-title">
              <span>施工质量评估</span>
              <img src="../dataScreen/images/dataScreen-title.png" alt="" />
            </div>
            <div class="constructionScreen-main-chart">
              <ConstructionQualityChart />
            </div>
          </div>
          <div class="constructionScreen-bottom">
            <div class="constructionScreen-main-title">
              <span>成本控制分析</span>
              <img src="../dataScreen/images/dataScreen-title.png" alt="" />
            </div>
            <div class="constructionScreen-main-chart">
              <CostControlChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="constructionScreen">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { HOME_URL } from "@/config";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import Vue3SeamlessScroll from "vue3-seamless-scroll";

// 导入图表组件
import RealTimePersonnelChart from "./components/RealTimePersonnelChart.vue";
import EquipmentStatusChart from "./components/EquipmentStatusChart.vue";
import SafetyHazardChart from "./components/SafetyHazardChart.vue";
import ConstructionSiteMapChart from "./components/ConstructionSiteMapChart.vue";
import ProjectProgressChart from "./components/ProjectProgressChart.vue";
import MaterialConsumptionChart from "./components/MaterialConsumptionChart.vue";
import ConstructionQualityChart from "./components/ConstructionQualityChart.vue";
import CostControlChart from "./components/CostControlChart.vue";

const router = useRouter();
const constructionScreenRef = ref<HTMLElement | null>(null);

// 模拟预警数据
const alarmData = ref([
  { id: 1, label: "安全", warnMsg: "施工现场A区烟雾浓度超标" },
  { id: 2, label: "设备", warnMsg: "塔吊1号起重臂角度异常" },
  { id: 3, label: "人员", warnMsg: "施工人员未佩戴安全帽" }
]);

onMounted(() => {
  if (constructionScreenRef.value) {
    constructionScreenRef.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
    constructionScreenRef.value.style.width = `1920px`;
    constructionScreenRef.value.style.height = `1080px`;
  }
  window.addEventListener("resize", resize);
});

// 设置响应式
const resize = () => {
  if (constructionScreenRef.value) {
    constructionScreenRef.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
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
