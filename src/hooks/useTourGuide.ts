import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";

// 引导步骤接口定义
export interface TourStep {
  title: string;
  description: string;
  targetSelector?: string;
  illustration?: string;
}

// 引导配置接口
export interface TourOptions {
  steps: TourStep[];
  onFinish?: () => void;
  onClose?: () => void;
  onStepChange?: (currentStep: number, totalSteps: number) => void;
}

export function useTourGuide(options: TourOptions) {
  const { steps, onFinish, onClose, onStepChange } = options;

  const showTour = ref(false);
  const currentStepIndex = ref(0);
  const modalStyle = ref({});
  const highlightStyle = ref({});

  // 计算当前步骤
  const currentStep = computed(() => steps[currentStepIndex.value]);

  // 更新浮层位置
  const updateModalPosition = () => {
    const modalWidth = 400;
    const modalHeight = 300;

    if (!currentStep.value.targetSelector) {
      // 没有目标选择器时居中显示
      modalStyle.value = {
        width: `${modalWidth}px`,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      };
      highlightStyle.value = {};
      return;
    }

    const targetElement = document.querySelector(currentStep.value.targetSelector);
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();

      // 检查元素是否可见
      const isVisible = rect.width > 0 && rect.height > 0;

      if (isVisible) {
        // 设置高亮区域样式
        highlightStyle.value = {
          top: `${rect.top}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`
        };

        // 设置模态框位置
        let modalTop = rect.bottom + 20;
        let modalLeft = Math.max(0, rect.left + rect.width / 2 - modalWidth / 2);

        // 确保模态框不超出视口
        if (modalTop + modalHeight > window.innerHeight) {
          modalTop = Math.max(0, rect.top - modalHeight - 20);
        }
        if (modalLeft + modalWidth > window.innerWidth) {
          modalLeft = window.innerWidth - modalWidth - 20;
        }

        modalStyle.value = {
          width: `${modalWidth}px`,
          top: `${modalTop}px`,
          left: `${modalLeft}px`
        };
      } else {
        // 元素存在但不可见，居中显示
        modalStyle.value = {
          width: `${modalWidth}px`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        };
        highlightStyle.value = {};
      }
    } else {
      // 目标元素不存在，居中显示
      modalStyle.value = {
        width: `${modalWidth}px`,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      };
      highlightStyle.value = {};
    }
  };

  // 下一步
  const nextStep = () => {
    if (currentStepIndex.value < steps.length - 1) {
      currentStepIndex.value++;
      nextTick(() => {
        updateModalPosition();
        onStepChange?.(currentStepIndex.value, steps.length);
      });
    }
  };

  // 上一步
  const prevStep = () => {
    if (currentStepIndex.value > 0) {
      currentStepIndex.value--;
      nextTick(() => {
        updateModalPosition();
        onStepChange?.(currentStepIndex.value, steps.length);
      });
    }
  };

  // 关闭引导
  const closeTour = () => {
    showTour.value = false;
    onClose?.();
  };

  // 完成引导
  const finishTour = () => {
    showTour.value = false;
    localStorage.setItem("hasCompletedTour", "true");
    onFinish?.();
  };

  // 开始引导
  const startTour = () => {
    currentStepIndex.value = 0;
    localStorage.setItem("hasStartedTour", "true");
    showTour.value = true;

    nextTick(() => {
      updateModalPosition();
      onStepChange?.(currentStepIndex.value, steps.length);
    });
  };

  // 监听窗口大小变化，重新计算位置
  const handleResize = () => {
    if (showTour.value) {
      updateModalPosition();
    }
  };

  // 暴露的方法
  const tourMethods = {
    startTour,
    closeTour,
    nextStep,
    prevStep,
    finishTour
  };

  // 组件挂载时添加事件监听
  onMounted(() => {
    window.addEventListener("resize", handleResize);
  });

  // 组件卸载时清理事件监听
  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
  });

  return {
    showTour,
    currentStep,
    currentStepIndex,
    steps,
    modalStyle,
    highlightStyle,
    ...tourMethods
  };
}
