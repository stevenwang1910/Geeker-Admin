import { ElNotification, ElMessageBox } from "element-plus";
import * as XLSX from "xlsx";

/**
 * @description 导出类型
 */
export type ExportType = "current" | "selected" | "all";

/**
 * @description 文件格式
 */
export type FileFormat = "xlsx" | "csv" | "pdf";

/**
 * @description 导出参数
 */
export interface ExportParams {
  type?: ExportType; // 导出类型
  format?: FileFormat; // 文件格式
  selectedData?: any[]; // 选中的数据
  currentData?: any[]; // 当前页数据
  columns?: any[]; // 列配置
}

/**
 * @description 接收数据流生成 blob，创建链接，下载文件
 * @param {Function} api 导出表格的api方法 (必传)
 * @param {String} tempName 导出的文件名 (必传)
 * @param {Object} params 导出的参数 (默认{})
 * @param {Boolean} isNotify 是否有导出消息提示 (默认为 true)
 * @param {String} fileType 导出的文件格式 (默认为.xlsx)
 * */
export const useDownload = async (
  api: (param: any) => Promise<any>,
  tempName: string,
  params: any = {},
  isNotify: boolean = true,
  fileType: string = ".xlsx"
) => {
  if (isNotify) {
    ElNotification({
      title: "温馨提示",
      message: "如果数据庞大会导致下载缓慢哦，请您耐心等待！",
      type: "info",
      duration: 3000
    });
  }
  try {
    const res = await api(params);
    const blob = new Blob([res]);
    // 兼容 edge 不支持 createObjectURL 方法
    if ("msSaveOrOpenBlob" in navigator) return window.navigator.msSaveOrOpenBlob(blob, tempName + fileType);
    const blobUrl = window.URL.createObjectURL(blob);
    const exportFile = document.createElement("a");
    exportFile.style.display = "none";
    exportFile.download = `${tempName}${fileType}`;
    exportFile.href = blobUrl;
    document.body.appendChild(exportFile);
    exportFile.click();
    // 去除下载对 url 的影响
    document.body.removeChild(exportFile);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("导出失败:", error);
    ElNotification({
      title: "温馨提示",
      message: "导出失败，请重试！",
      type: "error"
    });
  }
};

/**
 * @description 前端导出数据（支持当前页、选中数据）
 * @param {String} tempName 导出的文件名 (必传)
 * @param {ExportParams} exportParams 导出参数 (必传)
 * */
export const useFrontendDownload = async (tempName: string, exportParams: ExportParams) => {
  const { type = "current", format = "xlsx", selectedData = [], currentData = [], columns = [] } = exportParams;

  // 选择导出数据
  let exportData: any[] = [];
  switch (type) {
    case "current":
      exportData = currentData;
      break;
    case "selected":
      exportData = selectedData;
      if (exportData.length === 0) {
        ElNotification({
          title: "温馨提示",
          message: "请先选择要导出的数据！",
          type: "warning"
        });
        return;
      }
      break;
    default:
      ElNotification({
        title: "温馨提示",
        message: "不支持的导出类型！",
        type: "warning"
      });
      return;
  }

  if (exportData.length === 0) {
    ElNotification({
      title: "温馨提示",
      message: "没有数据可以导出！",
      type: "warning"
    });
    return;
  }

  try {
    // 处理导出数据，只保留需要的列
    const filteredColumns = columns || [];
    const processedData = exportData.map(row => {
      const processedRow: any = {};
      filteredColumns.forEach(col => {
        const prop = col.prop as string;
        // 处理多级属性
        if (prop.includes(".")) {
          const propPath = prop.split(".");
          let value = row;
          for (const p of propPath) {
            value = value?.[p];
          }
          processedRow[col.label || prop] = value;
        } else {
          processedRow[col.label || prop] = row[prop];
        }
      });
      return processedRow;
    });

    // 根据格式导出
    switch (format) {
      case "xlsx":
        exportToXLSX(tempName, processedData);
        break;
      case "csv":
        exportToCSV(tempName, processedData);
        break;
      case "pdf":
        exportToPDF(tempName, processedData, filteredColumns);
        break;
      default:
        ElNotification({
          title: "温馨提示",
          message: "不支持的文件格式！",
          type: "warning"
        });
        return;
    }

    ElNotification({
      title: "温馨提示",
      message: `导出成功！共导出 ${exportData.length} 条数据。`,
      type: "success"
    });
  } catch (error) {
    console.error("导出失败:", error);
    ElNotification({
      title: "温馨提示",
      message: "导出失败，请重试！",
      type: "error"
    });
  }
};

