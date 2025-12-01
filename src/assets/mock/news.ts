// 新闻分类数据
const categories = [
  { id: 1, name: "时政", sort_order: 1, is_active: true },
  { id: 2, name: "财经", sort_order: 2, is_active: true },
  { id: 3, name: "文旅", sort_order: 3, is_active: true },
  { id: 4, name: "汽车", sort_order: 4, is_active: true },
  { id: 5, name: "体育", sort_order: 5, is_active: true },
  { id: 6, name: "科技", sort_order: 6, is_active: true },
  { id: 7, name: "健康", sort_order: 7, is_active: true },
  { id: 8, name: "教育", sort_order: 8, is_active: true }
];

// 新闻文章数据
const articles = [
  {
    id: 1,
    title: "习近平总书记在全国两会上的重要讲话精神",
    summary: "习近平总书记在全国两会上发表重要讲话，强调要坚持以人民为中心的发展思想，推动高质量发展，实现共同富裕。",
    publish_time: "2023-03-15T10:00:00",
    tag: ["时政", "两会"],
    thumbnail_url: "/public/logo.png",
    category_id: 1
  },
  {
    id: 2,
    title: "2023年中国经济增长预期目标为5%左右",
    summary: "国务院总理李克强在政府工作报告中提出，2023年中国经济增长预期目标为5%左右，这一目标符合中国经济发展的实际情况。",
    publish_time: "2023-03-14T15:30:00",
    tag: ["财经", "经济增长"],
    thumbnail_url: "/public/logo.png",
    category_id: 2
  },
  {
    id: 3,
    title: "故宫博物院推出新展览“何以中国”",
    summary: "故宫博物院推出新展览“何以中国”，通过展示中国古代文物，讲述中国历史文化的发展历程，吸引了大量游客前来参观。",
    publish_time: "2023-03-13T09:00:00",
    tag: ["文旅", "展览"],
    thumbnail_url: "/public/logo.png",
    category_id: 3
  },
  {
    id: 4,
    title: "2023年上海国际汽车工业展览会即将开幕",
    summary:
      "2023年上海国际汽车工业展览会即将开幕，届时将有来自全球的汽车制造商展示最新的汽车技术和产品，吸引了大量汽车爱好者前来参观。",
    publish_time: "2023-03-12T14:00:00",
    tag: ["汽车", "展览会"],
    thumbnail_url: "/public/logo.png",
    category_id: 4
  },
  {
    id: 5,
    title: "中国男足在亚洲杯预选赛中取得胜利",
    summary: "中国男足在亚洲杯预选赛中取得胜利，以2-1的比分战胜了对手，为晋级亚洲杯决赛圈奠定了基础。",
    publish_time: "2023-03-11T20:00:00",
    tag: ["体育", "足球"],
    thumbnail_url: "/public/logo.png",
    category_id: 5
  },
  {
    id: 6,
    title: "ChatGPT引发人工智能热潮，专家提醒需理性看待",
    summary: "ChatGPT引发人工智能热潮，专家提醒需理性看待，人工智能技术的发展既带来了机遇，也带来了挑战，需要加强监管和引导。",
    publish_time: "2023-03-10T16:00:00",
    tag: ["科技", "人工智能"],
    thumbnail_url: "/public/logo.png",
    category_id: 6
  },
  {
    id: 7,
    title: "专家提醒：春季是流感高发季节，需注意预防",
    summary: "专家提醒：春季是流感高发季节，需注意预防，市民应注意个人卫生，勤洗手，戴口罩，避免前往人员密集的场所。",
    publish_time: "2023-03-09T11:00:00",
    tag: ["健康", "流感"],
    thumbnail_url: "/public/logo.png",
    category_id: 7
  },
  {
    id: 8,
    title: "教育部发布2023年教育改革发展规划",
    summary: "教育部发布2023年教育改革发展规划，提出要深化教育体制改革，提高教育质量，促进教育公平，为建设教育强国奠定基础。",
    publish_time: "2023-03-08T10:00:00",
    tag: ["教育", "改革"],
    thumbnail_url: "/public/logo.png",
    category_id: 8
  },
  {
    id: 9,
    title: "习近平总书记考察调研北京城市副中心",
    summary: "习近平总书记考察调研北京城市副中心，强调要坚持规划引领，高质量推进城市副中心建设，打造新时代城市建设的典范。",
    publish_time: "2023-03-07T15:00:00",
    tag: ["时政", "北京"],
    thumbnail_url: "/public/logo.png",
    category_id: 1
  },
  {
    id: 10,
    title: "中国人民银行宣布降准0.25个百分点",
    summary: "中国人民银行宣布降准0.25个百分点，释放长期资金约5300亿元，这一举措将有助于支持实体经济发展，降低企业融资成本。",
    publish_time: "2023-03-06T14:00:00",
    tag: ["财经", "降准"],
    thumbnail_url: "/public/logo.png",
    category_id: 2
  }
];

