<template>
  <div class="news-page">
    <!-- 顶部横幅区域 -->
    <div class="news-banner">
      <img src="/src/assets/images/welcome.png" alt="新闻横幅" class="banner-img" />
      <div class="banner-title">{{ currentCategoryName || "全部资讯" }}</div>
    </div>

    <div class="news-container">
      <!-- 左侧分类导航 -->
      <aside class="news-sidebar">
        <div class="sidebar-title">新闻分类</div>
        <el-scrollbar height="100%">
          <el-menu :default-active="currentCategoryId" mode="vertical" @select="handleCategoryChange" class="category-menu">
            <el-menu-item index="0">
              <span>全部资讯</span>
            </el-menu-item>
            <el-menu-item v-for="category in categories" :key="category.id" :index="category.id.toString()">
              <span>{{ category.name }}</span>
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </aside>

      <!-- 主内容区域 -->
      <main class="news-content">
        <div class="content-header">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索资讯"
            prefix-icon="Search"
            class="search-input"
            @keyup.enter="handleSearch"
          />
        </div>

        <el-card shadow="hover" class="news-item" v-for="article in articles" :key="article.id">
          <div class="article-main">
            <div v-if="article.thumbnail_url" class="article-thumb">
              <img :src="article.thumbnail_url" :alt="article.title" />
            </div>
            <div class="article-info">
              <h2 class="article-title">
                <a @click="goToDetail(article.id)">{{ article.title }}</a>
              </h2>
              <p v-if="article.summary" class="article-summary">{{ article.summary }}</p>
              <div class="article-meta">
                <span class="publish-time">{{ formatTime(article.publish_time) }}</span>
                <span v-if="article.tag" class="article-tag">{{ article.tag }}</span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 分页组件 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.size"
            :total="pagination.total"
            background
            layout="total, prev, pager, next, jumper"
            @size-change="handlePageChange"
            @current-change="handlePageChange"
          />
        </div>
      </main>

      <!-- 右侧推荐区域 -->
      <aside class="news-aside">
        <el-card class="recommend-card">
          <template #header>
            <span class="recommend-title">热门榜单</span>
          </template>
          <div class="recommend-list">
            <div
              class="recommend-item"
              v-for="(item, index) in hotArticles"
              :key="item.id"
              :class="{ top3: index < 3 }"
              @click="goToDetail(item.id)"
            >
              <span class="rank-number">{{ index + 1 }}</span>
              <span class="recommend-title">{{ item.title }}</span>
              <span v-if="item.score" class="recommend-score">{{ item.score }}热度</span>
            </div>
          </div>
        </el-card>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { formatTime } from "@/hooks/useTime";
import { getCategories, getArticles, getHotArticles } from "@/api/modules/news";

const route = useRoute();
const router = useRouter();

// 分类数据
const categories = ref<Array<{ id: number; name: string; sort_order: number; is_active: boolean }>>([]);
const currentCategoryId = ref<string>("0");
const currentCategoryName = ref<string>("全部资讯");

// 资讯列表
const articles = ref<
  Array<{ id: number; title: string; summary?: string; publish_time: string; tag?: string; thumbnail_url?: string }>
>([]);

// 热门推荐
const hotArticles = ref<Array<{ id: number; title: string; rank: number; score: number }>>([]);

// 分页信息
const pagination = ref({
  page: 1,
  size: 10,
  total: 0
});

// 搜索关键词
const searchKeyword = ref("");

// 获取分类列表
const fetchCategories = async () => {
  try {
    const res = await getCategories();
    categories.value = res.data;
  } catch (error) {
    ElMessage.error("获取分类列表失败");
  }
};

// 获取资讯列表
const fetchArticles = async () => {
  try {
    const params = {
      category_id: currentCategoryId.value === "0" ? undefined : Number(currentCategoryId.value),
      page: pagination.value.page,
      size: pagination.value.size,
      keyword: searchKeyword.value || undefined
    };
    const res = await getArticles(params);
    articles.value = res.data.list;
    pagination.value.total = res.data.total;
  } catch (error) {
    ElMessage.error("获取资讯列表失败");
  }
};

// 获取热门推荐
const fetchHotArticles = async () => {
  try {
    const res = await getHotArticles();
    hotArticles.value = res.data;
  } catch (error) {
    ElMessage.error("获取热门推荐失败");
  }
};

// 分类切换
const handleCategoryChange = (val: string) => {
  currentCategoryId.value = val;
  pagination.value.page = 1;
  // 更新URL参数
  router.push({ query: { category: val } });
  // 获取对应分类资讯
  fetchArticles();
  // 设置当前分类名称
  if (val === "0") {
    currentCategoryName.value = "全部资讯";
  } else {
    const category = categories.value.find(item => item.id === Number(val));
    currentCategoryName.value = category?.name || "";
  }
};

