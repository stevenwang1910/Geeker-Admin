import http from "@/api";
import type { ResPage } from "@/api/interface";

// 分类列表接口
export const getCategories = () => {
  return http.get<
    Array<{
      id: number;
      name: string;
      sort_order: number;
      is_active: boolean;
    }>
  >("/api/categories");
};

// 资讯列表接口
export const getArticles = (params: { category_id?: number; page?: number; size?: number; keyword?: string }) => {
  return http.get<
    ResPage<{
      id: number;
      title: string;
      summary?: string;
      publish_time: string;
      tag?: string;
      thumbnail_url?: string;
    }>
  >("/api/articles", params);
};

// 热门推荐接口
export const getHotArticles = () => {
  return http.get<
    Array<{
      id: number;
      title: string;
      rank: number;
      score: number;
    }>
  >("/api/articles/hot");
};