/**
 * @description 导出为XLSX
 * @param {String} tempName 文件名
 * @param {any[]} data 导出数据
 * */
const exportToXLSX = (tempName: string, data: any[]) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, `${tempName}.xlsx`);
};

/**
 * @description 导出为CSV
 * @param {String} tempName 文件名
 * @param {any[]} data 导出数据
 * */
const exportToCSV = (tempName: string, data: any[]) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvContent = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const blobUrl = window.URL.createObjectURL(blob);
  const exportFile = document.createElement("a");
  exportFile.style.display = "none";
  exportFile.download = `${tempName}.csv`;
  exportFile.href = blobUrl;
  document.body.appendChild(exportFile);
  exportFile.click();
  document.body.removeChild(exportFile);
  window.URL.revokeObjectURL(blobUrl);
};

/**
 * @description 导出为PDF
 * @param {String} tempName 文件名
 * @param {any[]} data 导出数据
 * @param {any[]} columns 列配置
 * */
const exportToPDF = (tempName: string, data: any[], columns: any[]) => {
  try {
    // 动态导入pdfmake以避免增加初始包体积
    import("pdfmake/build/pdfmake").then((pdfMake: any) => {
      import("pdfmake/build/vfs_fonts").then(() => {
        // 注册字体
        pdfMake.vfs = (window as any).pdfMake?.vfs || {};

        // 生成PDF内容
        const pdfContent = generatePDFContent(tempName, data, columns);

        // 创建并下载PDF
        pdfMake.createPdf(pdfContent).download(`${tempName}.pdf`);
      });
    });
  } catch (error) {
    console.error("PDF导出失败:", error);
    // 如果pdfmake导入失败，使用备用的简单文本导出
    const fallbackContent = generateFallbackPDFContent(tempName, data, columns);
    const blob = new Blob([fallbackContent], { type: "application/pdf" });
    const blobUrl = window.URL.createObjectURL(blob);
    const exportFile = document.createElement("a");
    exportFile.style.display = "none";
    exportFile.download = `${tempName}.pdf`;
    exportFile.href = blobUrl;
    document.body.appendChild(exportFile);
    exportFile.click();
    document.body.removeChild(exportFile);
    window.URL.revokeObjectURL(blobUrl);
  }
};

/**
 * @description 生成PDF内容（使用pdfmake）
 * @param {String} tempName 文件名
 * @param {any[]} data 导出数据
 * @param {any[]} columns 列配置
 * @returns {Object} PDF内容配置
 * */
const generatePDFContent = (tempName: string, data: any[], columns: any[]) => {
  // 准备表格数据
  const tableData = data.map(row => {
    return columns.map(col => {
      const header = col.label || col.prop;
      return row[header] || "";
    });
  });

  // PDF内容配置
  return {
    content: [
      {
        text: tempName,
        style: "header",
        margin: [0, 0, 0, 20]
      },
      {
        text: `导出时间: ${new Date().toLocaleString()}`,
        style: "subheader",
        margin: [0, 0, 0, 20]
      },
      {
        text: `共 ${data.length} 条数据`,
        style: "subheader",
        margin: [0, 0, 0, 20]
      },
      {
        table: {
          headerRows: 1,
          widths: columns.map(() => "*"),
          body: [columns.map(col => col.label || col.prop), ...tableData]
        },
        layout: "lightHorizontalLines" // 表格样式
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: "center"
      },
      subheader: {
        fontSize: 12,
        color: "#666"
      }
    },
    defaultStyle: {
      fontSize: 10
    }
  };
};

/**
 * @description 生成备用PDF内容（简单文本格式）
 * @param {String} tempName 文件名
 * @param {any[]} data 导出数据
 * @param {any[]} columns 列配置
 * @returns {string} PDF内容
 * */
const generateFallbackPDFContent = (tempName: string, data: any[], columns: any[]) => {
  let content = `${tempName}\n\n`;
  content += `导出时间: ${new Date().toLocaleString()}\n\n`;
  content += `共 ${data.length} 条数据\n\n`;

  // 添加表头
  const headers = columns.map(col => col.label || col.prop);
  content += headers.join(", ") + "\n\n";

  // 添加数据行
  data.forEach(row => {
    const rowContent = headers.map(header => row[header] || "").join(", ");
    content += rowContent + "\n";
  });

  return content;
};

/**
 * @description 显示导出选项对话框
 * @param {String} tempName 文件名
 * @param {Function} onConfirm 确认回调
 * */
