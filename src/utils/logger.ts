import type { SystemLog } from '@/api/interface';
import { useUserStore } from '@/stores/modules/user';

/**
 * @description 日志服务模块 - 提供结构化日志记录功能
 */

// 日志配置
const LOG_CONFIG = {
  // 是否在控制台显示日志
  enableConsole: import.meta.env.MODE !== 'production',
  // 是否上报到服务器
  enableReport: import.meta.env.MODE !== 'development',
  // 日志级别过滤
  logLevel: import.meta.env.VITE_APP_LOG_LEVEL || 'info',
};

// 日志级别权重
const LOG_LEVEL_WEIGHT = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * 日志服务类
 * 提供结构化、带上下文的日志记录功能
 */
class LoggerService {
  // 获取当前用户信息
  private getUserInfo() {
    try {
      const userStore = useUserStore();
      return {
        userId: userStore.userInfo.id || '',
        username: userStore.userInfo.name || 'anonymous',
      };
    } catch (error) {
      return { userId: '', username: 'anonymous' };
    }
  }

  // 获取客户端信息
  private getClientInfo() {
    return {
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer,
    };
  }

  // 获取客户端IP（模拟）
  private getClientIP(): string {
    try {
      // 在实际项目中，这个IP应该从服务端获取
      return '127.0.0.1';
    } catch (error) {
      return 'unknown';
    }
  }

  // 检查日志级别是否允许输出
  private shouldLog(level: SystemLog.LogLevel): boolean {
    const configLevel = LOG_CONFIG.logLevel as SystemLog.LogLevel;
    return LOG_LEVEL_WEIGHT[level] >= LOG_LEVEL_WEIGHT[configLevel];
  }

  // 格式化日志输出
  private formatLog(level: SystemLog.LogLevel, message: string, context: Record<string, any> = {}) {
    const userInfo = this.getUserInfo();
    const clientInfo = this.getClientInfo();
    
    const logData = {
      timestamp: clientInfo.timestamp,
      level: level.toUpperCase(),
      message,
      userId: userInfo.userId,
      username: userInfo.username,
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
      url: clientInfo.url,
      ...context,
    };

    return logData;
  }

  // 在控制台输出日志
  private logToConsole(level: SystemLog.LogLevel, message: string, context: Record<string, any> = {}) {
    if (!LOG_CONFIG.enableConsole || !this.shouldLog(level)) return;

    const logData = this.formatLog(level, message, context);
    const logMethod = level === 'debug' ? 'log' : level;
    
    console[logMethod](`[${logData.level}] ${logData.message}`, {
      timestamp: logData.timestamp,
      user: `${logData.username}(${logData.userId})`,
      ...context,
    });
  }

  // 上报日志到服务器
  private async reportLogToServer(logData: any) {
    if (!LOG_CONFIG.enableReport) return;

    try {
      // 异步上报日志，不影响主流程
      await navigator.sendBeacon('/api/logs/report', JSON.stringify(logData));
    } catch (error) {
      console.warn('Failed to report log to server:', error);
    }
  }

  /**
   * 记录日志
   * @param level 日志级别
   * @param message 日志消息
   * @param context 上下文信息
   */
  private log(level: SystemLog.LogLevel, message: string, context: Record<string, any> = {}) {
    this.logToConsole(level, message, context);
    
    if (LOG_CONFIG.enableReport) {
      const logData = this.formatLog(level, message, context);
      this.reportLogToServer(logData);
    }
  }

  /**
   * 记录调试日志
   * @param message 日志消息
   * @param context 上下文信息
   */
  debug(message: string, context: Record<string, any> = {}) {
    this.log('debug', message, context);
  }

  /**
   * 记录信息日志
   * @param message 日志消息
   * @param context 上下文信息
   */
  info(message: string, context: Record<string, any> = {}) {
    this.log('info', message, context);
  }

  /**
   * 记录警告日志
   * @param message 日志消息
   * @param context 上下文信息
   */
  warn(message: string, context: Record<string, any> = {}) {
    this.log('warn', message, context);
  }

  /**
   * 记录错误日志
   * @param message 日志消息
   * @param error 错误对象
   * @param context 上下文信息
   */
  error(message: string, error?: Error, context: Record<string, any> = {}) {
    const errorContext = error
      ? {
          ...context,
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
        }
      : context;

    this.log('error', message, errorContext);
  }

  /**
   * 记录操作日志（用户行为）
   * @param operationType 操作类型
   * @param message 操作描述
   * @param context 上下文信息
   */
  operation(operationType: SystemLog.OperationType, message: string, context: Record<string, any> = {}) {
    this.info(message, {
      ...context,
      operationType,
      type: 'operation',
    });
  }

  /**
   * 记录API请求日志
   * @param url 请求URL
   * @param method 请求方法
   * @param params 请求参数
   * @param context 上下文信息
   */
  apiRequest(url: string, method: string, params?: Record<string, any>, context: Record<string, any> = {}) {
    this.info(`API Request: ${method} ${url}`, {
      ...context,
      url,
      method,
      params,
      type: 'api_request',
    });
  }

  /**
   * 记录API响应日志
   * @param url 请求URL
   * @param method 请求方法
   * @param response 响应数据
   * @param statusCode 状态码
   * @param executionTime 执行时间(ms)
   * @param context 上下文信息
   */
  apiResponse(
    url: string,
    method: string,
    response: any,
    statusCode: number,
    executionTime: number,
    context: Record<string, any> = {},
  ) {
    const level = statusCode >= 400 ? 'error' : 'info';
    const message = `API Response: ${method} ${url} (${statusCode} - ${executionTime}ms)`;

    this.log(level, message, {
      ...context,
      url,
      method,
      response,
      statusCode,
      executionTime,
      type: 'api_response',
    });
  }
}

// 创建单例实例
export const logger = new LoggerService();

export default logger;