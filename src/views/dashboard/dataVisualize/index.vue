<template>
  <div class="dataVisualize-box">
    <div class="card top-box">
      <div class="top-title">
        数据可视化
        <el-button type="primary" size="small" class="tour-btn" @click="startDashboardTour"> Begin Tour </el-button>
      </div>
      <el-tabs v-model="tabActive" class="demo-tabs">
        <el-tab-pane v-for="item in tab" :key="item.name" :label="item.label" :name="item.name"></el-tab-pane>
      </el-tabs>
      <!-- 测试引导元素 -->
      <div class="test-tour-elements" style="display: none">
        <div class="upload-btn">上传文件按钮</div>
        <div class="save-btn">保存按钮</div>
        <div class="main-content">中央内容区域</div>
        <div class="more-actions">更多操作按钮</div>
      </div>
      <div class="top-content">
        <el-row :gutter="40">
          <el-col class="mb40" :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <div class="item-left sle">
              <span class="left-title">访问总数</span>
              <div class="img-box">
                <img src="./images/book-sum.png" alt="" />
              </div>
              <span class="left-number">848.132w</span>
            </div>
          </el-col>
          <el-col class="mb40" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-center">
              <div class="gitee-traffic traffic-box">
                <div class="traffic-img">
                  <img src="./images/add_person.png" alt="" />
                </div>
                <span class="item-value">2222</span>
                <span class="traffic-name sle">Gitee 访问量</span>
              </div>
              <div class="gitHub-traffic traffic-box">
                <div class="traffic-img">
                  <img src="./images/add_team.png" alt="" />
                </div>
                <span class="item-value">2222</span>
                <span class="traffic-name sle">GitHub 访问量</span>
              </div>
              <div class="today-traffic traffic-box">
                <div class="traffic-img">
                  <img src="./images/today.png" alt="" />
                </div>
                <span class="item-value">4567</span>
                <span class="traffic-name sle">今日访问量</span>
              </div>
              <div class="yesterday-traffic traffic-box">
                <div class="traffic-img">
                  <img src="./images/book_sum.png" alt="" />
                </div>
                <span class="item-value">1234</span>
                <span class="traffic-name sle">昨日访问量</span>
              </div>
            </div>
          </el-col>
          <el-col class="mb40" :xs="24" :sm="24" :md="24" :lg="10" :xl="10">
            <div class="item-right">
              <div class="echarts-title">Gitee / GitHub 访问量占比</div>
              <div class="book-echarts">
                <Pie ref="pieRef" />
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="card bottom-box">
      <div class="bottom-title">数据来源</div>
      <div class="bottom-tabs">
        <el-tabs v-model="tabActive" class="demo-tabs">
          <el-tab-pane v-for="item in tab" :key="item.name" :label="item.label" :name="item.name"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="curve-echarts">
        <Curve ref="curveRef" />
      </div>
    </div>

    <!-- 引导浮层 -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="showTour" class="tour-overlay" @click.self="closeTour">
          <div class="tour-modal" :style="modalStyle">
            <div class="tour-modal-header">
              <h3>{{ currentStep.title }}</h3>
              <el-button type="text" @click="closeTour" class="close-btn"> ✕ </el-button>
            </div>

            <div class="tour-modal-body">
              <div class="tour-illustration">
                <img :src="currentStep.illustration" :alt="currentStep.title" />
              </div>
              <p class="tour-description-text">{{ currentStep.description }}</p>
            </div>

            <div class="tour-modal-footer">
              <div class="step-indicators">
                <span
                  v-for="(step, index) in steps"
                  :key="index"
                  class="step-indicator"
                  :class="{ active: index === currentStepIndex }"
                ></span>
              </div>

              <div class="tour-actions">
                <el-button v-if="currentStepIndex > 0" @click="prevStep"> 上一步 </el-button>
                <el-button v-if="currentStepIndex < steps.length - 1" type="primary" @click="nextStep"> 下一步 </el-button>
                <el-button v-else type="primary" @click="finishTour"> 结束引导 </el-button>
              </div>
            </div>
          </div>

          <!-- 指向元素的高亮区域 -->
          <div v-if="currentStep.targetSelector" class="tour-highlight" :style="highlightStyle"></div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts" name="dataVisualize">
