<template>
  <div class="table-box">
    <ProTable
      ref="tableRef"
      title="用户列表"
      highlight-current-row
      :columns="columns"
      :request-api="getUserList"
      :row-class-name="tableRowClassName"
      :span-method="objectSpanMethod"
      :show-summary="true"
      :summary-method="getSummaries"
      @row-click="rowClick"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="proTable?.element?.toggleAllSelection">全选 / 全不选</el-button>
        <el-button type="primary" :icon="Pointer" plain @click="setCurrent">选中第五行</el-button>
        <el-button type="danger" :icon="Delete" plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)">
          批量删除用户
        </el-button>
        <!-- 打印/导出下拉按钮 -->
        <el-dropdown trigger="click" @command="handlePrintExportCommand">
          <el-button type="info" :icon="Printer">
            打印/导出
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="preview" :icon="View">打印预览</el-dropdown-item>
              <el-dropdown-item command="exportExcel" :icon="Download">导出Excel</el-dropdown-item>
              <el-dropdown-item command="exportCsv" :icon="Document">导出CSV</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="Refresh" @click="resetPass(scope.row)">重置密码</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
      <template #append>
        <span style="color: var(--el-color-primary)">我是插入在表格最后的内容。若表格有合计行，该内容会位于合计行之上。</span>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="complexProTable">
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { User } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { useDownload } from "@/hooks/useDownload";
import ProTable from "@/components/ProTable/index.vue";
import { CirclePlus, Pointer, Delete, Refresh, Printer, ArrowDown, View, Download, Document } from "@element-plus/icons-vue";
import type { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
import { ProTableInstance, ColumnProps, HeaderRenderScope } from "@/components/ProTable/interface";
import { getUserList, deleteUser, resetUserPassWord, getUserStatus, getUserGender, exportUserInfo } from "@/api/modules/user";

// ProTable 实例
const tableRef = ref<ProTableInstance>();

// 自定义渲染表头（使用tsx语法）
const headerRender = (scope: HeaderRenderScope<User.ResUserList>) => {
  return (
    <el-button type="primary" onClick={() => ElMessage.success("我是通过 tsx 语法渲染的表头")}>
      {scope.column.label}
    </el-button>
  );
};

// 表格配置项
const columns = reactive<ColumnProps<User.ResUserList>[]>([
  { type: "selection", width: 80 },
  { type: "index", label: "#", width: 80 },
  { type: "expand", label: "Expand", width: 100 },
  {
    prop: "base",
    label: "基本信息",
    headerRender,
    _children: [
      { prop: "username", label: "用户姓名", width: 110 },
      { prop: "user.detail.age", label: "年龄", width: 100 },
      {
        prop: "gender",
        label: "性别",
        width: 100,
        enum: getUserGender,
        fieldNames: { label: "genderLabel", value: "genderValue" }
      },
      {
        prop: "details",
        label: "详细资料",
        _children: [
          { prop: "idCard", label: "身份证号" },
          { prop: "email", label: "邮箱" },
          { prop: "address", label: "居住地址" }
        ]
      }
    ]
  },
  {
    prop: "status",
    label: "用户状态",
    tag: true,
    enum: getUserStatus,
    fieldNames: { label: "userLabel", value: "userStatus" }
  },
  { prop: "createTime", label: "创建时间", width: 200 },
  { prop: "operation", label: "操作", fixed: "right", width: 230 }
]);

// 选择行
const setCurrent = () => {
  tableRef.value?.element?.setCurrentRow(tableRef.value?.tableData[4]);
  tableRef.value?.element?.toggleRowSelection(tableRef.value?.tableData[4], true);
};

// 表尾合计行（自行根据条件计算）
interface SummaryMethodProps<T = User.ResUserList> {
  columns: TableColumnCtx<T>[];
  data: T[];
}
const getSummaries = (param: SummaryMethodProps) => {
  const { columns } = param;
  const sums: string[] = [];
  columns.forEach((column, index) => {
    if (index === 0) return (sums[index] = "合计");
    else sums[index] = "N/A";
  });
  return sums;
};

// 列合并
interface SpanMethodProps {
  row: User.ResUserList;
  column: TableColumnCtx<User.ResUserList>;
  rowIndex: number;
  columnIndex: number;
}
const objectSpanMethod = ({ rowIndex, columnIndex }: SpanMethodProps) => {
  if (columnIndex === 3) {
    if (rowIndex % 2 === 0) return { rowspan: 2, colspan: 1 };
    else return { rowspan: 0, colspan: 0 };
  }
};

// 设置列样式
const tableRowClassName = ({ rowIndex }: { row: User.ResUserList; rowIndex: number }) => {
  if (rowIndex === 2) return "warning-row";
  if (rowIndex === 6) return "success-row";
  return "";
};

// 单击行
const rowClick = (row: User.ResUserList, column: TableColumnCtx<User.ResUserList>) => {
  if (column.property == "radio" || column.property == "operation") return;
  console.log(row);
  ElMessage.success("当前行被点击了！");
};

// 删除用户信息
const deleteAccount = async (params: User.ResUserList) => {
  await useHandleData(deleteUser, { id: [params.id] }, `删除【${params.username}】用户`);
  tableRef.value?.getTableList();
};

// 批量删除用户信息
const batchDelete = async (id: string[]) => {
  await useHandleData(deleteUser, { id }, "删除所选用户信息");
  tableRef.value?.clearSelection();
  tableRef.value?.getTableList();
};

// 重置用户密码
const resetPass = async (params: User.ResUserList) => {
  await useHandleData(resetUserPassWord, { id: params.id }, `重置【${params.username}】用户密码`);
  tableRef.value?.getTableList();
};

// 处理打印/导出命令
const handlePrintExportCommand = async (command: string) => {
  switch (command) {
    case "preview":
      handlePrintPreview();
      break;
    case "exportExcel":
      await handleExportExcel();
      break;
    case "exportCsv":
      await handleExportCsv();
      break;
    default:
      break;
  }
};

// 打印预览
const handlePrintPreview = () => {
  // 获取表格数据
  const tableData = tableRef.value?.tableData || [];
  if (tableData.length === 0) {
    ElMessage.error("暂无数据可打印");
    return;
  }

  // 创建打印区域
  const printContent = document.createElement("div");
  printContent.className = "print-container";
  printContent.innerHTML = `
    <h2 class="print-title">用户列表</h2>
    <div class="print-table">${generatePrintContent(tableData)}</div>
  `;

  // 添加打印样式
  const style = document.createElement("style");
  style.textContent = `
    @media print {
      body * {
        visibility: hidden;
      }
      .print-container, .print-container * {
        visibility: visible;
      }
      .print-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        padding: 20px;
        font-family: Arial, sans-serif;
      }
      .print-title {
        text-align: center;
        margin-bottom: 20px;
        font-size: 24px;
        font-weight: bold;
      }
      .print-table table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      .print-table th,
      .print-table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      .print-table th {
        background-color: #f5f5f5;
        font-weight: bold;
      }
      .print-table tr:nth-child(even) {
        background-color: #f9f9f9;
      }
      /* 水印样式 */
      .print-container::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url(${generateWatermark()});
        background-repeat: repeat;
        background-size: 300px 300px;
        opacity: 0.1;
        z-index: -1;
        pointer-events: none;
      }
    }
  `;
  printContent.appendChild(style);

  // 将打印区域添加到页面
  document.body.appendChild(printContent);

  // 执行打印
  setTimeout(() => {
    window.print();
    // 打印完成后移除打印区域
    document.body.removeChild(printContent);
  }, 100);
};

// 生成打印内容
const generatePrintContent = (tableData: any[]) => {
  // 递归获取所有可见列（排除选择列、索引列、展开列和操作列）
  const getVisibleColumns = (columns: ColumnProps<User.ResUserList>[]): ColumnProps<User.ResUserList>[] => {
    let visibleColumns: ColumnProps<User.ResUserList>[] = [];
    for (const column of columns) {
      if (column._children && column._children.length > 0) {
        // 如果有子列，递归获取子列
        visibleColumns = visibleColumns.concat(getVisibleColumns(column._children));
      } else if (!["selection", "index", "expand", "operation"].includes(column.type || column.prop)) {
        // 如果没有子列，且不是需要排除的列，添加到可见列
        visibleColumns.push(column);
      }
    }
    return visibleColumns;
  };

  const visibleColumns = getVisibleColumns(columns);
  const enumMap = tableRef.value?.enumMap?.value || new Map();

  // 生成表头
  const thead = `
    <thead>
      <tr>
        ${visibleColumns.map(column => `<th>${column.label}</th>`).join("")}
      </tr>
    </thead>
  `;

  // 生成表体
  const tbody = `
    <tbody>
      ${tableData
        .map(
          row => `
        <tr>
          ${visibleColumns
            .map(column => {
              let value = row[column.prop!];
              // 处理枚举值
              if (column.enum && enumMap.has(column.prop!)) {
                const enumData = enumMap.get(column.prop!);
                const fieldNames = column.fieldNames || { label: "label", value: "value" };
                const enumItem = enumData?.find((item: any) => item[fieldNames.value] === value);
                value = enumItem ? enumItem[fieldNames.label] : value;
              }
              // 处理嵌套属性
              if (column.prop!.includes(".")) {
                const props = column.prop!.split(".");
                value = props.reduce((acc, prop) => acc && acc[prop], row);
              }
              return `<td>${value || "-"}</td>`;
            })
            .join("")}
        </tr>
      `
        )
        .join("")}
    </tbody>
  `;

  // 生成表格
  return `
    <h1>用户列表</h1>
    <table>
      ${thead}
      ${tbody}
    </table>
  `;
};

// 生成水印
const generateWatermark = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 205;
  canvas.height = 140;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.rotate((-20 * Math.PI) / 180);
  ctx.font = "16px Microsoft JhengHei";
  ctx.fillStyle = "rgba(180, 180, 180, 0.3)";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle" as CanvasTextBaseline;
  ctx.fillText("Geeker-Admin", canvas.width / 10, canvas.height / 2);
  ctx.fillText("版权所有", canvas.width / 10, canvas.height / 2 + 20);

  return canvas.toDataURL("image/png");
};

