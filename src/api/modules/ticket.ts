import { ResPage, Ticket } from "@/api/interface";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 工单管理模块
 */
// 获取工单列表
export const getTicketList = (params: Ticket.ReqTicketParams) => {
  return http.post<ResPage<Ticket.ResTicketList>>(PORT1 + `/ticket/list`, params);
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
export const deleteTicket = (params: { id: number[] }) => {
  return http.post(PORT1 + `/ticket/delete`, params);
};

// 获取工单详情
export const getTicketDetail = (params: { id: number }) => {
  return http.post(PORT1 + `/ticket/detail`, params);
};

// 处理工单
export const handleTicket = (params: Ticket.ReqHandleTicket) => {
  return http.post(PORT1 + `/ticket/handle`, params);
};

// 获取工单处理记录
export const getTicketHandleRecords = (params: { ticketId: number }) => {
  return http.post(PORT1 + `/ticket/handleRecords`, params);
};
