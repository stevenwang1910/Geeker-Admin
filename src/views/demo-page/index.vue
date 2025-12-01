<template>
  <div class="demo-page-container">
    <h1 class="page-title">演示页面</h1>

    <!-- 上传区域 -->
    <div class="upload-section">
      <el-button type="primary" class="upload-btn" @click="showUploadDialog = true">
        <el-icon><Upload /></el-icon>
        上传文件
      </el-button>
    </div>

    <!-- 中央展示区 -->
    <div class="center-content">
      <div class="content-card">
        <h2>中央展示区</h2>
        <p>这里是页面的主要内容区域。</p>
        <p>您可以在这里展示任何您想要的内容，例如文本、图片、表格等。</p>
      </div>
    </div>

    <!-- 操作区域 -->
    <div class="action-section">
      <el-button type="success" class="save-btn" @click="saveChanges">
        <el-icon><Save /></el-icon>
        保存更改
      </el-button>

      <el-dropdown class="more-actions">
        <template #trigger>
          <el-button type="default">
            <el-icon><More /></el-icon>
            其他操作
          </el-button>
        </template>
        <el-dropdown-menu>
          <el-dropdown-item @click="action1">操作1</el-dropdown-item>
          <el-dropdown-item @click="action2">操作2</el-dropdown-item>
          <el-dropdown-item @click="action3">操作3</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 上传对话框 -->
    <el-dialog title="上传文件" v-model="showUploadDialog" width="500px">
      <el-upload
        class="upload-demo"
        action="#"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :file-list="fileList"
      >
        <el-button type="primary" icon="Upload">点击上传</el-button>
        <template #tip>
          <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </template>
      </el-upload>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showUploadDialog = false">取消</el-button>
          <el-button type="primary" @click="uploadFiles">上传</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Upload, Save, More } from "@element-plus/icons-vue";

// 上传对话框显示状态
const showUploadDialog = ref(false);

// 文件列表
const fileList = ref([
  {
    name: "file1.jpg",
    url: "https://example.com/file1.jpg"
  },
  {
    name: "file2.jpg",
    url: "https://example.com/file2.jpg"
  }
]);

// 处理文件预览
const handlePreview = (file: any) => {
  console.log("预览文件:", file);
};

// 处理文件移除
const handleRemove = (file: any) => {
  const index = fileList.value.indexOf(file);
  if (index > -1) {
    fileList.value.splice(index, 1);
  }
};

// 移除文件前的确认
const beforeRemove = (file: any) => {
  return ElMessageBox.confirm(`确定要移除 ${file.name} 吗？`);
};

// 处理文件超出限制
const handleExceed = (files: any[], fileList: any[]) => {
  ElMessage.warning(`您最多只能上传 3 个文件。`);
};

// 上传文件
const uploadFiles = () => {
  // 这里可以添加实际的文件上传逻辑
  ElMessage.success("文件上传成功！");
  showUploadDialog.value = false;
};

// 保存更改
const saveChanges = () => {
  // 这里可以添加实际的保存逻辑
  ElMessage.success("更改保存成功！");
};

// 操作1
const action1 = () => {
  ElMessage.info("执行操作1");
};

// 操作2
const action2 = () => {
  ElMessage.info("执行操作2");
};

// 操作3
const action3 = () => {
  ElMessage.info("执行操作3");
};
</script>

<style scoped>
.demo-page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-title {
  text-align: center;
  margin-bottom: 48px;
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.upload-section {
  text-align: center;
  margin-bottom: 48px;
}

.upload-btn {
  font-size: 16px;
  padding: 12px 24px;
}

.center-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  margin-bottom: 48px;
}

.content-card {
  width: 100%;
  max-width: 800px;
  padding: 32px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.content-card h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.content-card p {
  font-size: 16px;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.6;
}

.action-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.save-btn,
.more-actions .el-button {
  font-size: 16px;
  padding: 12px 24px;
}

.upload-demo {
  margin-bottom: 16px;
}

.dialog-footer {
  text-align: right;
}
</style>
