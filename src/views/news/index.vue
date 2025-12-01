<template>
  <div class="news-container">
    <!-- 顶部横幅 -->
    <div class="news-banner">
      <img src="/public/logo.png" alt="新闻横幅" class="banner-image" />
      <div class="banner-overlay">
        <h1 class="banner-title">新闻资讯</h1>
        <p class="banner-subtitle">最新、最全面的资讯内容</p>
      </div>
    </div>

    <div class="news-main">
      <!-- 左侧分类导航 -->
      <aside class="news-sidebar">
        <div class="sidebar-title">新闻分类</div>
        <ul class="category-list">
          <li
            v-for="category in categories"
            :key="category.id"
            :class="{ active: selectedCategory === category.id }"
            @click="selectCategory(category.id)"
          >
            {{ category.name }}
          </li>
        </ul>
      </aside>

      <!-- 主内容区 -->
      <main class="news-content">
        <div class="content-header">
          <h2 class="content-title">{{ currentCategoryName }}</h2>
          <div class="content-search">
            <el-input v-model="searchKeyword" placeholder="搜索新闻" style="width: 200px" @keyup.enter="searchNews">
              <template #append>
                <el-button @click="searchNews"
                  ><el-icon><Search /></el-icon
                ></el-button>
              </template>
            </el-input>
          </div>
        </div>

        <div class="articles-list">
          <article v-for="article in articles" :key="article.id" class="article-item" @click="goToArticleDetail(article.id)">
            <div class="article-thumbnail" v-if="article.thumbnail_url">
              <img :src="article.thumbnail_url" :alt="article.title" />
            </div>
            <div class="article-content">
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-summary" v-if="article.summary">{{ article.summary }}</p>
              <div class="article-meta">
                <span class="article-time">{{ formatTime(article.publish_time) }}</span>
                <span class="article-tag" v-for="tag in article.tag" :key="tag">{{ tag }}</span>
              </div>
            </div>
          </article>
        </div>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </main>

      <!-- 右侧推荐区 -->
      <aside class="news-recommend">
        <div class="recommend-title">热门推荐</div>
        <ul class="recommend-list">
          <li v-for="(item, index) in hotArticles" :key="item.id" class="recommend-item" @click="goToArticleDetail(item.id)">
            <span class="recommend-rank" :class="{ top3: index < 3 }">
              {{ index + 1 }}
            </span>
            <div class="recommend-content">
              <h4 class="recommend-title-item">{{ item.title }}</h4>
              <p class="recommend-score" v-if="item.score">热度: {{ item.score }}</p>
            </div>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { getCategories, getArticles, getHotArticles } from "@/api/modules/news";

const router = useRouter();

// 分类数据
const categories = ref<any[]>([]);
const selectedCategory = ref<number>(0);
const currentCategoryName = computed(() => {
  const category = categories.value.find(c => c.id === selectedCategory.value);
  return category ? category.name : "全部新闻";
});

// 文章数据
const articles = ref<any[]>([]);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const total = ref<number>(0);

// 热门文章数据
const hotArticles = ref<any[]>([]);

// 搜索关键词
const searchKeyword = ref<string>("");

// 选择分类
const selectCategory = (id: number) => {
  selectedCategory.value = id;
  currentPage.value = 1;
  fetchArticles();
};

// 搜索新闻
const searchNews = () => {
  if (searchKeyword.value.trim()) {
    ElMessage.info(`搜索: ${searchKeyword.value}`);
    // 这里可以添加搜索逻辑
  } else {
    ElMessage.warning("请输入搜索关键词");
  }
};

// 获取分类列表
const fetchCategories = async () => {
  try {
    const response = await getCategories();
    if (response.code === 200) {
      categories.value = [{ id: 0, name: "全部" }, ...response.data];
    }
  } catch (error) {
    console.error("获取分类列表失败:", error);
  }
};

// 获取文章列表
const fetchArticles = async () => {
  try {
    const response = await getArticles(selectedCategory.value, currentPage.value, pageSize.value);
    if (response.code === 200) {
      articles.value = response.data.list;
      total.value = response.data.total;
    }
  } catch (error) {
    console.error("获取文章列表失败:", error);
  }
};

