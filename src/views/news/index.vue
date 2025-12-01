<template>
  <div class="news-container">
    <!-- 顶部横幅 -->
    <div class="news-banner">
      <img src="@/assets/images/welcome.png" alt="新闻横幅" class="banner-img" />
      <div class="banner-title">资讯中心</div>
    </div>

    <div class="news-content">
      <!-- 左侧分类导航 -->
      <div class="news-sidebar">
        <div class="sidebar-title">新闻分类</div>
        <div class="category-list">
          <div
            v-for="category in categories"
            :key="category.id"
            :class="['category-item', { active: selectedCategory === category.id }]"
            @click="selectCategory(category.id)"
          >
            {{ category.name }}
          </div>
        </div>
      </div>

      <!-- 主内容区 -->
      <div class="news-main">
        <div class="main-header">
          <div class="main-title">{{ currentCategoryName }}</div>
          <div class="main-subtitle">最新资讯</div>
        </div>

        <div class="article-list">
          <div v-for="article in articles" :key="article.id" class="article-item" @click="goToArticleDetail(article.id)">
            <div class="article-thumbnail" v-if="article.thumbnail_url">
              <img :src="article.thumbnail_url" :alt="article.title" />
            </div>
            <div class="article-content">
              <div class="article-title">{{ article.title }}</div>
              <div class="article-summary" v-if="article.summary">{{ article.summary }}</div>
              <div class="article-meta">
                <span class="article-time">{{ formatTime(article.publish_time) }}</span>
                <span class="article-tag" v-for="tag in article.tag" :key="tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            :page-sizes="[10, 20, 30, 40]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>

      <!-- 右侧推荐区 -->
      <div class="news-sidebar-right">
        <div class="sidebar-right-title">热门榜单</div>
        <div class="hot-list">
          <div
            v-for="(hotArticle, index) in hotArticles"
            :key="hotArticle.id"
            class="hot-item"
            @click="goToArticleDetail(hotArticle.id)"
          >
            <div class="hot-rank" :class="{ top3: index < 3 }">
              {{ index + 1 }}
            </div>
            <div class="hot-content">
              <div class="hot-title">{{ hotArticle.title }}</div>
              <div class="hot-score">热度: {{ hotArticle.score }}</div>
            </div>
          </div>
        </div>

        <!-- 搜索框 -->
        <div class="search-box">
          <el-input v-model="searchText" placeholder="搜索资讯" prefix-icon="Search" @keyup.enter="handleSearch">
            <template #append>
              <el-button @click="handleSearch">搜索</el-button>
            </template>
          </el-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getCategoriesApi, getArticlesApi, getHotArticlesApi } from "@/api/modules/news";

const router = useRouter();
const route = useRoute();

// 分类数据
const categories = ref<any[]>([]);
const selectedCategory = ref<number>(0);
const currentCategoryName = computed(() => {
  const category = categories.value.find(c => c.id === selectedCategory.value);
  return category ? category.name : "全部";
});

// 文章数据
const articles = ref<any[]>([]);
const total = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);

// 热门文章数据
const hotArticles = ref<any[]>([]);

// 搜索文本
const searchText = ref<string>("");

// 获取分类列表
const getCategories = async () => {
  try {
    const response = await getCategoriesApi();
    categories.value = response.data;
    // 从URL参数中获取分类ID
    const categoryId = route.query.category_id;
    if (categoryId) {
      selectedCategory.value = parseInt(categoryId as string);
    }
  } catch (error) {
    console.error("获取分类列表失败:", error);
  }
};

// 获取文章列表
const getArticles = async (page: number = 1, size: number = 10) => {
  try {
    const response = await getArticlesApi({ category_id: selectedCategory.value, page, size });
    articles.value = response.data.list;
    total.value = response.data.total;
  } catch (error) {
    console.error("获取文章列表失败:", error);
  }
};

// 获取热门文章
const getHotArticles = async () => {
  try {
    const response = await getHotArticlesApi();
    hotArticles.value = response.data;
  } catch (error) {
    console.error("获取热门文章失败:", error);
  }
};

