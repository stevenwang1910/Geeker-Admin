// ? 系统全局字典

/**
 * @description：用户性别
 */
export const genderType = [
  { label: "男", value: 1 },
  { label: "女", value: 2 }
];

/**
 * @description：用户状态
 */
export const userStatus = [
  { label: "启用", value: 1, tagType: "success" },
  { label: "禁用", value: 0, tagType: "danger" }
];

/**
 * @description：工单状态
 */
export const ticketStatus = [
  { label: "待处理", value: 1, tagType: "warning" },
  { label: "处理中", value: 2, tagType: "primary" },
  { label: "已解决", value: 3, tagType: "success" },
  { label: "已关闭", value: 4, tagType: "info" }
];

/**
 * @description：工单紧急程度
 */
export const ticketPriority = [
  { label: "低", value: 1, tagType: "success" },
  { label: "中", value: 2, tagType: "warning" },
  { label: "高", value: 3, tagType: "danger" }
];
