<template>
  <div class="sport-dashboard">
    <!-- 页面标题 -->
    <div class="dashboard-header">
      <h1>体育管理数据大屏</h1>
      <div class="date-info">
        <span>{{ currentDate }}</span>
        <span>{{ currentTime }}</span>
      </div>
    </div>

    <!-- 数据概览卡片 -->
    <div class="overview-cards">
      <div class="card-item">
        <div class="card-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
          <el-icon size="40"><User /></el-icon>
        </div>
        <div class="card-content">
          <h3>赛事总数</h3>
          <p class="card-number">{{ overviewData.matchCount }}</p>
          <span class="card-change positive">+{{ overviewData.matchChange }}%</span>
        </div>
      </div>

      <div class="card-item">
        <div class="card-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
          <el-icon size="40"><User /></el-icon>
        </div>
        <div class="card-content">
          <h3>运动员人数</h3>
          <p class="card-number">{{ overviewData.athleteCount }}</p>
          <span class="card-change positive">+{{ overviewData.athleteChange }}%</span>
        </div>
      </div>

      <div class="card-item">
        <div class="card-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
          <el-icon size="40"><View /></el-icon>
        </div>
        <div class="card-content">
          <h3>观众总数</h3>
          <p class="card-number">{{ overviewData.audienceCount }}</p>
          <span class="card-change positive">+{{ overviewData.audienceChange }}%</span>
        </div>
      </div>

      <div class="card-item">
        <div class="card-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
          <el-icon size="40"><Money /></el-icon>
        </div>
        <div class="card-content">
          <h3>总收入(万元)</h3>
          <p class="card-number">{{ overviewData.revenue }}</p>
          <span class="card-change positive">+{{ overviewData.revenueChange }}%</span>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="dashboard-content">
      <!-- 左侧区域 -->
      <div class="content-left">
        <!-- 赛事数据统计 -->
        <div class="chart-box">
          <div class="chart-header">
            <h2>赛事数据统计</h2>
            <div class="chart-filter">
              <el-select v-model="matchFilter" placeholder="选择年份" size="small">
                <el-option label="2024" value="2024" />
                <el-option label="2023" value="2023" />
                <el-option label="2022" value="2022" />
              </el-select>
            </div>
          </div>
          <div class="chart-container">
            <ECharts :option="matchChartOption" :loading="loading" autoresize />
          </div>
        </div>

        <!-- 运动员表现分析 -->
        <div class="chart-box">
          <div class="chart-header">
            <h2>运动员表现分析</h2>
            <div class="chart-filter">
              <el-select v-model="athleteFilter" placeholder="选择项目" size="small">
                <el-option label="足球" value="soccer" />
                <el-option label="篮球" value="basketball" />
                <el-option label="排球" value="volleyball" />
              </el-select>
            </div>
          </div>
          <div class="chart-container">
            <ECharts :option="athleteChartOption" :loading="loading" autoresize />
          </div>
        </div>
      </div>

      <!-- 中间区域 -->
      <div class="content-center">
        <!-- 观众参与度指标 -->
        <div class="chart-box">
          <div class="chart-header">
            <h2>观众参与度指标</h2>
          </div>
          <div class="chart-container">
            <ECharts :option="audienceChartOption" :loading="loading" autoresize />
          </div>
        </div>

        <!-- 财务运营状况 -->
        <div class="chart-box">
          <div class="chart-header">
            <h2>财务运营状况</h2>
            <div class="chart-filter">
              <el-select v-model="financeFilter" placeholder="选择季度" size="small">
                <el-option label="Q1" value="Q1" />
                <el-option label="Q2" value="Q2" />
                <el-option label="Q3" value="Q3" />
                <el-option label="Q4" value="Q4" />
              </el-select>
            </div>
          </div>
          <div class="chart-container">
            <ECharts :option="financeChartOption" :loading="loading" autoresize />
          </div>
        </div>
      </div>

      <!-- 右侧区域 -->
      <div class="content-right">
        <!-- 赛事类型分布 -->
        <div class="chart-box">
          <div class="chart-header">
            <h2>赛事类型分布</h2>
          </div>
          <div class="chart-container">
            <ECharts :option="matchTypeChartOption" :loading="loading" autoresize />
          </div>
        </div>

        <!-- 近期赛事安排 -->
        <div class="chart-box">
          <div class="chart-header">
            <h2>近期赛事安排</h2>
          </div>
          <div class="schedule-list">
            <div v-for="(item, index) in scheduleData" :key="index" class="schedule-item">
              <div class="schedule-date">
                <span class="date-day">{{ item.day }}</span>
                <span class="date-month">{{ item.month }}</span>
              </div>
              <div class="schedule-info">
                <h4>{{ item.title }}</h4>
                <p>{{ item.time }}</p>
                <span class="schedule-status" :class="item.status">{{ item.statusText }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from "vue";
import ECharts from "@/components/ECharts/index.vue";
import { User, View, Money } from "@element-plus/icons-vue";

// 状态管理
const loading = ref(false);
const matchFilter = ref("2024");
const athleteFilter = ref("soccer");
const financeFilter = ref("Q3");
const currentDate = ref("");
const currentTime = ref("");
let timeInterval: any = null;

// 概览数据
const overviewData = reactive({
  matchCount: 128,
  matchChange: 12.5,
  athleteCount: 3240,
  athleteChange: 8.3,
  audienceCount: 125600,
  audienceChange: 18.7,
  revenue: 568.5,
  revenueChange: 24.2
});

// 近期赛事安排数据
const scheduleData = reactive([
  {
    day: "15",
    month: "12月",
    title: "城市足球锦标赛",
    time: "19:30 - 21:30",
    status: "upcoming",
    statusText: "即将开始"
  },
  {
    day: "16",
    month: "12月",
    title: "青少年篮球联赛",
    time: "14:00 - 16:00",
    status: "upcoming",
    statusText: "即将开始"
  },
  {
    day: "17",
    month: "12月",
    title: "羽毛球公开赛",
    time: "09:00 - 12:00",
    status: "upcoming",
    statusText: "即将开始"
  },
  {
    day: "18",
    month: "12月",
    title: "乒乓球精英赛",
    time: "19:00 - 21:00",
    status: "upcoming",
    statusText: "即将开始"
  },
  {
    day: "19",
    month: "12月",
    title: "排球友谊赛",
    time: "15:00 - 17:00",
    status: "upcoming",
    statusText: "即将开始"
  }
]);

// 赛事数据统计图表
const matchChartOption = ref({
  title: {
    text: "月度赛事数量趋势",
    left: "center",
    textStyle: {
      color: "#333",
      fontSize: 16
    }
  },
  tooltip: {
    trigger: "axis"
  },
  legend: {
    data: ["足球", "篮球", "排球", "羽毛球", "乒乓球"],
    bottom: 0
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "15%",
    containLabel: true
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      name: "足球",
      type: "line",
      stack: "总量",
      data: [12, 19, 15, 22, 18, 25, 22, 28, 25, 30, 28, 35],
      smooth: true,
      lineStyle: {
        color: "#667eea"
      },
      areaStyle: {
        color: "rgba(102, 126, 234, 0.1)"
      }
    },
    {
      name: "篮球",
      type: "line",
      stack: "总量",
      data: [8, 12, 10, 15, 12, 18, 16, 22, 19, 25, 22, 28],
      smooth: true,
      lineStyle: {
        color: "#f093fb"
      },
      areaStyle: {
        color: "rgba(240, 147, 251, 0.1)"
      }
    },
    {
      name: "排球",
      type: "line",
      stack: "总量",
      data: [6, 9, 7, 12, 9, 15, 12, 18, 15, 22, 18, 25],
      smooth: true,
      lineStyle: {
        color: "#4facfe"
      },
      areaStyle: {
        color: "rgba(79, 172, 254, 0.1)"
      }
    },
    {
      name: "羽毛球",
      type: "line",
      stack: "总量",
      data: [10, 15, 12, 18, 15, 22, 19, 25, 22, 28, 25, 32],
      smooth: true,
      lineStyle: {
        color: "#fa709a"
      },
      areaStyle: {
        color: "rgba(250, 112, 154, 0.1)"
      }
    },
    {
      name: "乒乓球",
      type: "line",
      stack: "总量",
      data: [14, 20, 16, 24, 20, 28, 25, 32, 28, 35, 32, 38],
      smooth: true,
      lineStyle: {
        color: "#a8edea"
      },
      areaStyle: {
        color: "rgba(168, 237, 234, 0.1)"
      }
    }
  ]
});

