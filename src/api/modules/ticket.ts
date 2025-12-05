import { ResPage, Ticket } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 工单管理模块
 */
// 获取工单列表
export const getTicketList = (params: Ticket.ReqTicketParams) => {
  return http.post<ResPage<Ticket.ResTicketList>>(PORT1 + `/ticket/list`, params);
};

// 获取工单详情
export const getTicketDetail = (params: { id: string }) => {
  return http.post<Ticket.ResTicketDetail>(PORT1 + `/ticket/detail`, params);
};

// 新增工单
export const addTicket = (params: Ticket.ReqTicketForm) => {
  return http.post(PORT1 + `/ticket/add`, params);
};

// 编辑工单
export const editTicket = (params: Ticket.ReqTicketForm) => {
  return http.post(PORT1 + `/ticket/edit`, params);
};

// 删除工单
export const deleteTicket = (params: { id: string[] }) => {
  return http.post(PORT1 + `/ticket/delete`, params);
};

// 处理工单
export const processTicket = (params: Ticket.ReqProcessTicket) => {
  return http.post(PORT1 + `/ticket/process`, params);
};

// 获取工单优先级字典
export const getTicketPriority = () => {
  return http.get<Ticket.ResPriority[]>(PORT1 + `/ticket/priority`);
};

// 获取工单状态字典
export const getTicketStatus = () => {
  return http.get<Ticket.ResStatus[]>(PORT1 + `/ticket/status`);
};

// 导出工单数据
export const exportTicketInfo = (params: Ticket.ReqTicketParams) => {
  return http.download(PORT1 + `/ticket/export`, params);
};
