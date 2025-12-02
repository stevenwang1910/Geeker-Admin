import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import logger from '@/utils/logger';
import type { CustomAxiosRequestConfig } from '../index';
import { useUserStore } from '@/stores/modules/user';
import router from '@/routers';

// 排除不需要记录日志的请求
const excludeUrls = ['/api/logs/report'];

// 生成请求ID
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * @description 请求日志记录拦截器
 */
export const setupRequestLogInterceptor = (service: AxiosInstance) => {
  service.interceptors.request.use(
    (config: CustomAxiosRequestConfig) => {
      const url = config.url || '';
      
      // 排除特定URL的日志记录
      if (excludeUrls.some(excludeUrl => url.includes(excludeUrl))) {
        return config;
      }

      const userStore = useUserStore();
      
      // 生成请求ID
      const requestId = generateRequestId();
      
      // 记录请求开始时间
      config._startTime = Date.now();
      
      // 记录请求ID
      config._requestId = requestId;

      // 提取请求信息
      const requestInfo = {
        requestId,
        url: config.url || '',
        method: config.method?.toUpperCase() || 'GET',
        baseURL: config.baseURL || '',
        headers: config.headers,
        params: config.params || {},
        data: config.data || {},
        timestamp: new Date().toISOString(),
        userId: userStore.userId || 'anonymous',
        username: userStore.username || '匿名用户',
        token: userStore.token ? '***' : null,
      };

      // 记录请求日志
      logger.apiRequest(
        requestInfo.url,
        requestInfo.method,
        requestInfo.params,
        {
          requestId,
          userId: requestInfo.userId,
          username: requestInfo.username,
          timestamp: requestInfo.timestamp,
        }
      );

      console.log(`[REQUEST] [${requestId}] ${requestInfo.method} ${requestInfo.url}`, {
        params: requestInfo.params,
        data: requestInfo.data,
        userId: requestInfo.userId,
      });

      return config;
    },
    (error: AxiosError) => {
      const requestId = (error.config as CustomAxiosRequestConfig)?._requestId || generateRequestId();
      const config = error.config as CustomAxiosRequestConfig;
      const url = config?.url || '';

      // 排除特定URL的日志记录
      if (excludeUrls.some(excludeUrl => url.includes(excludeUrl))) {
        return Promise.reject(error);
      }

      // 记录请求错误日志
      logger.error(
        `Request error: ${error.message}`,
        error,
        {
          requestId,
          url: config?.url || '',
          method: config?.method?.toUpperCase() || 'GET',
          timestamp: new Date().toISOString(),
        }
      );

      console.error(`[REQUEST_ERROR] [${requestId}]`, {
        url: config?.url,
        method: config?.method,
        message: error.message,
        stack: error.stack,
      });

      return Promise.reject(error);
    }
  );
};

/**
 * @description 响应日志记录拦截器
 */