// 获取热门文章
const fetchHotArticles = async () => {
  try {
    const response = await getHotArticles();
    if (response.code === 200) {
      hotArticles.value = response.data;
    }
  } catch (error) {
    console.error("获取热门文章失败:", error);
  }
};

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
  fetchArticles();
};

const handleCurrentChange = (page: number) => {
  currentPage.value = page;
  fetchArticles();
};

// 跳转到文章详情页
const goToArticleDetail = (id: number) => {
  router.push(`/news/detail/${id}`);
};

// 格式化时间
const formatTime = (time: string) => {
  const date = new Date(time);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};

// 页面加载时初始化数据
onMounted(() => {
  fetchCategories();
  fetchArticles();
  fetchHotArticles();
});
</script>

<style scoped lang="scss">
.news-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 顶部横幅 */
.news-banner {
  position: relative;
  height: 300px;
  overflow: hidden;

  .banner-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .banner-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;

    .banner-title {
      font-size: 3rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }

    .banner-subtitle {
      font-size: 1.2rem;
      opacity: 0.9;
    }
  }
}

/* 主内容区域 */
.news-main {
  display: flex;
  max-width: 1200px;
  margin: 2rem auto;
  gap: 2rem;
  padding: 0 1rem;
}

/* 左侧分类导航 */
.news-sidebar {
  width: 200px;
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .sidebar-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #333;
  }

  .category-list {
    list-style: none;

    li {
      padding: 0.8rem 0;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #666;

      &:hover {
        color: #409eff;
        padding-left: 0.5rem;
      }

      &.active {
        color: #409eff;
        font-weight: bold;
        background-color: rgba(64, 158, 255, 0.1);
        padding-left: 0.5rem;
        border-left: 3px solid #409eff;
      }
    }
  }
}

/* 主内容区 */
.news-content {
  flex: 1;
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    .content-title {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
    }
  }

  .articles-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .article-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: #f5f7fa;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .article-thumbnail {
      width: 150px;
      height: 100px;
      border-radius: 8px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .article-content {
      flex: 1;

      .article-title {
        font-size: 1.2rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
        color: #333;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .article-summary {
        font-size: 0.9rem;
        color: #666;
        line-height: 1.5;
        margin-bottom: 0.8rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .article-meta {
        display: flex;
        gap: 1rem;
        align-items: center;

        .article-time {
          font-size: 0.8rem;
          color: #999;
        }

        .article-tag {
          font-size: 0.8rem;
          color: #409eff;
          background-color: rgba(64, 158, 255, 0.1);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }
      }
    }
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }
}

/* 右侧推荐区 */
.news-recommend {
  width: 250px;
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .recommend-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #333;
  }

  .recommend-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .recommend-item {
    display: flex;
    gap: 0.8rem;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: #f5f7fa;
      padding: 0.5rem;
      border-radius: 8px;
    }

    .recommend-rank {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 24px;
      height: 24px;
      font-size: 0.8rem;
      font-weight: bold;
      color: #999;
      background-color: #f5f7fa;
      border-radius: 50%;

      &.top3 {
        color: white;
        background-color: #ff6b6b;
      }

      &:nth-child(2) {
        background-color: #ffa726;
      }

      &:nth-child(3) {
        background-color: #ffd54f;
      }
    }

    .recommend-content {
      flex: 1;

      .recommend-title-item {
        font-size: 0.9rem;
        font-weight: bold;
        color: #333;
        line-height: 1.4;
        margin-bottom: 0.3rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .recommend-score {
        font-size: 0.8rem;
        color: #999;
      }
    }
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .news-main {
    flex-direction: column;
  }

  .news-sidebar {
    width: 100%;
  }

  .category-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .news-recommend {
    width: 100%;
  }

  .recommend-list {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .recommend-item {
    width: calc(50% - 0.5rem);
  }
}

@media (max-width: 768px) {
  .news-banner {
    height: 200px;

    .banner-title {
      font-size: 2rem;
    }

    .banner-subtitle {
      font-size: 1rem;
    }
  }

  .news-content {
    .article-item {
      flex-direction: column;

      .article-thumbnail {
        width: 100%;
        height: 200px;
      }
    }
  }

  .recommend-item {
    width: 100%;
  }
}
</style>
