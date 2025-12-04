<template>
  <div class="sport-dashboard">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>体育数据大屏</h1>
      <div class="filter-bar">
        <el-select v-model="selectedSport" placeholder="选择体育项目" style="width: 150px; margin-right: 10px">
          <el-option label="足球" value="football"></el-option>
          <el-option label="篮球" value="basketball"></el-option>
          <el-option label="网球" value="tennis"></el-option>
          <el-option label="游泳" value="swimming"></el-option>
        </el-select>
        <el-select v-model="selectedSeason" placeholder="选择赛季" style="width: 150px; margin-right: 10px">
          <el-option label="2023-2024赛季" value="2023-2024"></el-option>
          <el-option label="2022-2023赛季" value="2022-2023"></el-option>
          <el-option label="2021-2022赛季" value="2021-2022"></el-option>
        </el-select>
        <el-button type="primary" @click="refreshData">刷新数据</el-button>
      </div>
    </div>

    <!-- 数据卡片区域 -->
    <div class="data-cards">
      <div class="card">
        <div class="card-title">总赛事数</div>
        <div class="card-value">{{ totalEvents }}</div>
        <div class="card-change positive">+12.5%</div>
      </div>
      <div class="card">
        <div class="card-title">参赛运动员</div>
        <div class="card-value">{{ totalAthletes }}</div>
        <div class="card-change positive">+8.3%</div>
      </div>
      <div class="card">
        <div class="card-title">观众人数</div>
        <div class="card-value">{{ totalAudience }}</div>
        <div class="card-change positive">+15.2%</div>
      </div>
      <div class="card">
        <div class="card-title">总收入</div>
        <div class="card-value">{{ totalRevenue }}</div>
        <div class="card-change positive">+20.7%</div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="chart-container">
      <!-- 赛事数据统计 -->
      <div class="chart-item large">
        <div class="chart-title">赛事数据统计</div>
        <div ref="eventStatsChart" class="chart"></div>
      </div>

      <!-- 运动员表现分析 -->
      <div class="chart-item medium">
        <div class="chart-title">运动员表现分析</div>
        <div ref="athletePerformanceChart" class="chart"></div>
      </div>

      <!-- 观众参与度指标 -->
      <div class="chart-item medium">
        <div class="chart-title">观众参与度指标</div>
        <div ref="audienceEngagementChart" class="chart"></div>
      </div>

      <!-- 财务运营状况 -->
      <div class="chart-item large">
        <div class="chart-title">财务运营状况</div>
        <div ref="financialChart" class="chart"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import * as echarts from "echarts";

// 筛选条件
const selectedSport = ref("football");
const selectedSeason = ref("2023-2024");

// 数据卡片
const totalEvents = ref("1,248");
const totalAthletes = ref("8,562");
const totalAudience = ref("1.2M");
const totalRevenue = ref("¥85.6M");

// 图表引用
const eventStatsChart = ref<HTMLElement>();
const athletePerformanceChart = ref<HTMLElement>();
const audienceEngagementChart = ref<HTMLElement>();
const financialChart = ref<HTMLElement>();

// 初始化图表
const initCharts = () => {
  // 赛事数据统计图表
  const eventStats = echarts.init(eventStatsChart.value!);
  eventStats.setOption({
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    legend: {
      data: ["已完成", "进行中", "未开始"]
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true
    },
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.01]
    },
    yAxis: {
      type: "category",
      data: ["足球", "篮球", "网球", "游泳", "田径", "排球"]
    },
    series: [
      {
        name: "已完成",
        type: "bar",
        data: [320, 302, 301, 334, 390, 330]
      },
      {
        name: "进行中",
        type: "bar",
        data: [120, 132, 101, 134, 90, 230]
      },
      {
        name: "未开始",
        type: "bar",
        data: [220, 182, 191, 234, 290, 330]
      }
    ]
  });

  // 运动员表现分析图表
  const athletePerformance = echarts.init(athletePerformanceChart.value!);
  athletePerformance.setOption({
    tooltip: {
      trigger: "item"
    },
    legend: {
      top: "5%",
      left: "center"
    },
    series: [
      {
        name: "表现评分",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2
        },
        label: {
          show: false,
          position: "center"
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold"
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 335, name: "优秀" },
          { value: 310, name: "良好" },
          { value: 234, name: "中等" },
          { value: 135, name: "及格" },
          { value: 1548, name: "待提高" }
        ]
      }
    ]
  });

  // 观众参与度指标图表
  const audienceEngagement = echarts.init(audienceEngagementChart.value!);
  audienceEngagement.setOption({
    tooltip: {
      trigger: "axis"
    },
    legend: {
      data: ["现场观众", "线上观众", "社交媒体互动"]
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["1月", "2月", "3月", "4月", "5月", "6月"]
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        name: "现场观众",
        type: "line",
        stack: "Total",
        data: [120, 132, 101, 134, 90, 230]
      },
      {
        name: "线上观众",
        type: "line",
        stack: "Total",
        data: [220, 182, 191, 234, 290, 330]
      },
      {
        name: "社交媒体互动",
        type: "line",
        stack: "Total",
        data: [150, 232, 201, 154, 190, 330]
      }
    ]
  });

  // 财务运营状况图表
  const financial = echarts.init(financialChart.value!);
  financial.setOption({
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    legend: {
      data: ["收入", "支出", "利润"]
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: ["1月", "2月", "3月", "4月", "5月", "6月"]
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        name: "收入",
        type: "bar",
        data: [320, 302, 301, 334, 390, 330]
      },
      {
        name: "支出",
        type: "bar",
        data: [220, 182, 191, 234, 290, 330]
      },
      {
        name: "利润",
        type: "line",
        data: [100, 120, 110, 100, 100, 0]
      }
    ]
  });

  // 响应式调整
  window.addEventListener("resize", () => {
    eventStats.resize();
    athletePerformance.resize();
    audienceEngagement.resize();
    financial.resize();
  });
};

// 刷新数据
const refreshData = () => {
  // 模拟数据刷新
  totalEvents.value = (parseInt(totalEvents.value.replace(/,/g, "")) + Math.floor(Math.random() * 100)).toLocaleString();
  totalAthletes.value = (parseInt(totalAthletes.value.replace(/,/g, "")) + Math.floor(Math.random() * 500)).toLocaleString();
  totalAudience.value = (parseFloat(totalAudience.value.replace(/M/g, "")) + Math.random() * 0.1).toFixed(1) + "M";
  totalRevenue.value =
    "¥" + (parseFloat(totalRevenue.value.replace(/¥/g, "").replace(/M/g, "")) + Math.random() * 5).toFixed(1) + "M";
};

// 监听筛选条件变化
watch([selectedSport, selectedSeason], () => {
  // 模拟筛选数据
  console.log("筛选条件变化:", selectedSport.value, selectedSeason.value);
});

// 页面挂载时初始化图表
onMounted(() => {
  initCharts();
});
</script>

<style lang="scss" scoped>
@import "./index";
</style>