// 热门文章数据
const hotArticles = [
  { id: 1, title: "习近平总书记在全国两会上的重要讲话精神", rank: 1, score: 98.5 },
  { id: 6, title: "ChatGPT引发人工智能热潮，专家提醒需理性看待", rank: 2, score: 95.2 },
  { id: 2, title: "2023年中国经济增长预期目标为5%左右", rank: 3, score: 92.8 },
  { id: 5, title: "中国男足在亚洲杯预选赛中取得胜利", rank: 4, score: 89.5 },
  { id: 3, title: "故宫博物院推出新展览“何以中国”", rank: 5, score: 87.2 },
  { id: 10, title: "中国人民银行宣布降准0.25个百分点", rank: 6, score: 85.1 },
  { id: 4, title: "2023年上海国际汽车工业展览会即将开幕", rank: 7, score: 82.9 },
  { id: 7, title: "专家提醒：春季是流感高发季节，需注意预防", rank: 8, score: 80.5 },
  { id: 9, title: "习近平总书记考察调研北京城市副中心", rank: 9, score: 78.2 },
  { id: 8, title: "教育部发布2023年教育改革发展规划", rank: 10, score: 75.8 }
];

// 文章详情数据
const articleDetails = [
  {
    id: 1,
    title: "习近平总书记在全国两会上的重要讲话精神",
    summary: "习近平总书记在全国两会上发表重要讲话，强调要坚持以人民为中心的发展思想，推动高质量发展，实现共同富裕。",
    publish_time: "2023-03-15T10:00:00",
    tag: ["时政", "两会"],
    thumbnail_url: "/public/logo.png",
    category_id: 1,
    content: [
      "习近平总书记在全国两会上发表重要讲话，强调要坚持以人民为中心的发展思想，推动高质量发展，实现共同富裕。",
      "讲话指出，过去一年，面对复杂严峻的国际形势和艰巨繁重的国内改革发展稳定任务，以习近平同志为核心的党中央团结带领全党全国各族人民迎难而上，砥砺前行，推动党和国家事业取得新的重大成就。",
      "讲话强调，今年是全面贯彻落实党的二十大精神的开局之年，是实施“十四五”规划承上启下的关键之年。要坚持稳中求进工作总基调，完整、准确、全面贯彻新发展理念，加快构建新发展格局，着力推动高质量发展，更好统筹国内国际两个大局，更好统筹疫情防控和经济社会发展，更好统筹发展和安全，全面深化改革开放，大力提振市场信心，把实施扩大内需战略同深化供给侧结构性改革有机结合起来，突出做好稳增长、稳就业、稳物价工作，有效防范化解重大风险，推动经济运行整体好转，实现质的有效提升和量的合理增长，为全面建设社会主义现代化国家开好局起好步。",
      "讲话指出，要坚持以人民为中心的发展思想，不断实现人民对美好生活的向往。要把保障和改善民生作为工作的出发点和落脚点，着力解决人民群众最关心最直接最现实的利益问题，不断增强人民群众的获得感、幸福感、安全感。",
      "讲话强调，要坚持全面从严治党，深入推进新时代党的建设新的伟大工程。要把党的政治建设摆在首位，坚定拥护“两个确立”、坚决做到“两个维护”，不断提高政治判断力、政治领悟力、政治执行力。要加强干部队伍建设，树立正确的选人用人导向，选拔任用忠诚干净担当的高素质专业化干部。要加强基层党组织建设，发挥基层党组织的战斗堡垒作用和党员的先锋模范作用。要加强作风建设，持之以恒纠治“四风”，特别是形式主义、官僚主义，树立求真务实、真抓实干的工作作风。要加强反腐倡廉建设，坚持不敢腐、不能腐、不想腐一体推进，坚决惩治腐败分子，营造风清气正的政治生态。",
      "讲话最后强调，要紧密团结在以习近平同志为核心的党中央周围，高举中国特色社会主义伟大旗帜，全面贯彻落实党的二十大精神，坚定信心，锐意进取，埋头苦干，为全面建设社会主义现代化国家、全面推进中华民族伟大复兴而团结奋斗。"
    ]
  },
  {
    id: 2,
    title: "2023年中国经济增长预期目标为5%左右",
    summary: "国务院总理李克强在政府工作报告中提出，2023年中国经济增长预期目标为5%左右，这一目标符合中国经济发展的实际情况。",
    publish_time: "2023-03-14T15:30:00",
    tag: ["财经", "经济增长"],
    thumbnail_url: "/public/logo.png",
    category_id: 2,
    content: [
      "国务院总理李克强在政府工作报告中提出，2023年中国经济增长预期目标为5%左右，这一目标符合中国经济发展的实际情况。",
      "报告指出，过去一年，面对复杂严峻的国际形势和艰巨繁重的国内改革发展稳定任务，以习近平同志为核心的党中央团结带领全党全国各族人民迎难而上，砥砺前行，推动党和国家事业取得新的重大成就。经济保持恢复发展，国内生产总值增长3%，城镇新增就业1206万人，年末城镇调查失业率降到5.5%，居民消费价格上涨2%。货物进出口总额增长7.7%，实际使用外资保持增长。",
      "报告强调，今年是全面贯彻落实党的二十大精神的开局之年，是实施“十四五”规划承上启下的关键之年。要坚持稳中求进工作总基调，完整、准确、全面贯彻新发展理念，加快构建新发展格局，着力推动高质量发展，更好统筹国内国际两个大局，更好统筹疫情防控和经济社会发展，更好统筹发展和安全，全面深化改革开放，大力提振市场信心，把实施扩大内需战略同深化供给侧结构性改革有机结合起来，突出做好稳增长、稳就业、稳物价工作，有效防范化解重大风险，推动经济运行整体好转，实现质的有效提升和量的合理增长，为全面建设社会主义现代化国家开好局起好步。",
      "报告提出，2023年中国经济增长预期目标为5%左右。这一目标符合中国经济发展的实际情况，也符合国际社会的普遍预期。要实现这一目标，需要付出艰苦努力。要坚持扩大内需战略，加快恢复和扩大消费，发挥消费对经济增长的基础性作用。要加大投资力度，优化投资结构，发挥投资对经济增长的关键作用。要加快推进供给侧结构性改革，提高供给体系质量和效率，增强经济发展的内生动力。",
      "报告还提出了其他主要预期目标：城镇新增就业1200万人左右，城镇调查失业率5.5%左右；居民消费价格涨幅3%左右；居民收入增长与经济增长基本同步；进出口促稳提质，国际收支基本平衡；粮食产量保持在1.3万亿斤以上；单位国内生产总值能耗和主要污染物排放量继续下降，重点控制化石能源消费，生态环境质量稳定改善。",
      "报告最后强调，要紧密团结在以习近平同志为核心的党中央周围，高举中国特色社会主义伟大旗帜，全面贯彻落实党的二十大精神，坚定信心，锐意进取，埋头苦干，为全面建设社会主义现代化国家、全面推进中华民族伟大复兴而团结奋斗。"
    ]
  }
];

