import { defHttp } from "@/api";

// 分类列表接口
export const getCategories = () => {
  return defHttp.get({
    url: "/api/categories"
  });
};

// 资讯列表接口
export const getArticles = (category_id: number = 0, page: number = 1, size: number = 10) => {
  return defHttp.get({
    url: "/api/articles",
    params: {
      category_id,
      page,
      size
    }
  });
};

// 推荐榜单接口
export const getHotArticles = () => {
  return defHttp.get({
    url: "/api/articles/hot"
  });
};

// 文章详情接口
export const getArticleDetail = (id: number) => {
  return defHttp.get({
    url: `/api/articles/${id}`
  });
};

// 相关文章接口
export const getRelatedArticles = (id: number) => {
  return defHttp.get({
    url: `/api/articles/${id}/related`
  });
};

// 搜索文章接口
export const searchArticles = (keyword: string, page: number = 1, size: number = 10) => {
  return defHttp.get({
    url: "/api/articles/search",
    params: {
      keyword,
      page,
      size
    }
  });
};
