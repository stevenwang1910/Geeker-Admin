import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LoggerService } from '../logger';
import { useUserStore } from '@/stores/modules/user';

// Mock user store
vi.mock('@/stores/modules/user', () => ({
  useUserStore: vi.fn(() => ({
    getInfo: {
      userId: 'test-user-123',
      username: 'testuser',
      nickname: 'Test User'
    }
  }))
}));

// Mock logger service
vi.mock('@/utils/logger', () => {
  const mockLoggerInstance = {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    operation: vi.fn(),
    apiRequest: vi.fn(),
    apiResponse: vi.fn()
  };
  
  return {
    LoggerService: {
      getInstance: vi.fn(() => mockLoggerInstance)
    },
    default: mockLoggerInstance
  };
});

// Mock fetch for log reporting
vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
  json: vi.fn().mockResolvedValueOnce({ success: true })
}));

describe('LoggerService', () => {
  let logger: LoggerService;
  const userStore = useUserStore();

  beforeEach(() => {
    // Clear console mocks
    vi.clearAllMocks();
    
    // Mock console methods
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    logger = LoggerService.getInstance();
  });

  afterEach(() => {
    // Reset logger instance - 使用vi.clearAllMocks清除所有mock调用
    vi.clearAllMocks();
  });

  it('should create a singleton instance', () => {
    const instance1 = LoggerService.getInstance();
    const instance2 = LoggerService.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should log debug messages correctly', () => {
    const message = 'Debug test message';
    const data = { key: 'value' };

    logger.debug(message, data);

    expect(console.debug).toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled(); // Debug logs are not reported
  });

  it('should log info messages correctly', () => {
    const message = 'Info test message';
    const data = { key: 'value' };

    logger.info(message, data);

    expect(console.info).toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled(); // Info logs are not reported
  });

  it('should log warn messages correctly', () => {
    const message = 'Warn test message';
    const data = { key: 'value' };

    logger.warn(message, data);

    expect(console.warn).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalled(); // Warn logs should be reported
  });

  it('should log error messages correctly', () => {
    const message = 'Error test message';
    const error = new Error('Test error');

    logger.error(message, error);

    expect(console.error).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalled(); // Error logs should be reported
  });

  it('should log operation messages correctly', () => {
    const operation = 'TEST_OPERATION';
    const description = 'Test operation description';
    const data = { key: 'value' };

    logger.operation(operation, description, data);

    expect(console.info).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalled(); // Operation logs should be reported
  });

  it('should log API request messages correctly', () => {
    const url = '/api/test';
    const method = 'GET';
    const params = { id: 123 };

    logger.apiRequest(url, method, params);

    expect(console.info).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalled(); // API request logs should be reported
  });

  it('should log API response messages correctly', () => {
    const url = '/api/test';
    const method = 'GET';
    const statusCode = 200;
    const responseData = { success: true, data: [] };

    logger.apiResponse(url, method, statusCode, responseData);

    expect(console.info).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalled(); // API response logs should be reported
  });

  it('should include user information in logged messages', () => {
    const message = 'Test message with user info';

    logger.info(message);

    expect(console.info).toHaveBeenCalled();
    // Check that user info is included in the log message
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining(userStore.getInfo.userId));
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining(userStore.getInfo.username));
  });

  it('should handle messages with additional data correctly', () => {
    const message = 'Test message with data';
    const data = { key1: 'value1', key2: 'value2' };

    logger.info(message, data);

    expect(console.info).toHaveBeenCalled();
    // Check that data is stringified in the log message
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining(JSON.stringify(data)));
  });

  it('should handle errors correctly in error logs', () => {
    const message = 'Test error log';
    const error = new Error('Test error with stack trace');

    logger.error(message, error);

    expect(console.error).toHaveBeenCalled();
    // Check that error message and stack are included
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining(error.message));
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining(error.stack!));
  });
});