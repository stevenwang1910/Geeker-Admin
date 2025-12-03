<template>
  <div class="logistics-management">
    <div class="card content-box">
      <span class="text">物流信息管理 📦</span>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-input
          v-model="searchForm.orderNo"
          placeholder="请输入订单号"
          style="width: 200px; margin-right: 10px"
          clearable
        ></el-input>
        <el-input
          v-model="searchForm.expressNo"
          placeholder="请输入快递单号"
          style="width: 200px; margin-right: 10px"
          clearable
        ></el-input>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </div>

      <!-- 筛选器 -->
      <div class="filter-section">
        <SelectFilter :data="filterData" :default-values="filterResult" @change="changeFilter" />
      </div>

      <!-- 物流信息表格 -->
      <div class="table-section">
        <el-table :data="logisticsData" style="width: 100%" border>
          <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
          <el-table-column prop="orderNo" label="订单号" width="150" align="center"></el-table-column>
          <el-table-column prop="expressNo" label="快递单号" width="150" align="center"></el-table-column>
          <el-table-column prop="company" label="快递公司" width="120" align="center"></el-table-column>
          <el-table-column prop="status" label="物流状态" width="120" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="recipient" label="收件人" width="100" align="center"></el-table-column>
          <el-table-column prop="phone" label="联系电话" width="130" align="center"></el-table-column>
          <el-table-column prop="address" label="收货地址" min-width="150"></el-table-column>
          <el-table-column prop="updateTime" label="更新时间" width="150" align="center"></el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template #default="{ row }">
              <el-button size="small" @click="viewDetail(row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination-section">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Logistics">
import { ref, onMounted } from "vue";
import SelectFilter from "@/components/SelectFilter/index.vue";
import { ElMessage } from "element-plus";

// 搜索表单
const searchForm = ref({
  orderNo: "",
  expressNo: ""
});

// 筛选数据
const filterData = [
  {
    title: "物流状态",
    key: "status",
    options: [
      {
        label: "全部",
        value: ""
      },
      {
        label: "已下单",
        value: "1",
        icon: "ShoppingCart"
      },
      {
        label: "已发货",
        value: "2",
        icon: "Van"
      },
      {
        label: "已签收",
        value: "3",
        icon: "Edit"
      },
      {
        label: "已退回",
        value: "4",
        icon: "Guide"
      },
      {
        label: "已完成",
        value: "5",
        icon: "CircleCheck"
      }
    ]
  },
  {
    title: "快递公司",
    key: "company",
    options: [
      {
        label: "全部",
        value: ""
      },
      {
        label: "顺丰速运",
        value: "sf"
      },
      {
        label: "圆通速递",
        value: "yt"
      },
      {
        label: "中通快递",
        value: "zt"
      },
      {
        label: "申通快递",
        value: "st"
      },
      {
        label: "韵达快递",
        value: "yd"
      }
    ]
  }
];

// 筛选结果
const filterResult = ref({ status: "", company: "" });

// 物流数据
const logisticsData = ref([]);

// 分页信息
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

// 模拟物流数据
const mockLogisticsData = () => {
  const data = [];
  const statusList = ["1", "2", "3", "4", "5"];
  const companyList = ["sf", "yt", "zt", "st", "yd"];
  const companyNames = { sf: "顺丰速运", yt: "圆通速递", zt: "中通快递", st: "申通快递", yd: "韵达快递" };

  // 生成100条模拟数据
  for (let i = 1; i <= 100; i++) {
    const status = statusList[Math.floor(Math.random() * statusList.length)];
    const company = companyList[Math.floor(Math.random() * companyList.length)];

    data.push({
      id: i,
      orderNo: `ORD${2024}${String(i).padStart(6, "0")}`,
      expressNo: `${company.toUpperCase()}${Math.floor(Math.random() * 10000000000).toString()}`,
      company: companyNames[company],
      status: status,
      recipient: `收货人${i}`,
      phone: `138${Math.floor(Math.random() * 10000000).toString()}`,
      address: `北京市朝阳区XX街道XX小区${i}号楼${Math.floor(Math.random() * 20) + 1}层${Math.floor(Math.random() * 4) + 1}室`,
      updateTime: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleString()
    });
  }

  return data;
};

// 过滤数据
const filterDataByConditions = (data, searchForm, filterResult) => {
  // 快递公司英文缩写到中文名称的映射
  const companyMap = {
    "sf": "顺丰速运",
    "yt": "圆通速递",
    "zt": "中通快递",
    "st": "申通快递",
    "yd": "韵达快递"
  };

  return data.filter(item => {
    // 订单号过滤
    if (searchForm.orderNo && !item.orderNo.includes(searchForm.orderNo)) {
      return false;
    }

    // 快递单号过滤
    if (searchForm.expressNo && !item.expressNo.includes(searchForm.expressNo)) {
      return false;
    }

    // 物流状态过滤
    if (filterResult.status && item.status !== filterResult.status) {
      return false;
    }

    // 快递公司过滤
    if (filterResult.company) {
      const companyName = companyMap[filterResult.company];
      if (companyName && item.company !== companyName) {
        return false;
      }
    }

    return true;
  });
};

// 加载物流数据
const loadLogisticsData = () => {
  const allData = mockLogisticsData();
  const filteredData = filterDataByConditions(allData, searchForm.value, filterResult.value);

  // 更新分页信息
  pagination.value.total = filteredData.length;

  // 分页处理
  const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
  const endIndex = startIndex + pagination.value.pageSize;
  logisticsData.value = filteredData.slice(startIndex, endIndex);
};

// 搜索
const search = () => {
  pagination.value.currentPage = 1;
  loadLogisticsData();
};

// 重置
const reset = () => {
  searchForm.value = {
    orderNo: "",
    expressNo: ""
  };
  filterResult.value = {
    status: "",
    company: ""
  };
  pagination.value.currentPage = 1;
  loadLogisticsData();
};

// 筛选变化
const changeFilter = (val: typeof filterResult.value) => {
  filterResult.value = val;
  pagination.value.currentPage = 1;
  loadLogisticsData();
};

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.value.pageSize = size;
  pagination.value.currentPage = 1;
  loadLogisticsData();
};

// 分页页码变化
const handleCurrentChange = (page: number) => {
  pagination.value.currentPage = page;
  loadLogisticsData();
};

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap = {
    "1": "info",
    "2": "warning",
    "3": "success",
    "4": "danger",
    "5": "primary"
  };
  return typeMap[status] || "info";
};

// 获取状态标签
const getStatusLabel = (status: string) => {
  const labelMap = {
    "1": "已下单",
    "2": "已发货",
    "3": "已签收",
    "4": "已退回",
    "5": "已完成"
  };
  return labelMap[status] || "未知状态";
};

// 查看详情
const viewDetail = (row: any) => {
  console.log("查看物流详情:", row);
  // 这里可以实现查看物流详情的逻辑，比如打开弹窗或跳转到详情页
  ElMessage.info(`查看订单 ${row.orderNo} 的物流详情`);
};

// 页面加载时初始化数据
onMounted(() => {
  loadLogisticsData();
});
</script>

<style scoped lang="scss">
.logistics-management {
  .card {
    margin-bottom: 20px;
  }

  .search-bar {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
  }

  .filter-section {
    margin-bottom: 20px;
  }

  .table-section {
    margin-bottom: 20px;
  }

  .pagination-section {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
