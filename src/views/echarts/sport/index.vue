<template>
  <div class="sport-dashboard">
    <!-- 页面标题 -->
    <div class="dashboard-header">
      <h1>体育数据大屏</h1>
      <div class="dashboard-controls">
        <el-select v-model="selectedSeason" placeholder="选择赛季" style="width: 150px; margin-right: 10px" @change="filterData">
          <el-option label="2023-2024赛季" value="2023-2024"></el-option>
          <el-option label="2022-2023赛季" value="2022-2023"></el-option>
          <el-option label="2021-2022赛季" value="2021-2022"></el-option>
        </el-select>
        <el-select v-model="selectedTeam" placeholder="选择球队" style="width: 150px; margin-right: 10px" @change="filterData">
          <el-option label="全部球队" value="all"></el-option>
          <el-option label="篮球队" value="basketball"></el-option>
          <el-option label="足球队" value="football"></el-option>
          <el-option label="排球队" value="volleyball"></el-option>
        </el-select>
        <el-button type="primary" @click="refreshData">刷新数据</el-button>
      </div>
    </div>

    <!-- 数据概览卡片 -->
    <div class="dashboard-overview">
      <el-card class="overview-card">
        <div class="card-content">
          <div class="card-icon">🏆</div>
          <div class="card-info">
            <div class="card-value">{{ totalMatches }}</div>
            <div class="card-label">总赛事数</div>
          </div>
        </div>
      </el-card>
      <el-card class="overview-card">
        <div class="card-content">
          <div class="card-icon">👥</div>
          <div class="card-info">
            <div class="card-value">{{ totalAthletes }}</div>
            <div class="card-label">运动员总数</div>
          </div>
        </div>
      </el-card>
      <el-card class="overview-card">
        <div class="card-content">
          <div class="card-icon">👁️</div>
          <div class="card-info">
            <div class="card-value">{{ totalAudience }}</div>
            <div class="card-label">观众总人数</div>
          </div>
        </div>
      </el-card>
      <el-card class="overview-card">
        <div class="card-content">
          <div class="card-icon">💰</div>
          <div class="card-info">
            <div class="card-value">{{ totalRevenue }}</div>
            <div class="card-label">总收入(万元)</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 图表区域 -->
    <div class="dashboard-charts">
      <!-- 赛事类型分布 -->
      <el-card class="chart-card">
        <div class="card-title">赛事类型分布</div>
        <div class="chart-container">
          <v-chart :option="matchTypeOption" autoresize></v-chart>
        </div>
      </el-card>

      <!-- 月度赛事数量趋势 -->
      <el-card class="chart-card">
        <div class="card-title">月度赛事数量趋势</div>
        <div class="chart-container">
          <v-chart :option="monthlyMatchesOption" autoresize></v-chart>
        </div>
      </el-card>

      <!-- 运动员表现排名 -->
      <el-card class="chart-card">
        <div class="card-title">运动员表现排名</div>
        <div class="chart-container">
          <v-chart :option="athletePerformanceOption" autoresize></v-chart>
        </div>
      </el-card>

      <!-- 观众参与度分析 -->
      <el-card class="chart-card">
        <div class="card-title">观众参与度分析</div>
        <div class="chart-container">
          <v-chart :option="audienceEngagementOption" autoresize></v-chart>
        </div>
      </el-card>

      <!-- 球队胜率对比 -->
      <el-card class="chart-card">
        <div class="card-title">球队胜率对比</div>
        <div class="chart-container">
          <v-chart :option="teamWinRateOption" autoresize></v-chart>
        </div>
      </el-card>

      <!-- 财务收入分析 -->
      <el-card class="chart-card">
        <div class="card-title">财务收入分析</div>
        <div class="chart-container">
          <v-chart :option="revenueAnalysisOption" autoresize></v-chart>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, LineChart, BarChart, RadarChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent, DataZoomComponent } from "echarts/components";
import VChart from "vue-echarts";

// 注册 ECharts 组件
use([
  CanvasRenderer,
  PieChart,
  LineChart,
  BarChart,
  RadarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent
]);

// 响应式数据
const selectedSeason = ref("2023-2024");
const selectedTeam = ref("all");

