import { News } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
import newsCategories from "@/assets/json/newsCategories.json";
import newsArticles from "@/assets/json/newsArticles.json";
import newsHotArticles from "@/assets/json/newsHotArticles.json";

/**
 * @name 新闻模块
 */
// 获取分类列表
export const getCategoriesApi = () => {
  // return http.get<News.ResCategories>(PORT1 + `/categories`);
  // 使用本地JSON数据作为mock数据
  return newsCategories;
};

// 获取资讯列表
export const getArticlesApi = (params: { category_id?: number; page?: number; size?: number }) => {
  // return http.get<News.ResArticles>(PORT1 + `/articles`, params);
  // 使用本地JSON数据作为mock数据
  return newsArticles;
};

// 获取热门文章
export const getHotArticlesApi = () => {
  // return http.get<News.ResHotArticles>(PORT1 + `/articles/hot`);
  // 使用本地JSON数据作为mock数据
  return newsHotArticles;
};