// 分页变化
const handlePageChange = () => {
  fetchArticles();
};

// 搜索资讯
const handleSearch = () => {
  pagination.value.page = 1;
  fetchArticles();
};

// 跳转到详情页
const goToDetail = (id: number) => {
  // 预留详情页跳转
  ElMessage.info(`跳转至资讯详情页：${id}`);
};

// 初始化页面
onMounted(() => {
  // 获取URL中的分类参数
  const categoryParam = route.query.category as string;
  if (categoryParam) {
    currentCategoryId.value = categoryParam;
  }

  // 加载数据
  Promise.all([fetchCategories(), fetchHotArticles()]).then(() => {
    fetchArticles();
    // 设置初始分类名称
    if (currentCategoryId.value === "0") {
      currentCategoryName.value = "全部资讯";
    } else {
      const category = categories.value.find(item => item.id === Number(currentCategoryId.value));
      currentCategoryName.value = category?.name || "";
    }
  });
});
</script>

<style scoped lang="scss">
.news-page {
  width: 100%;
  min-height: 100vh;
  background-color: var(--el-bg-color);
}

.news-banner {
  position: relative;
  height: 280px;
  overflow: hidden;
  .banner-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .banner-title {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 20px 40px;
    background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.7));
    color: #fff;
    font-size: 24px;
    font-weight: bold;
  }
}

.news-container {
  display: flex;
  gap: 20px;
  padding: 20px 40px;
  max-width: 1600px;
  margin: 0 auto;
}

.news-sidebar {
  width: 240px;
  flex-shrink: 0;
  .sidebar-title {
    font-size: 18px;
    font-weight: bold;
    padding: 12px 0;
    border-bottom: 1px solid var(--el-border-color);
    margin-bottom: 12px;
  }
  .category-menu {
    border: none;
    .el-menu-item {
      margin: 4px 0;
      border-radius: 4px;
      &:hover {
        background-color: var(--el-fill-color-light);
      }
      &.is-active {
        background-color: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
      }
    }
  }
}

.news-content {
  flex: 1;
  .content-header {
    margin-bottom: 20px;
    .search-input {
      max-width: 400px;
    }
  }
  .news-item {
    margin-bottom: 16px;
    .article-main {
      display: flex;
      gap: 16px;
      .article-thumb {
        width: 200px;
        flex-shrink: 0;
        img {
          width: 100%;
          height: 140px;
          object-fit: cover;
          border-radius: 4px;
        }
      }
      .article-info {
        flex: 1;
        .article-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 8px;
          a {
            color: var(--el-text-color-primary);
            text-decoration: none;
            &:hover {
              color: var(--el-color-primary);
            }
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
        .article-summary {
          color: var(--el-text-color-secondary);
          line-height: 1.6;
          margin-bottom: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
        .article-meta {
          display: flex;
          gap: 16px;
          color: var(--el-text-color-placeholder);
          font-size: 14px;
          .article-tag {
            background-color: var(--el-color-primary-light-9);
            color: var(--el-color-primary);
            padding: 2px 8px;
            border-radius: 4px;
          }
        }
      }
    }
  }
  .pagination-container {
    margin-top: 32px;
    text-align: center;
  }
}

.news-aside {
  width: 300px;
  flex-shrink: 0;
  .recommend-card {
    .recommend-title {
      font-size: 18px;
      font-weight: bold;
    }
    .recommend-list {
      .recommend-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid var(--el-border-color-lighter);
        cursor: pointer;
        &:last-child {
          border-bottom: none;
        }
        &:hover {
          background-color: var(--el-fill-color-light);
          padding-left: 8px;
          border-radius: 4px;
        }
        &.top3 {
          .rank-number {
            background-color: var(--el-color-danger);
            color: #fff;
          }
          .recommend-title {
            font-weight: bold;
          }
        }
        .rank-number {
          width: 24px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          background-color: var(--el-fill-color-light);
          border-radius: 4px;
          font-size: 14px;
          flex-shrink: 0;
        }
        .recommend-title {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .recommend-score {
          font-size: 12px;
          color: var(--el-text-color-placeholder);
        }
      }
    }
  }
}

// 响应式适配
@media (max-width: 1200px) {
  .news-aside {
    display: none;
  }
}

@media (max-width: 768px) {
  .news-banner {
    height: 160px;
    .banner-title {
      padding: 12px 20px;
      font-size: 18px;
    }
  }
  .news-container {
    padding: 12px 20px;
    flex-direction: column;
    .news-sidebar {
      width: 100%;
      margin-bottom: 16px;
      .el-scrollbar {
        height: auto;
      }
      .category-menu {
        display: flex;
        overflow-x: auto;
        .el-menu-item {
          flex-shrink: 0;
        }
      }
    }
  }
}
</style>