// 原始模拟数据（用于筛选）
const originalMatchTypeData = [
  { name: "篮球", value: 45, team: "basketball" },
  { name: "足球", value: 35, team: "football" },
  { name: "排球", value: 25, team: "volleyball" },
  { name: "乒乓球", value: 15, team: "tabletennis" },
  { name: "羽毛球", value: 8, team: "badminton" }
];

const originalAthletePerformanceData = [
  { name: "张三", score: 95, team: "basketball" },
  { name: "李四", score: 92, team: "basketball" },
  { name: "王五", score: 88, team: "football" },
  { name: "赵六", score: 85, team: "football" },
  { name: "孙七", score: 82, team: "volleyball" },
  { name: "周八", score: 78, team: "volleyball" },
  { name: "吴九", score: 75, team: "tabletennis" },
  { name: "郑十", score: 72, team: "badminton" }
];

const originalTeamWinRateData = [
  { team: "篮球队A", winRate: 85, teamType: "basketball" },
  { team: "篮球队B", winRate: 78, teamType: "basketball" },
  { team: "足球队A", winRate: 82, teamType: "football" },
  { team: "足球队B", winRate: 75, teamType: "football" },
  { team: "排球队A", winRate: 79, teamType: "volleyball" },
  { team: "排球队B", winRate: 72, teamType: "volleyball" }
];

// 筛选后的数据
const matchTypeData = ref(originalMatchTypeData);
const athletePerformanceData = ref(originalAthletePerformanceData);
const teamWinRateData = ref(originalTeamWinRateData);

// 其他数据
const totalMatches = ref(128);
const totalAthletes = ref(384);
const totalAudience = ref("125.6万");
const totalRevenue = ref("896.5");

// 月度赛事数量数据（按赛季区分）
const monthlyMatchesData = ref([
  { month: "1月", matches: 8 },
  { month: "2月", matches: 12 },
  { month: "3月", matches: 15 },
  { month: "4月", matches: 18 },
  { month: "5月", matches: 22 },
  { month: "6月", matches: 25 },
  { month: "7月", matches: 20 },
  { month: "8月", matches: 18 },
  { month: "9月", matches: 15 },
  { month: "10月", matches: 12 },
  { month: "11月", matches: 10 },
  { month: "12月", matches: 8 }
]);

// 观众参与度数据（按赛季区分）
const audienceEngagementData = ref([
  { month: "1月", attendance: 85, satisfaction: 90 },
  { month: "2月", attendance: 88, satisfaction: 92 },
  { month: "3月", attendance: 90, satisfaction: 93 },
  { month: "4月", attendance: 92, satisfaction: 94 },
  { month: "5月", attendance: 95, satisfaction: 95 },
  { month: "6月", attendance: 98, satisfaction: 96 },
  { month: "7月", attendance: 96, satisfaction: 94 },
  { month: "8月", attendance: 94, satisfaction: 93 },
  { month: "9月", attendance: 92, satisfaction: 92 },
  { month: "10月", attendance: 90, satisfaction: 91 },
  { month: "11月", attendance: 88, satisfaction: 90 },
  { month: "12月", attendance: 86, satisfaction: 89 }
]);

// 财务收入数据（按赛季区分）
const revenueAnalysisData = ref([
  { month: "1月", ticket: 50, sponsorship: 30, merchandise: 20 },
  { month: "2月", ticket: 60, sponsorship: 35, merchandise: 25 },
  { month: "3月", ticket: 70, sponsorship: 40, merchandise: 30 },
  { month: "4月", ticket: 80, sponsorship: 45, merchandise: 35 },
  { month: "5月", ticket: 90, sponsorship: 50, merchandise: 40 },
  { month: "6月", ticket: 100, sponsorship: 55, merchandise: 45 },
  { month: "7月", ticket: 95, sponsorship: 52, merchandise: 42 },
  { month: "8月", ticket: 90, sponsorship: 48, merchandise: 38 },
  { month: "9月", ticket: 85, sponsorship: 45, merchandise: 35 },
  { month: "10月", ticket: 80, sponsorship: 42, merchandise: 32 },
  { month: "11月", ticket: 75, sponsorship: 38, merchandise: 28 },
  { month: "12月", ticket: 70, sponsorship: 35, merchandise: 25 }
]);