// 运动员表现分析图表
const athleteChartOption = computed(() => ({
  title: {
    text: "运动员表现评分",
    left: "center",
    textStyle: {
      color: "#333",
      fontSize: 16
    }
  },
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
    data: ["运动员A", "运动员B", "运动员C", "运动员D", "运动员E", "运动员F", "运动员G", "运动员H"]
  },
  yAxis: {
    type: "value",
    max: 100
  },
  series: [
    {
      name: "技术评分",
      type: "bar",
      data: [85, 92, 78, 88, 90, 82, 86, 94],
      itemStyle: {
        color: "#667eea"
      }
    },
    {
      name: "体能评分",
      type: "bar",
      data: [82, 88, 75, 85, 87, 80, 83, 91],
      itemStyle: {
        color: "#f093fb"
      }
    },
    {
      name: "战术评分",
      type: "bar",
      data: [88, 90, 80, 86, 92, 84, 87, 93],
      itemStyle: {
        color: "#4facfe"
      }
    }
  ]
}));

// 观众参与度指标图表
const audienceChartOption = computed(() => ({
  title: {
    text: "观众参与度对比",
    left: "center",
    textStyle: {
      color: "#333",
      fontSize: 16
    }
  },
  tooltip: {
    trigger: "item"
  },
  legend: {
    orient: "vertical",
    left: "left"
  },
  radar: {
    indicator: [
      { name: "现场观众", max: 100 },
      { name: "电视观众", max: 100 },
      { name: "在线观看", max: 100 },
      { name: "社交媒体互动", max: 100 },
      { name: "观众满意度", max: 100 }
    ]
  },
  series: [
    {
      name: "足球",
      type: "radar",
      data: [
        {
          value: [92, 85, 90, 88, 91],
          name: "足球"
        }
      ],
      itemStyle: {
        color: "#667eea"
      },
      areaStyle: {
        color: "rgba(102, 126, 234, 0.3)"
      }
    },
    {
      name: "篮球",
      type: "radar",
      data: [
        {
          value: [88, 82, 86, 85, 88],
          name: "篮球"
        }
      ],
      itemStyle: {
        color: "#f093fb"
      },
      areaStyle: {
        color: "rgba(240, 147, 251, 0.3)"
      }
    },
    {
      name: "排球",
      type: "radar",
      data: [
        {
          value: [75, 70, 72, 68, 74],
          name: "排球"
        }
      ],
      itemStyle: {
        color: "#4facfe"
      },
      areaStyle: {
        color: "rgba(79, 172, 254, 0.3)"
      }
    }
  ]
}));

