import type { UserInfo } from "@/stores/interface";
import { useUserStore } from "@/stores/modules/user";

/**
 * 日志级别
 */
export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  DEBUG = "DEBUG"
}

/**
 * 日志接口
 */
export interface LogItem {
  timestamp: string;
  level: LogLevel;
  userId?: string;
  username?: string;
  operation: string;
  request?: Record<string, any>;
  response?: Record<string, any>;
  error?: Error;
  ip?: string;
  userAgent?: string;
}

/**
 * 日志工具类
 */
class Logger {
  private userStore: ReturnType<typeof useUserStore> | null = null;

  /**
   * 获取当前用户信息
   */
  private getUserInfo(): Partial<UserInfo> {
    try {
      if (!this.userStore) {
        this.userStore = useUserStore();
      }
      const { userInfo } = this.userStore;
      return userInfo || {};
    } catch (error) {
      console.warn("无法获取用户信息，Pinia 尚未初始化", error);
      return {};
    }
  }

  /**
   * 获取客户端IP（模拟实现）
   */
  private getClientIp(): string {
    return (localStorage.getItem("clientIp") || "127.0.0.1") as string;
  }

  /**
   * 获取UserAgent
   */
  private getUserAgent(): string {
    return navigator.userAgent;
  }

  /**
   * 格式化日志
   */
  private formatLog(logItem: LogItem): string {
    const logContent = {
      timestamp: logItem.timestamp,
      level: logItem.level,
      userId: logItem.userId,
      username: logItem.username,
      operation: logItem.operation,
      ip: logItem.ip,
      userAgent: logItem.userAgent,
      request: logItem.request,
      response: logItem.response,
      error: logItem.error?.message
    };
    return JSON.stringify(logContent, null, 2);
  }

  /**
   * 基础日志方法
   */
  private log(level: LogLevel, operation: string, options?: Omit<LogItem, "timestamp" | "level" | "operation">): void {
    const userInfo = this.getUserInfo();
    const logItem: LogItem = {
      timestamp: new Date().toISOString(),
      level,
      operation,
      userId: userInfo.userId,
      username: userInfo.username,
      ip: this.getClientIp(),
      userAgent: this.getUserAgent(),
      ...options
    };

    // 根据日志级别输出到控制台
    switch (level) {
      case LogLevel.INFO:
        console.info(logItem);
        break;
      case LogLevel.WARN:
        console.warn(logItem);
        break;
      case LogLevel.ERROR:
        console.error(logItem);
        break;
      case LogLevel.DEBUG:
        console.debug(logItem);
        break;
    }

    // 存储日志到本地（可以扩展到后端接口）
    this.saveLog(logItem);
  }

  /**
   * 保存日志到本地存储
   */
  private saveLog(logItem: LogItem): void {
    try {
      const logs = JSON.parse(localStorage.getItem("systemLogs") || "[]") as LogItem[];
      logs.unshift(logItem);
      // 最多保存1000条日志
      if (logs.length > 1000) {
        logs.splice(1000);
      }
      localStorage.setItem("systemLogs", JSON.stringify(logs));
    } catch (error) {
      console.error("保存日志失败:", error);
    }
  }

  /**
   * 获取本地日志
   */
  public getLogs(): LogItem[] {
    try {
      return JSON.parse(localStorage.getItem("systemLogs") || "[]") as LogItem[];
    } catch (error) {
      console.error("获取日志失败:", error);
      return [];
    }
  }

  /**
   * 清空所有日志
   */
  public clearLogs(): void {
    try {
      localStorage.removeItem("systemLogs");
    } catch (error) {
      console.error("清空日志失败:", error);
    }
  }

  /**
   * 信息日志
   */
  public info(operation: string, options?: Omit<LogItem, "timestamp" | "level" | "operation">): void {
    this.log(LogLevel.INFO, operation, options);
  }

  /**
   * 警告日志
   */
  public warn(operation: string, options?: Omit<LogItem, "timestamp" | "level" | "operation">): void {
    this.log(LogLevel.WARN, operation, options);
  }

  /**
   * 错误日志
   */
  public error(operation: string, options?: Omit<LogItem, "timestamp" | "level" | "operation">): void {
    this.log(LogLevel.ERROR, operation, options);
  }

  /**
   * 调试日志
   */
  public debug(operation: string, options?: Omit<LogItem, "timestamp" | "level" | "operation">): void {
    this.log(LogLevel.DEBUG, operation, options);
  }
}

export const logger = new Logger();
