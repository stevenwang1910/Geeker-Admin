<template>
  <div class="news-detail-container">
    <div class="news-detail-main">
      <!-- 文章标题和元信息 -->
      <div class="article-header">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <span class="article-time">{{ formatTime(article.publish_time) }}</span>
          <span class="article-tag" v-for="tag in article.tag" :key="tag">{{ tag }}</span>
        </div>
      </div>

      <!-- 文章缩略图 -->
      <div class="article-thumbnail" v-if="article.thumbnail_url">
        <img :src="article.thumbnail_url" :alt="article.title" />
      </div>

      <!-- 文章内容 -->
      <div class="article-content">
        <p v-for="(paragraph, index) in article.content" :key="index" class="article-paragraph">
          {{ paragraph }}
        </p>
      </div>

      <!-- 相关推荐 -->
      <div class="related-articles">
        <h3 class="related-title">相关推荐</h3>
        <div class="related-list">
          <div v-for="item in relatedArticles" :key="item.id" class="related-item" @click="goToArticleDetail(item.id)">
            <div class="related-thumbnail" v-if="item.thumbnail_url">
              <img :src="item.thumbnail_url" :alt="item.title" />
            </div>
            <div class="related-content">
              <h4 class="related-item-title">{{ item.title }}</h4>
              <p class="related-item-summary" v-if="item.summary">{{ item.summary }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

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
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getArticleDetail, getHotArticles, getRelatedArticles } from "@/api/modules/news";

const router = useRouter();
const route = useRoute();

// 文章详情数据
const article = ref<any>({
  title: "",
  summary: "",
  publish_time: "",
  tag: [],
  thumbnail_url: "",
  content: []
});

// 热门文章数据
const hotArticles = ref<any[]>([]);

// 相关文章数据
const relatedArticles = ref<any[]>([]);

// 获取文章详情
const fetchArticleDetail = async () => {
  try {
    const id = route.params.id;
    const response = await getArticleDetail(Number(id));
    if (response.code === 200) {
      article.value = response.data;
    }
  } catch (error) {
    console.error("获取文章详情失败:", error);
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

// 获取相关文章
const fetchRelatedArticles = async () => {
  try {
    const id = route.params.id;
    const response = await getRelatedArticles(Number(id));
    if (response.code === 200) {
      relatedArticles.value = response.data;
    }
  } catch (error) {
    console.error("获取相关文章失败:", error);
  }
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
  fetchArticleDetail();
  fetchHotArticles();
  fetchRelatedArticles();
});
</script>

<style scoped lang="scss">
.news-detail-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  max-width: 1200px;
  margin: 2rem auto;
  gap: 2rem;
  padding: 0 1rem;
}

/* 主内容区域 */
.news-detail-main {
  flex: 1;
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 文章标题和元信息 */
.article-header {
  margin-bottom: 2rem;

  .article-title {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
    line-height: 1.4;
    margin-bottom: 1rem;
  }

  .article-meta {
    display: flex;
    gap: 1rem;
    align-items: center;

    .article-time {
      font-size: 0.9rem;
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

/* 文章缩略图 */
.article-thumbnail {
  width: 100%;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 2rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

/* 文章内容 */
.article-content {
  margin-bottom: 3rem;

  .article-paragraph {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #333;
    margin-bottom: 1.5rem;
    text-indent: 2em;
  }
}

/* 相关推荐 */
.related-articles {
  border-top: 1px solid #eee;
  padding-top: 2rem;

  .related-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 1.5rem;
  }

  .related-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .related-item {
    width: calc(50% - 0.75rem);
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: #f5f7fa;

    &:hover {
      background-color: #e8ecf1;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .related-thumbnail {
      width: 120px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .related-content {
      flex: 1;

      .related-item-title {
        font-size: 1rem;
        font-weight: bold;
        color: #333;
        line-height: 1.4;
        margin-bottom: 0.5rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .related-item-summary {
        font-size: 0.8rem;
        color: #666;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
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
  .news-detail-container {
    flex-direction: column;
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

  .related-item {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .news-detail-main {
    padding: 1rem;

    .article-title {
      font-size: 1.5rem;
    }

    .article-thumbnail {
      height: 200px;
    }

    .article-paragraph {
      font-size: 1rem;
      text-indent: 1em;
    }
  }

  .recommend-item {
    width: 100%;
  }
}
</style>