// 财务运营状况图表
const financeChartOption = computed(() => ({
  title: {
    text: "财务收入趋势",
    left: "center",
    textStyle: {
      color: "#333",
      fontSize: 16
    }
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    }
  },
  legend: {
    data: ["门票收入", "赞助收入", "转播收入", " merchandise收入"],
    bottom: 0
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "15%",
    containLabel: true
  },
  xAxis: {
    type: "category",
    data: ["Q1", "Q2", "Q3", "Q4"]
  },
  yAxis: {
    type: "value",
    name: "万元"
  },
  series: [
    {
      name: "门票收入",
      type: "bar",
      stack: "总量",
      data: [85, 92, 105, 120],
      itemStyle: {
        color: "#667eea"
      }
    },
    {
      name: "赞助收入",
      type: "bar",
      stack: "总量",
      data: [120, 135, 150, 175],
      itemStyle: {
        color: "#f093fb"
      }
    },
    {
      name: "转播收入",
      type: "bar",
      stack: "总量",
      data: [150, 168, 185, 210],
      itemStyle: {
        color: "#4facfe"
      }
    },
    {
      name: "merchandise收入",
      type: "bar",
      stack: "总量",
      data: [35, 42, 50, 62],
      itemStyle: {
        color: "#fa709a"
      }
    }
  ]
}));

// 赛事类型分布图表
const matchTypeChartOption = computed(() => ({
  title: {
    text: "赛事类型分布",
    left: "center",
    textStyle: {
      color: "#333",
      fontSize: 16
    }
  },
  tooltip: {
    trigger: "item"
  },
  legend: {
    orient: "vertical",
    left: "left"
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
          fontSize: 20,
          fontWeight: "bold"
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 35, name: "足球" },
        { value: 28, name: "篮球" },
        { value: 18, name: "排球" },
        { value: 12, name: "羽毛球" },
        { value: 7, name: "乒乓球" }
      ],
      color: ["#667eea", "#f093fb", "#4facfe", "#fa709a", "#a8edea"]
    }
  ]
}));

// 设置当前日期和时间
const setDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  currentDate.value = `${year}年${month}月${day}日`;
  currentTime.value = `${hours}:${minutes}:${seconds}`;
};