// 相关文章数据
const relatedArticles = [
  {
    id: 1,
    related: [
      {
        id: 9,
        title: "习近平总书记考察调研北京城市副中心",
        summary: "习近平总书记考察调研北京城市副中心，强调要坚持规划引领，高质量推进城市副中心建设，打造新时代城市建设的典范。",
        thumbnail_url: "/public/logo.png"
      },
      {
        id: 8,
        title: "教育部发布2023年教育改革发展规划",
        summary: "教育部发布2023年教育改革发展规划，提出要深化教育体制改革，提高教育质量，促进教育公平，为建设教育强国奠定基础。",
        thumbnail_url: "/public/logo.png"
      },
      {
        id: 7,
        title: "专家提醒：春季是流感高发季节，需注意预防",
        summary: "专家提醒：春季是流感高发季节，需注意预防，市民应注意个人卫生，勤洗手，戴口罩，避免前往人员密集的场所。",
        thumbnail_url: "/public/logo.png"
      }
    ]
  },
  {
    id: 2,
    related: [
      {
        id: 10,
        title: "中国人民银行宣布降准0.25个百分点",
        summary: "中国人民银行宣布降准0.25个百分点，释放长期资金约5300亿元，这一举措将有助于支持实体经济发展，降低企业融资成本。",
        thumbnail_url: "/public/logo.png"
      },
      {
        id: 6,
        title: "ChatGPT引发人工智能热潮，专家提醒需理性看待",
        summary:
          "ChatGPT引发人工智能热潮，专家提醒需理性看待，人工智能技术的发展既带来了机遇，也带来了挑战，需要加强监管和引导。",
        thumbnail_url: "/public/logo.png"
      },
      {
        id: 4,
        title: "2023年上海国际汽车工业展览会即将开幕",
        summary:
          "2023年上海国际汽车工业展览会即将开幕，届时将有来自全球的汽车制造商展示最新的汽车技术和产品，吸引了大量汽车爱好者前来参观。",
        thumbnail_url: "/public/logo.png"
      }
    ]
  }
];

