import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import SystemLog from "@/views/system/systemLog/index.vue";
import { ElMessage, ElMessageBox } from "element-plus";

// 模拟 API
vi.mock("@/api/modules/systemLog", () => ({
  getSystemLogList: vi.fn(() => Promise.resolve({
    data: {
      list: [
        {
          id: "1",
          userId: "1",
          username: "admin",
          operation: "login",
          level: "info",
          ip: "127.0.0.1",
          userAgent: "Mozilla/5.0",
          requestUrl: "/api/login",
          requestMethod: "POST",
          requestParams: JSON.stringify({ username: "admin" }),
          responseData: JSON.stringify({ token: "123" }),
          errorMsg: "",
          createdAt: "2023-10-01 10:00:00",
          updatedAt: "2023-10-01 10:00:00"
        }
      ],
      total: 1
    }
  })),
  deleteSystemLog: vi.fn(() => Promise.resolve({ data: {} })),
  clearSystemLog: vi.fn(() => Promise.resolve({ data: {} })),
  exportSystemLog: vi.fn(() => Promise.resolve({ data: new Blob() }))
}));

// 模拟 hooks
vi.mock("@/hooks/useDownload", () => ({
  useDownload: vi.fn(() => Promise.resolve())
}));

describe("SystemLog Component", () => {
  it("should render correctly and display title", () => {
    const wrapper = mount(SystemLog);
    expect(wrapper.find("h2").text()).toBe("系统日志");
  });

  it("should fetch and display log data on mount", async () => {
    const wrapper = mount(SystemLog);
    await wrapper.vm.$nextTick();
    
    // 检查表格是否渲染了数据
    const tableRows = wrapper.findAll(".el-table__row");
    expect(tableRows.length).toBeGreaterThan(0);
    
    // 检查是否显示了用户名
    expect(wrapper.text()).toContain("admin");
  });

  it("should handle search functionality", async () => {
    const wrapper = mount(SystemLog);
    
    // 输入搜索条件
    const usernameInput = wrapper.find("input[placeholder='请输入操作用户']");
    await usernameInput.setValue("admin");
    
    // 点击搜索按钮
    const searchButton = wrapper.find(".el-button--primary");
    await searchButton.trigger("click");
    
    // 检查是否调用了 API
    const { getSystemLogList } = require("@/api/modules/systemLog");
    expect(getSystemLogList).toHaveBeenCalled();
  });

  it("should handle reset functionality", async () => {
    const wrapper = mount(SystemLog);
    
    // 输入搜索条件
    const usernameInput = wrapper.find("input[placeholder='请输入操作用户']");
    await usernameInput.setValue("admin");
    
    // 点击重置按钮
    const resetButton = wrapper.find(".el-button:nth-child(2)");
    await resetButton.trigger("click");
    
    // 检查输入框是否清空
    expect(usernameInput.element.value).toBe("");
  });

  it("should handle view detail functionality", async () => {
    const wrapper = mount(SystemLog);
    await wrapper.vm.$nextTick();
    
    // 点击查看详情按钮
    const viewButton = wrapper.find(".el-button--small");
    await viewButton.trigger("click");
    
    // 检查详情弹窗是否显示
    expect(wrapper.find(".el-dialog").exists()).toBe(true);
    expect(wrapper.find(".el-dialog__title").text()).toBe("日志详情");
  });

  it("should handle export functionality", async () => {
    const wrapper = mount(SystemLog);
    
    // 模拟 ElMessage.success
    const successSpy = vi.spyOn(ElMessage, "success");
    
    // 点击导出按钮
    const exportButton = wrapper.find(".el-button--primary:nth-child(1)");
    await exportButton.trigger("click");
    
    // 检查是否调用了 API 和显示了成功消息
    const { exportSystemLog } = require("@/api/modules/systemLog");
    expect(exportSystemLog).toHaveBeenCalled();
    expect(successSpy).toHaveBeenCalledWith("日志导出成功");
  });

  it("should handle clear functionality with confirmation", async () => {
    const wrapper = mount(SystemLog);
    
    // 模拟 ElMessageBox.confirm 点击确定
    vi.spyOn(ElMessageBox, "confirm").mockResolvedValue(true);
    
    // 模拟 ElMessage.success
    const successSpy = vi.spyOn(ElMessage, "success");
    
    // 点击清空按钮
    const clearButton = wrapper.find(".el-button--danger");
    await clearButton.trigger("click");
    
    // 检查是否调用了 API 和显示了成功消息
    const { clearSystemLog } = require("@/api/modules/systemLog");
    expect(clearSystemLog).toHaveBeenCalled();
    expect(successSpy).toHaveBeenCalledWith("日志清空成功");
  });

  it("should handle clear functionality with cancellation", async () => {
    const wrapper = mount(SystemLog);
    
    // 模拟 ElMessageBox.confirm 点击取消
    vi.spyOn(ElMessageBox, "confirm").mockRejectedValue('cancel');
    
    // 点击清空按钮
    const clearButton = wrapper.find(".el-button--danger");
    await clearButton.trigger("click");
    
    // 检查是否没有调用 API
    const { clearSystemLog } = require("@/api/modules/systemLog");
    expect(clearSystemLog).not.toHaveBeenCalled();
  });
});