// 筛选数据函数
const filterData = () => {
  // 筛选赛事类型数据
  if (selectedTeam.value === "all") {
    matchTypeData.value = originalMatchTypeData;
  } else {
    matchTypeData.value = originalMatchTypeData.filter(item => item.team === selectedTeam.value);
  }

  // 筛选运动员表现数据
  if (selectedTeam.value === "all") {
    athletePerformanceData.value = originalAthletePerformanceData;
  } else {
    athletePerformanceData.value = originalAthletePerformanceData.filter(item => item.team === selectedTeam.value);
  }

  // 筛选球队胜率数据
  if (selectedTeam.value === "all") {
    teamWinRateData.value = originalTeamWinRateData;
  } else {
    teamWinRateData.value = originalTeamWinRateData.filter(item => item.teamType === selectedTeam.value);
  }

  // 根据赛季更新数据（这里简单模拟不同赛季的数据差异）
  if (selectedSeason.value === "2023-2024") {
    monthlyMatchesData.value = [
      { month: "1月", matches: 8 },
      { month: "2月", matches: 12 },
      { month: "3月", matches: 15 },
      { month: "4月", matches: 18 },
      { month: "5月", matches: 22 },
      { month: "6月", matches: 25 },
      { month: "7月", matches: 20 },
      { month: "8月", matches: 18 },
      { month: "9月", matches: 15 },
      { month: "10月", matches: 12 },
      { month: "11月", matches: 10 },
      { month: "12月", matches: 8 }
    ];
  } else if (selectedSeason.value === "2022-2023") {
    monthlyMatchesData.value = [
      { month: "1月", matches: 6 },
      { month: "2月", matches: 10 },
      { month: "3月", matches: 13 },
      { month: "4月", matches: 16 },
      { month: "5月", matches: 20 },
      { month: "6月", matches: 23 },
      { month: "7月", matches: 18 },
      { month: "8月", matches: 16 },
      { month: "9月", matches: 13 },
      { month: "10月", matches: 10 },
      { month: "11月", matches: 8 },
      { month: "12月", matches: 6 }
    ];
  } else if (selectedSeason.value === "2021-2022") {
    monthlyMatchesData.value = [
      { month: "1月", matches: 5 },
      { month: "2月", matches: 8 },
      { month: "3月", matches: 11 },
      { month: "4月", matches: 14 },
      { month: "5月", matches: 18 },
      { month: "6月", matches: 21 },
      { month: "7月", matches: 16 },
      { month: "8月", matches: 14 },
      { month: "9月", matches: 11 },
      { month: "10月", matches: 8 },
      { month: "11月", matches: 6 },
      { month: "12月", matches: 5 }
    ];
  }

  // 更新概览数据
  updateOverviewData();
};

// 更新概览数据函数
const updateOverviewData = () => {
  // 计算总赛事数
  const totalMatchesCount = matchTypeData.value.reduce((sum, item) => sum + item.value, 0);
  totalMatches.value = totalMatchesCount;

  // 计算运动员总数
  const totalAthletesCount = athletePerformanceData.value.length * 12; // 假设每个运动员对应12场比赛
  totalAthletes.value = totalAthletesCount;

  // 计算观众总人数和总收入（简单模拟）
  const audienceMultiplier = selectedSeason.value === "2023-2024" ? 1.0 : selectedSeason.value === "2022-2023" ? 0.9 : 0.8;
  const revenueMultiplier = selectedSeason.value === "2023-2024" ? 1.0 : selectedSeason.value === "2022-2023" ? 0.95 : 0.9;
  
  const baseAudience = 125.6;
  const baseRevenue = 896.5;
  
  totalAudience.value = (baseAudience * audienceMultiplier).toFixed(1) + "万";
  totalRevenue.value = (baseRevenue * revenueMultiplier).toFixed(1);
};

// 赛事类型分布图表配置
const matchTypeOption = computed(() => ({
  tooltip: {
    trigger: "item"
  },
  legend: {
    bottom: 0,
    left: "center"
  },
  series: [
    {
      name: "赛事类型",
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
          fontSize: 16,
          fontWeight: "bold"
        }
      },
      labelLine: {
        show: false
      },
      data: matchTypeData.value
    }
  ]
}));

// 月度赛事数量趋势图表配置
const monthlyMatchesOption = computed(() => ({
  tooltip: {
    trigger: "axis"
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: monthlyMatchesData.value.map(item => item.month)
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      name: "赛事数量",
      type: "line",
      data: monthlyMatchesData.value.map(item => item.matches),
      smooth: true,
      lineStyle: {
        width: 3
      },
      areaStyle: {
        opacity: 0.3
      }
    }
  ]
}));

