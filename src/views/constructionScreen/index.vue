<template>
  <div class="constructionScreen-container" ref="screenRef">
    <div class="constructionScreen-header">
      <div class="constructionScreen-header-left"></div>
      <div class="constructionScreen-header-center">
        <h1>建筑行业数字化大屏</h1>
      </div>
      <div class="constructionScreen-header-right">
        <div class="constructionScreen-header-time">{{ currentTime }}</div>
      </div>
    </div>
    <div class="constructionScreen-main">
      <div class="constructionScreen-lf">
        <div class="constructionScreen-lt">
          <div class="constructionScreen-main-title">
            <span>项目总览</span>
          </div>
          <div class="constructionScreen-main-chart">
            <ProjectOverviewChart />
          </div>
        </div>
        <div class="constructionScreen-lm">
          <div class="constructionScreen-main-title">
            <span>资源分配</span>
          </div>
          <div class="constructionScreen-main-chart">
            <ResourceAllocationChart />
          </div>
        </div>
        <div class="constructionScreen-lb">
          <div class="constructionScreen-main-title">
            <span>安全监测</span>
          </div>
          <div class="constructionScreen-main-chart">
            <SafetyMonitoringChart />
          </div>
        </div>
      </div>
      <div class="constructionScreen-c">
        <div class="constructionScreen-ct">
          <div class="constructionScreen-main-title">
            <span>项目进度追踪</span>
          </div>
          <div class="constructionScreen-main-chart">
            <ProjectProgressChart />
          </div>
        </div>
        <div class="constructionScreen-cb">
          <div class="constructionScreen-main-title">
            <span>施工现场指标</span>
          </div>
          <div class="constructionScreen-main-chart">
            <ConstructionSiteMetricsChart />
          </div>
        </div>
      </div>
      <div class="constructionScreen-rg">
        <div class="constructionScreen-rt">
          <div class="constructionScreen-main-title">
            <span>设备状态</span>
          </div>
          <div class="constructionScreen-main-chart">
            <EquipmentStatusChart />
          </div>
        </div>
        <div class="constructionScreen-rm">
          <div class="constructionScreen-main-title">
            <span>人员管理</span>
          </div>
          <div class="constructionScreen-main-chart">
            <PersonnelManagementChart />
          </div>
        </div>
        <div class="constructionScreen-rb">
          <div class="constructionScreen-main-title">
            <span>项目时间线</span>
          </div>
          <div class="constructionScreen-main-chart">
            <ProjectTimelineChart />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import ProjectOverviewChart from "./components/ProjectOverviewChart.vue";
import ResourceAllocationChart from "./components/ResourceAllocationChart.vue";
import SafetyMonitoringChart from "./components/SafetyMonitoringChart.vue";
import ProjectProgressChart from "./components/ProjectProgressChart.vue";
import ConstructionSiteMetricsChart from "./components/ConstructionSiteMetricsChart.vue";
import EquipmentStatusChart from "./components/EquipmentStatusChart.vue";
import PersonnelManagementChart from "./components/PersonnelManagementChart.vue";
import ProjectTimelineChart from "./components/ProjectTimelineChart.vue";

const screenRef = ref<HTMLElement>();
const currentTime = ref<string>("");

const getScale = () => {
  if (!screenRef.value) return;
  const { clientWidth: width, clientHeight: height } = screenRef.value;
  const scale = Math.min(width / 1920, height / 1080);
  screenRef.value.style.transform = `scale(${scale})`;
};

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
};

onMounted(() => {
  getScale();
  window.addEventListener("resize", getScale);
  updateTime();
  setInterval(updateTime, 1000);
});

onUnmounted(() => {
  window.removeEventListener("resize", getScale);
});
</script>

<style lang="scss" scoped>
.constructionScreen-container {
  width: 100vw;
  height: 100vh;
  background: url("./images/bg.png") no-repeat center center / cover;
  position: relative;
  overflow: hidden;
}

.constructionScreen-header {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
  background: url("./images/header-bg.png") no-repeat center center / cover;
}

.constructionScreen-header-left,
.constructionScreen-header-right {
  width: 200px;
  height: 100%;
}

.constructionScreen-header-center {
  flex: 1;
  text-align: center;
}

.constructionScreen-header-center h1 {
  font-size: 32px;
  font-weight: bold;
  color: #fff;
  margin: 0;
}

.constructionScreen-header-time {
  font-size: 18px;
  color: #fff;
  text-align: right;
  margin-top: 20px;
}

.constructionScreen-main {
  width: 100%;
  height: calc(100% - 80px);
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  gap: 20px;
}

.constructionScreen-lf,
.constructionScreen-rg {
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.constructionScreen-c {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.constructionScreen-lt,
.constructionScreen-lm,
.constructionScreen-lb,
.constructionScreen-ct,
.constructionScreen-cb,
.constructionScreen-rt,
.constructionScreen-rm,
.constructionScreen-rb {
  background: url("./images/section-bg.png") no-repeat center center / cover;
  border-radius: 8px;
  padding: 10px;
  box-sizing: border-box;
}

.constructionScreen-lt,
.constructionScreen-lm,
.constructionScreen-rt,
.constructionScreen-rm {
  height: 35%;
}

.constructionScreen-lb,
.constructionScreen-ct,
.constructionScreen-cb,
.constructionScreen-rb {
  height: 30%;
}

.constructionScreen-main-title {
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  background: url("./images/title-bg.png") no-repeat center center / cover;
  border-radius: 4px;
  margin-bottom: 10px;
}

.constructionScreen-main-title span {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
}

.constructionScreen-main-chart {
  height: calc(100% - 50px);
  border-radius: 4px;
  overflow: hidden;
}
</style>