// 模拟API请求延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 分类列表接口mock
export const mockGetCategories = async () => {
  await delay(500);
  return {
    code: 200,
    message: "成功",
    data: categories
  };
};

// 资讯列表接口mock
export const mockGetArticles = async (category_id: number = 0, page: number = 1, size: number = 10) => {
  await delay(500);
  let filteredArticles = articles;
  if (category_id > 0) {
    filteredArticles = articles.filter(article => article.category_id === category_id);
  }
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
  return {
    code: 200,
    message: "成功",
    data: {
      list: paginatedArticles,
      total: filteredArticles.length,
      page: page,
      size: size
    }
  };
};

// 推荐榜单接口mock
export const mockGetHotArticles = async () => {
  await delay(500);
  return {
    code: 200,
    message: "成功",
    data: hotArticles
  };
};

// 文章详情接口mock
export const mockGetArticleDetail = async (id: number) => {
  await delay(500);
  const articleDetail = articleDetails.find(article => article.id === id);
  if (articleDetail) {
    return {
      code: 200,
      message: "成功",
      data: articleDetail
    };
  } else {
    return {
      code: 404,
      message: "文章不存在",
      data: null
    };
  }
};

// 相关文章接口mock
export const mockGetRelatedArticles = async (id: number) => {
  await delay(500);
  const related = relatedArticles.find(item => item.id === id);
  if (related) {
    return {
      code: 200,
      message: "成功",
      data: related.related
    };
  } else {
    return {
      code: 404,
      message: "相关文章不存在",
      data: null
    };
  }
};

// 搜索文章接口mock
export const mockSearchArticles = async (keyword: string, page: number = 1, size: number = 10) => {
  await delay(500);
  const filteredArticles = articles.filter(
    article => article.title.includes(keyword) || article.summary.includes(keyword) || article.tag.includes(keyword)
  );
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
  return {
    code: 200,
    message: "成功",
    data: {
      list: paginatedArticles,
      total: filteredArticles.length,
      page: page,
      size: size
    }
  };
};