// 运动员表现排名图表配置
const athletePerformanceOption = computed(() => ({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    }
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true
  },
  xAxis: {
    type: "category",
    data: athletePerformanceData.value.map(item => item.name)
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      name: "综合得分",
      type: "bar",
      data: athletePerformanceData.value.map(item => item.score),
      barWidth: "60%",
      itemStyle: {
        borderRadius: [4, 4, 0, 0]
      }
    }
  ]
}));

// 观众参与度分析图表配置
const audienceEngagementOption = computed(() => ({
  tooltip: {
    trigger: "axis"
  },
  legend: {
    data: ["到场率", "满意度"]
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true
  },
  xAxis: {
    type: "category",
    data: audienceEngagementData.value.map(item => item.month)
  },
  yAxis: {
    type: "value",
    max: 100
  },
  series: [
    {
      name: "到场率",
      type: "line",
      data: audienceEngagementData.value.map(item => item.attendance),
      smooth: true
    },
    {
      name: "满意度",
      type: "line",
      data: audienceEngagementData.value.map(item => item.satisfaction),
      smooth: true
    }
  ]
}));

// 球队胜率对比图表配置
const teamWinRateOption = computed(() => ({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    }
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true
  },
  xAxis: {
    type: "category",
    data: teamWinRateData.value.map(item => item.team)
  },
  yAxis: {
    type: "value",
    max: 100
  },
  series: [
    {
      name: "胜率(%)",
      type: "bar",
      data: teamWinRateData.value.map(item => item.winRate),
      barWidth: "60%",
      itemStyle: {
        borderRadius: [4, 4, 0, 0]
      }
    }
  ]
}));

// 财务收入分析图表配置
const revenueAnalysisOption = computed(() => ({
  tooltip: {
    trigger: "axis"
  },
  legend: {
    data: ["门票收入", "赞助收入", "周边收入"]
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true
  },
  xAxis: {
    type: "category",
    data: revenueAnalysisData.value.map(item => item.month)
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      name: "门票收入",
      type: "bar",
      stack: "total",
      data: revenueAnalysisData.value.map(item => item.ticket)
    },
    {
      name: "赞助收入",
      type: "bar",
      stack: "total",
      data: revenueAnalysisData.value.map(item => item.sponsorship)
    },
    {
      name: "周边收入",
      type: "bar",
      stack: "total",
      data: revenueAnalysisData.value.map(item => item.merchandise)
    }
  ]
}));

// 刷新数据函数
const refreshData = () => {
  // 模拟数据刷新
  totalMatches.value = Math.floor(Math.random() * 50) + 100;
  totalAthletes.value = Math.floor(Math.random() * 100) + 350;
  totalAudience.value = (Math.random() * 50 + 100).toFixed(1) + "万";
  totalRevenue.value = (Math.random() * 200 + 800).toFixed(1);
};

// 组件挂载时执行
onMounted(() => {
  console.log("体育数据大屏页面已加载");
  // 初始筛选数据
  filterData();
});
</script>

<style scoped>
.sport-dashboard {
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f7fa;
}
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.dashboard-header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
}
.dashboard-controls {
  display: flex;
  align-items: center;
}
.dashboard-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}
.overview-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
  transition: all 0.3s ease;
}
.overview-card:hover {
  box-shadow: 0 4px 16px rgb(0 0 0 / 15%);
  transform: translateY(-5px);
}
.card-content {
  display: flex;
  align-items: center;
  padding: 20px;
}
.card-icon {
  margin-right: 20px;
  font-size: 48px;
}
.card-info {
  flex: 1;
}
.card-value {
  margin-bottom: 5px;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
}
.card-label {
  font-size: 14px;
  color: #666666;
}
.dashboard-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
}
.chart-card {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
}
.card-title {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}
.chart-container {
  height: 300px;
}

/* 响应式设计 */
@media (width <= 1200px) {
  .dashboard-charts {
    grid-template-columns: 1fr;
  }
}

@media (width <= 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  .dashboard-controls {
    flex-wrap: wrap;
    gap: 10px;
  }
  .dashboard-overview {
    grid-template-columns: 1fr;
  }
}
</style>