// 选择分类
const selectCategory = (categoryId: number) => {
  selectedCategory.value = categoryId;
  currentPage.value = 1;
  // 更新URL参数
  router.push({ query: { ...route.query, category_id: categoryId, page: 1 } });
  getArticles(1, pageSize.value);
};

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
  router.push({ query: { ...route.query, size, page: 1 } });
  getArticles(1, size);
};

const handleCurrentChange = (page: number) => {
  currentPage.value = page;
  router.push({ query: { ...route.query, page } });
  getArticles(page, pageSize.value);
};

// 搜索处理
const handleSearch = () => {
  if (searchText.value.trim()) {
    // 这里可以添加搜索逻辑
    console.log("搜索:", searchText.value);
  }
};

// 跳转到文章详情页
const goToArticleDetail = (articleId: number) => {
  router.push(`/news/detail/${articleId}`);
};

// 格式化时间
const formatTime = (time: string) => {
  const date = new Date(time);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (diff < minute) {
    return "刚刚";
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`;
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`;
  } else if (diff < week) {
    return `${Math.floor(diff / day)}天前`;
  } else if (diff < month) {
    return `${Math.floor(diff / week)}周前`;
  } else if (diff < year) {
    return `${Math.floor(diff / month)}个月前`;
  } else {
    return `${Math.floor(diff / year)}年前`;
  }
};

// 页面加载时获取数据
onMounted(() => {
  getCategories();
  getArticles(currentPage.value, pageSize.value);
  getHotArticles();
});
</script>

<style scoped lang="scss">
.news-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.news-banner {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;

  .banner-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .banner-title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 48px;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
}

.news-content {
  display: flex;
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 20px;
  gap: 20px;
}

.news-sidebar {
  width: 250px;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .sidebar-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333333;
  }

  .category-list {
    .category-item {
      padding: 12px 16px;
      margin-bottom: 8px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #666666;

      &:hover {
        background-color: #f0f0f0;
        color: #333333;
      }

      &.active {
        background-color: #409eff;
        color: #ffffff;
      }
    }
  }
}

.news-main {
  flex: 1;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .main-header {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;

    .main-title {
      font-size: 28px;
      font-weight: bold;
      color: #333333;
      margin-bottom: 8px;
    }

    .main-subtitle {
      font-size: 14px;
      color: #999999;
    }
  }

  .article-list {
    .article-item {
      display: flex;
      margin-bottom: 24px;
      padding: 20px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid #f0f0f0;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }

      .article-thumbnail {
        width: 200px;
        height: 120px;
        margin-right: 20px;
        border-radius: 4px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .article-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .article-title {
          font-size: 20px;
          font-weight: bold;
          color: #333333;
          margin-bottom: 8px;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .article-summary {
          font-size: 14px;
          color: #666666;
          line-height: 1.6;
          margin-bottom: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .article-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 12px;
          color: #999999;

          .article-tag {
            padding: 2px 8px;
            background-color: #f0f0f0;
            border-radius: 12px;
            color: #666666;
          }
        }
      }
    }
  }

  .pagination {
    margin-top: 40px;
    display: flex;
    justify-content: center;
  }
}

.news-sidebar-right {
  width: 280px;

  .sidebar-right-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333333;
  }

  .hot-list {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    .hot-item {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateX(4px);
      }

      .hot-rank {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: bold;
        color: #999999;
        background-color: #f0f0f0;
        border-radius: 4px;
        margin-right: 12px;

        &.top3 {
          background-color: #ff6b6b;
          color: #ffffff;
        }
      }

      .hot-content {
        flex: 1;

        .hot-title {
          font-size: 14px;
          color: #333333;
          line-height: 1.4;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .hot-score {
          font-size: 12px;
          color: #999999;
        }
      }
    }
  }

  .search-box {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .news-content {
    flex-direction: column;
  }

  .news-sidebar {
    width: 100%;
  }

  .news-sidebar-right {
    width: 100%;
  }

  .hot-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .news-banner {
    height: 200px;

    .banner-title {
      font-size: 32px;
    }
  }

  .article-item {
    flex-direction: column;

    .article-thumbnail {
      width: 100%;
      height: 200px;
      margin-right: 0;
      margin-bottom: 16px;
    }
  }

  .hot-list {
    grid-template-columns: 1fr;
  }
}
</style>