import { ref, onMounted } from "vue";
import Pie from "./components/pie.vue";
import Curve from "./components/curve.vue";
import { useTourGuide, TourStep } from "@/hooks/useTourGuide";
import { ElMessage } from "element-plus";

const tabActive = ref(1);

const tab = [
  { label: "未来7日", name: 1 },
  { label: "近七日", name: 2 },
  { label: "近一月", name: 3 },
  { label: "近三月", name: 4 },
  { label: "近半年", name: 5 },
  { label: "近一年", name: 6 }
];

// 定义引导步骤
const dashboardTourSteps: TourStep[] = [
  {
    title: "Upload File",
    description: "Put your files here.",
    targetSelector: ".upload-btn",
    illustration: "/vue.svg"
  },
  {
    title: "Save",
    description: "Save your changes.",
    targetSelector: ".save-btn",
    illustration: "/vue.svg"
  },
  {
    title: "Center",
    description: "Displayed in the center of screen.",
    targetSelector: ".main-content",
    illustration: "/vue.svg"
  },
  {
    title: "Other Actions",
    description: "Click to see other actions.",
    targetSelector: ".more-actions",
    illustration: "/vue.svg"
  }
];

// 使用引导钩子
const {
  showTour,
  currentStep,
  currentStepIndex,
  steps,
  modalStyle,
  highlightStyle,
  startTour,
  closeTour,
  nextStep,
  prevStep,
  finishTour
} = useTourGuide({
  steps: dashboardTourSteps,
  onFinish: () => {
    ElMessage.success("引导完成！");
    // 记录完成统计
    console.log("用户完成了引导流程");
  },
  onStepChange: (current, total) => {
    console.log(`步骤切换: ${current + 1}/${total}`);
  }
});

// 开始引导
const startDashboardTour = () => {
  startTour();
};

// 组件挂载时，可以添加一些测试元素用于引导演示
onMounted(() => {
  // 检查是否需要自动显示引导
  const hasCompletedTour = localStorage.getItem("hasCompletedTour");
  if (!hasCompletedTour) {
    // 这里可以添加提示，问用户是否要开始引导
    // 暂时注释掉，避免自动弹出
    // setTimeout(() => {
    //   startDashboardTour();
    // }, 3000);
  }
});
</script>

<style scoped lang="scss">
@import "./index.scss";

.tour-btn {
  float: right;
  margin-left: 20px;
}

/* 为引导演示添加的测试类 */
.upload-btn,
.save-btn,
.main-content,
.more-actions {
  /* 确保这些类存在，即使是空样式 */
}

/* 以下是全局样式，但需要在组件中定义，因为Teleport到body */
:global(.tour-overlay) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

:global(.tour-modal) {
  background: white;
  border-radius: 12px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 0;
  position: absolute;
  overflow: hidden;
}

:global(.tour-modal-header) {
  padding: 20px 25px 15px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 1.3rem;
    color: #1f2937;
  }

  .close-btn {
    font-size: 1.5rem;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f3f4f6;
    }
  }
}

:global(.tour-modal-body) {
  padding: 25px;

  .tour-illustration {
    margin-bottom: 20px;
    display: flex;
    justify-content: center;

    img {
      width: 100px;
      height: 100px;
      object-fit: contain;
    }
  }

  .tour-description-text {
    font-size: 1.1rem;
    color: #4b5563;
    text-align: center;
    margin: 0;
  }
}

:global(.tour-modal-footer) {
  padding: 0 25px 25px;

  .step-indicators {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;

    .step-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #e5e7eb;
      margin: 0 6px;
      transition: all 0.3s;

      &.active {
        background-color: #3b82f6;
        width: 24px;
        border-radius: 4px;
      }
    }
  }

  .tour-actions {
    display: flex;
    justify-content: space-between;

    button {
      min-width: 100px;
    }
  }
}

:global(.tour-highlight) {
  position: absolute;
  border: 3px solid #3b82f6;
  border-radius: 8px;
  z-index: 9998;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
}

:global(.fade-enter-active),
:global(.fade-leave-active) {
  transition: opacity 0.3s;
}

:global(.fade-enter-from),
:global(.fade-leave-to) {
  opacity: 0;
}
</style>
