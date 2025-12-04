<template>
  <el-dropdown trigger="click" @command="handleCommand">
    <el-button :icon="Printer" circle />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="preview">打印预览</el-dropdown-item>
        <el-dropdown-item command="print">直接打印</el-dropdown-item>
        <el-dropdown-item command="exportExcel">导出Excel</el-dropdown-item>
        <el-dropdown-item command="exportCSV">导出CSV</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts" name="PrintButton">
import { ElMessage } from "element-plus";
import { Printer } from "@element-plus/icons-vue";
import * as XLSX from "xlsx";

interface PrintButtonProps {
  tableData: any[];
  columns: any[];
  tableId?: string;
  list?: any[];
}

const props = withDefaults(defineProps<PrintButtonProps>(), {
  tableId: "print-table",
  list: () => []
});

// 处理下拉菜单命令
const handleCommand = async (command: string) => {
  switch (command) {
    case "preview":
      await printPreview();
      break;
    case "print":
      await printDirect();
      break;
    case "exportExcel":
      exportToExcel();
      break;
    case "exportCSV":
      exportToCSV();
      break;
  }
};

// 打印预览
const printPreview = async () => {
  try {
    // 创建打印窗口
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      ElMessage.error("无法打开打印窗口，请检查浏览器设置");
      return;
    }

    // 构建打印内容
    const printContent = buildPrintContent();

    // 写入打印窗口
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>打印预览</title>
        <style>
          ${getPrintStyles()}
        </style>
      </head>
      <body>
        ${printContent}
      </body>
      </html>
    `);
    printWindow.document.close();

    // 等待页面加载完成后显示打印预览
    printWindow.onload = () => {
      printWindow.focus();
    };
  } catch (error) {
    ElMessage.error("打印预览失败: " + (error as Error).message);
  }
};

// 直接打印
const printDirect = async () => {
  try {
    // 创建打印窗口
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      ElMessage.error("无法打开打印窗口，请检查浏览器设置");
      return;
    }

    // 构建打印内容
    const printContent = buildPrintContent();

    // 写入打印窗口
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>打印</title>
        <style>
          ${getPrintStyles()}
        </style>
      </head>
      <body>
        ${printContent}
      </body>
      </html>
    `);
    printWindow.document.close();

    // 等待页面加载完成后执行打印
    printWindow.onload = () => {
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  } catch (error) {
    ElMessage.error("打印失败: " + (error as Error).message);
  }
};

// 导出Excel
const exportToExcel = () => {
  try {
    // 处理表格数据
    const exportData = processExportData();

    // 创建工作簿和工作表
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "数据列表");

    // 导出文件
    XLSX.writeFile(workbook, `数据导出_${new Date().toISOString().slice(0, 10)}.xlsx`);
    ElMessage.success("Excel导出成功");
  } catch (error) {
    ElMessage.error("Excel导出失败: " + (error as Error).message);
  }
};

// 导出CSV
const exportToCSV = () => {
  try {
    // 处理表格数据
    const exportData = processExportData();

    // 创建CSV内容
    const csvContent = convertToCSV(exportData);

    // 创建下载链接
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `数据导出_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    ElMessage.success("CSV导出成功");
  } catch (error) {
    ElMessage.error("CSV导出失败: " + (error as Error).message);
  }
};

// 构建打印内容
const buildPrintContent = () => {
  // 构建表格头部
  const headerHtml = props.columns
    .filter(col => col.prop && col.prop !== "operation")
    .map(col => `<th>${col.label}</th>`)
    .join("");

  // 构建表格内容
  const data = props.list.length > 0 ? props.list : props.tableData;
  const bodyHtml = data
    .map(row => {
      const cells = props.columns
        .filter(col => col.prop && col.prop !== "operation")
        .map(col => {
          const value = getCellValue(row, col.prop);
          return `<td>${value}</td>`;
        })
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  // 构建水印
  const watermarkHtml = buildWatermark();

  return `
    <div class="print-container">
      ${watermarkHtml}
      <h2>数据列表</h2>
      <table class="print-table">
        <thead>
          <tr>${headerHtml}</tr>
        </thead>
        <tbody>${bodyHtml}</tbody>
      </table>
      <div class="print-footer">
        <p>打印时间: ${new Date().toLocaleString()}</p>
      </div>
    </div>
  `;
};

// 构建水印
const buildWatermark = () => {
  const watermarkText = "内部数据 请勿外传";
  const watermarkCount = 20;
  let watermarkHtml = "";

  for (let i = 0; i < watermarkCount; i++) {
    const top = `${(i % 5) * 20 + 10}%`;
    const left = `${Math.floor(i / 5) * 25 + 10}%`;
    watermarkHtml += `
      <div class="watermark" style="top: ${top}; left: ${left};">
        ${watermarkText}
      </div>
    `;
  }

  return watermarkHtml;
};

// 获取打印样式
const getPrintStyles = () => {
  return `
    @media print {
      body {
        font-family: "Microsoft YaHei", sans-serif;
        margin: 0;
        padding: 20px;
      }
      .print-container {
        position: relative;
        max-width: 100%;
      }
      .watermark {
        position: absolute;
        top: 0;
        left: 0;
        width: 200px;
        height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: rotate(-45deg);
        color: rgba(0, 0, 0, 0.1);
        font-size: 24px;
        font-weight: bold;
        pointer-events: none;
        z-index: 1;
      }
      h2 {
        text-align: center;
        margin-bottom: 20px;
        color: #333;
      }
      .print-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
        z-index: 2;
        position: relative;
      }
      .print-table th,
      .print-table td {
        border: 1px solid #ccc;
        padding: 8px 12px;
        text-align: left;
        font-size: 14px;
      }
      .print-table th {
        background-color: #f5f7fa;
        font-weight: bold;
        color: #333;
      }
      .print-table tr:nth-child(even) {
        background-color: #fafafa;
      }
      .print-footer {
        text-align: right;
        color: #666;
        font-size: 12px;
        margin-top: 20px;
      }
    }
  `;
};

// 处理导出数据
const processExportData = () => {
  const data = props.list.length > 0 ? props.list : props.tableData;
  return data.map(row => {
    const rowData: any = {};
    props.columns.forEach(col => {
      if (col.prop && col.prop !== "operation") {
        rowData[col.label] = getCellValue(row, col.prop);
      }
    });
    return rowData;
  });
};

// 获取单元格值（支持嵌套属性）
const getCellValue = (row: any, prop: string) => {
  if (!prop.includes(".")) {
    return row[prop] ?? "--";
  }
  return prop.split(".").reduce((value, key) => {
    return value ? value[key] : "--";
  }, row);
};

// 转换为CSV格式
const convertToCSV = (data: any[]) => {
  if (data.length === 0) return "";

  // 获取表头
  const headers = Object.keys(data[0]);
  const headerRow = headers.join(",");

  // 获取数据行
  const dataRows = data.map(row => {
    return headers
      .map(header => {
        const value = row[header];
        // 处理包含逗号或引号的情况
        if (value && typeof value === "string" && (value.includes(",") || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? "";
      })
      .join(",");
  });

  return [headerRow, ...dataRows].join("\n");
};
</script>

<style scoped>
/* 组件样式 */
</style>