export const setupResponseLogInterceptor = (service: AxiosInstance) => {
  service.interceptors.response.use(
    (response: AxiosResponse & { config: CustomAxiosRequestConfig }) => {
      const { data, config } = response;
      const url = config.url || '';

      // 排除特定URL的日志记录
      if (excludeUrls.some(excludeUrl => url.includes(excludeUrl))) {
        return response;
      }

      const requestId = config._requestId || generateRequestId();
      const startTime = config._startTime || Date.now();
      const executionTime = Date.now() - startTime;
      const userStore = useUserStore();

      // 提取响应信息
      const responseInfo = {
        requestId,
        url: config.url || '',
        method: config.method?.toUpperCase() || 'GET',
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: data,
        executionTime,
        timestamp: new Date().toISOString(),
        userId: userStore.userId || 'anonymous',
        username: userStore.username || '匿名用户',
      };

      // 根据状态码决定日志级别
      let logLevel: 'info' | 'warn' | 'error' = 'info';
      if (response.status >= 400 && response.status < 500) {
        logLevel = 'warn';
      } else if (response.status >= 500) {
        logLevel = 'error';
      }

      // 记录响应日志
      logger.apiResponse(
        responseInfo.url,
        responseInfo.method,
        responseInfo.status,
        responseInfo.data,
        {
          requestId,
          executionTime: responseInfo.executionTime,
          userId: responseInfo.userId,
          username: responseInfo.username,
          timestamp: responseInfo.timestamp,
        }
      );

      // 根据日志级别输出到控制台
      const logMethod = logLevel === 'error' ? console.error : 
                       logLevel === 'warn' ? console.warn : console.log;
      
      logMethod(`[RESPONSE] [${requestId}] ${responseInfo.method} ${responseInfo.url}`, {
        status: responseInfo.status,
        statusText: responseInfo.statusText,
        executionTime: `${responseInfo.executionTime}ms`,
        data: responseInfo.data,
        userId: responseInfo.userId,
      });

      return response;
    },
    async (error: AxiosError) => {
      const { response, config } = error;
      const url = config?.url || '';

      // 排除特定URL的日志记录
      if (excludeUrls.some(excludeUrl => url.includes(excludeUrl))) {
        return Promise.reject(error);
      }

      const requestId = (config as CustomAxiosRequestConfig)?._requestId || generateRequestId();
      const startTime = (config as CustomAxiosRequestConfig)?._startTime || Date.now();
      const executionTime = Date.now() - startTime;
      const userStore = useUserStore();

      // 提取错误信息
      const errorInfo = {
        requestId,
        url: config?.url || '',
        method: config?.method?.toUpperCase() || 'GET',
        status: response?.status || 0,
        statusText: response?.statusText || 'Network Error',
        message: error.message,
        stack: error.stack,
        data: response?.data,
        executionTime,
        timestamp: new Date().toISOString(),
        userId: userStore.userId || 'anonymous',
        username: userStore.username || '匿名用户',
        isNetworkError: !response,
        isTimeout: error.message?.includes('timeout'),
      };

      // 记录响应错误日志
      logger.error(
        `Response error: ${errorInfo.message}`,
        error,
        {
          requestId: errorInfo.requestId,
          url: errorInfo.url,
          method: errorInfo.method,
          status: errorInfo.status,
          executionTime: errorInfo.executionTime,
          userId: errorInfo.userId,
          username: errorInfo.username,
          timestamp: errorInfo.timestamp,
          isNetworkError: errorInfo.isNetworkError,
          isTimeout: errorInfo.isTimeout,
        }
      );

      console.error(`[RESPONSE_ERROR] [${requestId}]`, {
        url: errorInfo.url,
        method: errorInfo.method,
        status: errorInfo.status,
        statusText: errorInfo.statusText,
        executionTime: `${errorInfo.executionTime}ms`,
        message: errorInfo.message,
        stack: errorInfo.stack,
        data: errorInfo.data,
        userId: errorInfo.userId,
        isNetworkError: errorInfo.isNetworkError,
        isTimeout: errorInfo.isTimeout,
      });

      return Promise.reject(error);
    }
  );
};

/**
 * @description 路由导航日志记录拦截器
 */
export const setupRouterLogInterceptor = () => {
  // 全局前置守卫 - 记录页面跳转
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();
    const timestamp = new Date().toISOString();
    
    logger.info('页面跳转', {
      from: from.path,
      to: to.path,
      fromName: from.name,
      toName: to.name,
      timestamp,
      userId: userStore.userId || 'anonymous',
      username: userStore.username || '匿名用户',
    });

    console.log(`[ROUTER] [${timestamp}] 页面跳转: ${from.path} -> ${to.path}`, {
      fromName: from.name,
      toName: to.name,
      userId: userStore.userId,
    });

    next();
  });

  // 全局后置钩子 - 记录页面加载完成
  router.afterEach((to, from) => {
    const userStore = useUserStore();
    const timestamp = new Date().toISOString();
    
    logger.info('页面加载完成', {
      path: to.path,
      name: to.name,
      from: from.path,
      timestamp,
      userId: userStore.userId || 'anonymous',
      username: userStore.username || '匿名用户',
    });

    console.log(`[ROUTER] [${timestamp}] 页面加载完成: ${to.path}`, {
      name: to.name,
      userId: userStore.userId,
    });
  });
};

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _startTime?: number;
    _requestId?: string;
    loading?: boolean;
    cancel?: boolean;
  }
}