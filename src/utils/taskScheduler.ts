import cron from "node-cron";
import type { TimingTask } from "@/api/modules/timingTask";
import { ElMessage } from "element-plus";
import { useTimingTaskStore } from "@/stores/modules/timingTask";

// 定时任务调度器类
class TaskScheduler {
  private static instance: TaskScheduler;
  private tasks: Map<string, cron.ScheduledTask> = new Map();
  private taskStore = useTimingTaskStore();

  // 单例模式
  public static getInstance(): TaskScheduler {
    if (!TaskScheduler.instance) {
      TaskScheduler.instance = new TaskScheduler();
    }
    return TaskScheduler.instance;
  }

  // 初始化调度器
  public async init(): Promise<void> {
    try {
      // 获取所有活跃任务
      const activeTasks = await this.taskStore.getActiveTasks();
      if (activeTasks && activeTasks.length > 0) {
        activeTasks.forEach(task => {
          if (task.status === "active") {
            this.scheduleTask(task);
          }
        });
      }
      console.log("定时任务调度器初始化成功");
    } catch (error) {
      console.error("定时任务调度器初始化失败:", error);
    }
  }

  // 开始调度器
  public start(): void {
    // 调度器开始逻辑
    console.log("调度器已启动");
  }

  // 停止调度器
  public stop(): void {
    // 调度器停止逻辑
    console.log("调度器已停止");
  }

  // 销毁调度器
  public destroy(): void {
    // 调度器销毁逻辑
    console.log("调度器已销毁");
  }

  // 调度任务
  public scheduleTask(task: TimingTask): void {
    try {
      // 取消已存在的同名任务
      this.unscheduleTask(task.id);

      // 根据任务类型创建调度
      if (task.cronExpression) {
        // Cron表达式调度
        if (!this.validateCronExpression(task.cronExpression)) {
          throw new Error(`Cron表达式格式错误: ${task.cronExpression}`);
        }

        const scheduledTask = cron.schedule(
          task.cronExpression,
          async () => {
            await this.executeTask(task);
          },
          {
            scheduled: false // 初始不立即执行，需要手动start
          }
        );

        // 存储任务
        this.tasks.set(task.id, scheduledTask);

        // 如果任务状态是活跃，则启动任务
        if (task.status === "active") {
          scheduledTask.start();
          console.log(`Cron任务已调度: ${task.name} (ID: ${task.id})`);
        }
      } else if (task.interval && task.intervalUnit) {
        // 固定间隔调度
        const intervalMs = this.convertIntervalToMs(task.interval, task.intervalUnit);

        const scheduledTask = { start: () => {}, stop: () => {}, destroy: () => {} };

        // 设置定时器
        const timer = setInterval(async () => {
          await this.executeTask(task);
        }, intervalMs);

        // 封装定时任务对象
        scheduledTask.start = () => {
          console.log(`间隔任务已启动: ${task.name} (ID: ${task.id}) - ${task.interval} ${task.intervalUnit}`);
        };

        scheduledTask.stop = () => {
          clearInterval(timer);
          console.log(`间隔任务已暂停: ${task.name} (ID: ${task.id})`);
        };

        scheduledTask.destroy = () => {
          clearInterval(timer);
          console.log(`间隔任务已销毁: ${task.name} (ID: ${task.id})`);
        };

        // 存储任务
        this.tasks.set(task.id, scheduledTask as unknown as cron.ScheduledTask);

        // 如果任务状态是活跃，则启动任务
        if (task.status === "active") {
          scheduledTask.start();
        }
      }
    } catch (error) {
      console.error(`调度任务失败: ${task.name} (ID: ${task.id})`, error);
      throw error;
    }
  }

  // 执行任务
  private async executeTask(task: TimingTask): Promise<void> {
    // 由于我们使用mock数据，直接返回成功
    console.log(`任务执行成功: ${task.name} (ID: ${task.id})`);
    await this.recordTaskExecution(task, Date.now(), Date.now(), "success");
  }

  // 记录任务执行情况
  private async recordTaskExecution(
    task: TimingTask,
    startTime: number,
    endTime: number,
    status: "success" | "failure" | "running"
  ): Promise<void> {
    try {
      const duration = endTime - startTime;

      // 调用API记录任务执行日志（模拟）
      console.log(`记录任务执行日志: ${task.id} - ${status}`);

      // 保存到本地存储
      this.saveExecutionHistory();
    } catch (error) {
      console.error("记录任务执行日志失败:", error);
    }
  }

  // 初始化存储
  private initStorage(): void {
    // 由于我们使用mock数据，直接返回
    console.log("初始化存储完成");
  }

  // 清理过期日志
  public cleanExpiredLogs(): void {
    // 模拟清理过期日志
    console.log("历史记录清理完成");
  }

  // 保存执行历史到本地存储
  private saveExecutionHistory(): void {
    if (typeof localStorage === "undefined") return;
    // 保存到本地存储（模拟）
    console.log("保存执行历史到本地存储");
    // 清理过期日志
    this.cleanExpiredLogs();
  }

  // 处理任务执行错误
  private handleTaskError(task: TimingTask, error: Error): void {
    console.error(`任务执行失败: ${task.name}`, error);
    ElMessage.error(`任务执行失败: ${task.name}`);
  }

  // 取消任务调度
  public unscheduleTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.stop();
      task.destroy();
      this.tasks.delete(taskId);
      console.log(`任务已取消调度: ${taskId}`);
    }
  }

  // 启动任务
  public startTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.start();
      console.log(`任务已启动: ${taskId}`);
    } else {
      console.warn(`未找到任务: ${taskId}`);
    }
  }

  // 暂停任务
  public pauseTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.stop();
      console.log(`任务已暂停: ${taskId}`);
    } else {
      console.warn(`未找到任务: ${taskId}`);
    }
  }

  // 验证Cron表达式并返回下次执行时间
  public getNextExecutionTime(cronExpression: string): Date | null {
    try {
      if (!this.validateCronExpression(cronExpression)) {
        return null;
      }

      const nextDate = new Date();
      nextDate.setMilliseconds(0);
      nextDate.setSeconds(nextDate.getSeconds() + 1); // 从下一秒开始计算

      const schedule = new cron.Scheduler();
      const task = schedule.schedule(cronExpression, () => {
        console.log("任务执行中");
      });
      const nextExecution = task.nextDates(1)[0] as Date;
      task.destroy();

      return nextExecution;
    } catch (error) {
      return null;
    }
  }

  // 获取所有当前运行的任务
  public getRunningTasks(): Array<{ taskId: string; taskName: string; type: string }> {
    const runningTasks: Array<{ taskId: string; taskName: string; type: string }> = [];
    // 由于我们使用mock数据，直接返回空数组
    return runningTasks;
  }

  // 销毁所有任务
  public destroyAll(): void {
    this.tasks.forEach((task, taskId) => {
      task.stop();
      task.destroy();
    });
    this.tasks.clear();
    console.log("所有定时任务已销毁");
  }
}

// 创建单例实例
const taskScheduler = TaskScheduler.getInstance();

export default taskScheduler;