export const showExportDialog = async (tempName: string, onConfirm: (exportParams: ExportParams) => Promise<void>) => {
  try {
    const result = await ElMessageBox.confirm(`请选择导出选项：`, `导出${tempName}`, {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "info",
      showInput: false,
      distinguishCancelAndClose: true,
      callback: async (action, instance: any) => {
        if (action === "confirm") {
          const exportType = (instance.$refs.exportType as any)?.value;
          const fileFormat = (instance.$refs.fileFormat as any)?.value;

          await onConfirm({
            type: exportType,
            format: fileFormat
          });
        }
      }
    });

    // 如果用户直接点击确定按钮（没有使用自定义回调）
    if (result === "confirm") {
      await onConfirm({
        type: "current",
        format: "xlsx"
      });
    }
  } catch (error) {
    // 用户取消操作
  }
};

/**
 * @description 显示详细的导出选项对话框（包含类型和格式选择）
 * @param {String} tempName 文件名
 * @param {Boolean} showSelectedOption 是否显示选中数据选项
 * @param {any[]} columns 列配置
 * @param {Function} onConfirm 确认回调
 * */
export const showDetailedExportDialog = async (
  tempName: string,
  showSelectedOption: boolean,
  columns: any[],
  onConfirm: (exportParams: ExportParams) => Promise<void>
) => {
  // 过滤可导出的列（排除操作列和类型列）
  const exportableColumns = columns.filter(col => col.prop && col.prop !== "operation" && !col.type);

  // 创建临时的DOM元素来显示选项
  const dialogContent = document.createElement("div");
  dialogContent.innerHTML = `
    <div style="margin-bottom: 15px;">
      <label style="display: block; margin-bottom: 5px; font-weight: bold;">导出范围：</label>
      <div style="display: flex; flex-direction: column; gap: 5px;">
        <label style="display: flex; align-items: center; gap: 8px;">
          <input type="radio" name="exportType" value="current" checked>当前页数据
        </label>
        ${showSelectedOption ? '<label style="display: flex; align-items: center; gap: 8px;"><input type="radio" name="exportType" value="selected">选中数据</label>' : ""}
      </div>
    </div>
    <div style="margin-bottom: 15px;">
      <label style="display: block; margin-bottom: 5px; font-weight: bold;">导出字段：</label>
      <div style="max-height: 200px; overflow-y: auto; border: 1px solid #e4e7ed; border-radius: 4px; padding: 10px;">
        ${exportableColumns.map(col => `<label style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;"><input type="checkbox" name="exportColumns" value="${col.prop}" checked>${col.label || col.prop}</label>`).join("")}
      </div>
    </div>
    <div>
      <label style="display: block; margin-bottom: 5px; font-weight: bold;">文件格式：</label>
      <div style="display: flex; flex-direction: column; gap: 5px;">
        <label style="display: flex; align-items: center; gap: 8px;">
          <input type="radio" name="fileFormat" value="xlsx" checked>Excel (.xlsx)
        </label>
        <label style="display: flex; align-items: center; gap: 8px;">
          <input type="radio" name="fileFormat" value="csv">CSV (.csv)
        </label>
        <label style="display: flex; align-items: center; gap: 8px;">
          <input type="radio" name="fileFormat" value="pdf">PDF (.pdf)
        </label>
      </div>
    </div>
  `;

  try {
    await (ElMessageBox as any)({
      title: `导出${tempName}`,
      message: dialogContent,
      showCancelButton: true,
      confirmButtonText: "导出",
      cancelButtonText: "取消",
      type: "info",
      dangerouslyUseHTMLString: true,
      beforeClose: async (action: string, instance: any, done: () => void) => {
        if (action === "confirm") {
          // 获取用户选择的选项
          const exportType =
            (dialogContent.querySelector('input[name="exportType"]:checked') as HTMLInputElement)?.value || "current";
          const fileFormat =
            (dialogContent.querySelector('input[name="fileFormat"]:checked') as HTMLInputElement)?.value || "xlsx";
          const selectedColumns = Array.from(dialogContent.querySelectorAll('input[name="exportColumns"]:checked')).map(
            checkbox => (checkbox as HTMLInputElement).value
          );

          // 调用确认回调
          await onConfirm({
            type: exportType as ExportType,
            format: fileFormat as FileFormat,
            columns: exportableColumns.filter(col => selectedColumns.includes(col.prop))
          });

          // 关闭对话框
          done();
        } else {
          done();
        }
      }
    });
  } catch (error) {
    // 用户取消操作
  }
};