// 导出Excel
const handleExportExcel = async () => {
  try {
    // 获取表格数据
    const tableData = tableRef.value?.tableData || [];
    if (tableData.length === 0) {
      ElMessage.error("暂无数据可导出");
      return;
    }

    // 使用useDownload钩子导出数据
    await useDownload(exportUserInfo, "用户列表", tableRef.value?.searchParam);
    ElMessage.success("Excel导出成功");
  } catch (error) {
    ElMessage.error("Excel导出失败");
    console.error(error);
  }
};

// 导出CSV
const handleExportCsv = async () => {
  try {
    // 获取表格数据
    const tableData = tableRef.value?.tableData || [];
    if (tableData.length === 0) {
      ElMessage.error("暂无数据可导出");
      return;
    }

    // 使用useDownload钩子导出数据
    await useDownload(exportUserInfo, "用户列表", tableRef.value?.searchParam, true, ".csv");
    ElMessage.success("CSV导出成功");
  } catch (error) {
    ElMessage.error("CSV导出失败");
    console.error(error);
  }
};
</script>

<style lang="scss">
.el-table .warning-row,
.el-table .warning-row .el-table-fixed-column--right,
.el-table .warning-row .el-table-fixed-column--left {
  background-color: var(--el-color-warning-light-9);
}
.el-table .success-row,
.el-table .success-row .el-table-fixed-column--right,
.el-table .success-row .el-table-fixed-column--left {
  background-color: var(--el-color-success-light-9);
}
</style>
