import type { MockMethod } from "vite-plugin-mock";

// 分类列表数据
const categories = [
  { id: 1, name: "时政", sort_order: 1, is_active: true },
  { id: 2, name: "财经", sort_order: 2, is_active: true },
  { id: 3, name: "文旅", sort_order: 3, is_active: true },
  { id: 4, name: "汽车", sort_order: 4, is_active: true },
  { id: 5, name: "体育", sort_order: 5, is_active: true },
  { id: 6, name: "科技", sort_order: 6, is_active: true },
  { id: 7, name: "娱乐", sort_order: 7, is_active: true },
  { id: 8, name: "军事", sort_order: 8, is_active: true },
  { id: 9, name: "教育", sort_order: 9, is_active: true },
  { id: 10, name: "健康", sort_order: 10, is_active: true }
];

// 生成随机资讯数据
const generateArticles = (count: number, categoryId?: number) => {
  const tags = ["热点", "精选", "原创", "置顶"];
  const categoriesMap = {
    1: ["习近平", "李克强", "政府工作报告", "两会"],
    2: ["股票", "基金", "比特币", "通货膨胀"],
    3: ["旅游", "美食", "文化", "景点"],
    4: ["新能源", "特斯拉", "比亚迪", "自动驾驶"],
    5: ["世界杯", "NBA", "足球", "篮球"],
    6: ["人工智能", "ChatGPT", "元宇宙", "芯片"],
    7: ["电影", "综艺", "明星", "演唱会"],
    8: ["航母", "导弹", "军演", "国防"],
    9: ["高考", "考研", "双减", "教育改革"],
    10: ["新冠", "疫苗", "养生", "医疗"]
  };

  return Array.from({ length: count }, (_, index) => {
    const currentCategoryId = categoryId || Math.floor(Math.random() * 10) + 1;
    const categoryKeywords = categoriesMap[currentCategoryId as keyof typeof categoriesMap];
    const randomKeyword = categoryKeywords[Math.floor(Math.random() * categoryKeywords.length)];

    return {
      id: index + 1,
      title: `${randomKeyword}${Math.floor(Math.random() * 1000)}：${Math.random().toString(36).substring(2, 12)}`,
      summary:
        "这是一篇关于" + randomKeyword + "的新闻资讯摘要，简要介绍了相关事件的背景、过程和重要意义，帮助读者快速了解核心内容。",
      publish_time: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      tag: tags[Math.floor(Math.random() * tags.length)],
      thumbnail_url: `https://picsum.photos/seed/news${index}/200/140.jpg`
    };
  });
};

// 热门推荐数据
const hotArticles = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  title: `热门资讯${index + 1}：${Math.random().toString(36).substring(2, 12)}`,
  rank: index + 1,
  score: Math.floor(Math.random() * 10000) + 1000
}));

export default [
  // 获取分类列表
  {
    url: "/api/categories",
    method: "get",
    response: () => {
      return {
        code: 200,
        message: "success",
        data: categories
      };
    }
  },
  // 获取资讯列表
  {
    url: "/api/articles",
    method: "get",
    response: ({ query }) => {
      const page = parseInt(query.page) || 1;
      const size = parseInt(query.size) || 10;
      const category_id = parseInt(query.category_id);
      const keyword = query.keyword;

      let allArticles = generateArticles(100, category_id);

      // 搜索过滤
      if (keyword) {
        allArticles = allArticles.filter(item => item.title.includes(keyword));
      }

      const total = allArticles.length;
      const list = allArticles.slice((page - 1) * size, page * size);

      return {
        code: 200,
        message: "success",
        data: {
          list,
          total,
          page,
          size
        }
      };
    }
  },
  // 获取热门推荐
  {
    url: "/api/articles/hot",
    method: "get",
    response: () => {
      return {
        code: 200,
        message: "success",
        data: hotArticles
      };
    }
  }
] as MockMethod[];