// 模拟数据加载
const loadData = async () => {
  loading.value = true;
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  loading.value = false;
};

// 监听筛选器变化
const handleFilterChange = () => {
  // 这里可以根据筛选条件重新加载数据
  loadData();
};

onMounted(() => {
  setDateTime();
  timeInterval = setInterval(setDateTime, 1000);
  loadData();

  // 监听筛选器变化
  matchFilter.value && handleFilterChange();
  athleteFilter.value && handleFilterChange();
  financeFilter.value && handleFilterChange();
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});
</script>

<style lang="scss" scoped>
.sport-dashboard {
  box-sizing: border-box;
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  margin-bottom: 30px;
  background: rgb(255 255 255 / 90%);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgb(0 0 0 / 10%);
}
.dashboard-header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #333333;
}
.date-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.date-info span {
  margin-bottom: 5px;
  font-size: 14px;
  color: #666666;
}
.date-info span:last-child {
  margin-bottom: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333333;
}
.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}
.card-item {
  display: flex;
  align-items: center;
  padding: 25px;
  background: rgb(255 255 255 / 90%);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgb(0 0 0 / 10%);
  transition: all 0.3s ease;
}
.card-item:hover {
  box-shadow: 0 8px 25px rgb(0 0 0 / 15%);
  transform: translateY(-5px);
}
.card-icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin-right: 20px;
  border-radius: 50%;
}
.card-content h3 {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: #666666;
}
.card-number {
  margin: 0 0 5px;
  font-size: 28px;
  font-weight: 700;
  color: #333333;
}
.card-change {
  padding: 2px 6px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
}
.card-change.positive {
  color: #67c23a;
  background: rgb(103 194 58 / 10%);
}
.card-change.negative {
  color: #f56c6c;
  background: rgb(245 108 108 / 10%);
}
.dashboard-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.content-left,
.content-center,
.content-right {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.chart-box {
  padding: 20px;
  background: rgb(255 255 255 / 90%);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgb(0 0 0 / 10%);
}
.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.chart-header h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #333333;
}
.chart-filter {
  display: flex;
  gap: 10px;
}
.chart-container {
  width: 100%;
  height: 300px;
}
.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 300px;
  overflow-y: auto;
}
.schedule-item {
  display: flex;
  gap: 15px;
  align-items: center;
  padding: 15px;
  background: rgb(245 247 250 / 80%);
  border-radius: 8px;
  transition: all 0.3s ease;
}
.schedule-item:hover {
  background: rgb(245 247 250 / 100%);
  transform: translateX(5px);
}
.schedule-date {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
  width: 60px;
  height: 60px;
  color: #ffffff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
}
.schedule-date .date-day {
  margin-top: 5px;
  font-size: 20px;
  font-weight: 700;
}
.schedule-date .date-month {
  margin-top: -5px;
  font-size: 12px;
}
.schedule-info {
  flex: 1;
  min-width: 0;
}
.schedule-info h4 {
  margin: 0 0 5px;
  overflow: hidden;
  font-size: 14px;
  font-weight: 700;
  color: #333333;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.schedule-info p {
  margin: 0 0 5px;
  font-size: 12px;
  color: #666666;
}
.schedule-status {
  display: inline-block;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 600;
  border-radius: 4px;
}
.schedule-status.upcoming {
  color: #409eff;
  background: rgb(64 158 255 / 10%);
}
.schedule-status.ongoing {
  color: #67c23a;
  background: rgb(103 194 58 / 10%);
}
.schedule-status.completed {
  color: #909399;
  background: rgb(144 147 153 / 10%);
}

/* 响应式设计 */
@media (width <= 1200px) {
  .dashboard-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (width <= 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  .date-info {
    align-items: flex-start;
  }
  .overview-cards {
    grid-template-columns: 1fr;
  }
  .dashboard-content {
    grid-template-columns: 1fr;
  }
  .chart-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  .chart-container {
    height: 250px;
  }
}

@media (width <= 480px) {
  .sport-dashboard {
    padding: 10px;
  }
  .dashboard-header {
    padding: 15px;
  }
  .dashboard-header h1 {
    font-size: 22px;
  }
  .card-item {
    padding: 20px;
  }
  .card-icon {
    width: 60px;
    height: 60px;
  }
  .card-icon el-icon {
    size: 30px;
  }
  .card-number {
    font-size: 24px;
  }
  .chart-box {
    padding: 15px;
  }
  .chart-container {
    height: 200px;
  }
}
</style>
