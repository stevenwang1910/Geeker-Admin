import { ResPage } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 工单管理模块
 */

// 工单接口类型定义
export namespace Ticket {
  // 工单列表请求参数
  export interface ReqTicketParams {
    ticketNumber?: string;
    customerName?: string;
    status?: string;
    priority?: string;
    submitTime?: string[];
    pageNum: number;
    pageSize: number;
  }

  // 工单列表响应数据
  export interface ResTicketList {
    id: number;
    ticketNumber: string;
    customerName: string;
    customerContact: string;
    submitTime: string;
    priority: string;
    status: string;
    handlerName: string;
    description: string;
    attachments: ResAttachment[];
    processingRecords: ResProcessingRecord[];
  }

  // 附件响应数据
  export interface ResAttachment {
    id: number;
    name: string;
    url: string;
  }

  // 处理记录响应数据
  export interface ResProcessingRecord {
    id: number;
    handlerName: string;
    processingTime: string;
    processingContent: string;
    processingResult: string;
  }

  // 工单详情请求参数
  export interface ReqTicketDetail {
    id: number;
  }

  // 工单详情响应数据
  export interface ResTicketDetail {
    id: number;
    ticketNumber: string;
    customerName: string;
    customerContact: string;
    submitTime: string;
    priority: string;
    status: string;
    handlerName: string;
    description: string;
    attachments: ResAttachment[];
    processingRecords: ResProcessingRecord[];
  }

  // 新增工单请求参数
  export interface ReqAddTicket {
    customerName: string;
    customerContact: string;
    priority: string;
    description: string;
    attachments?: ReqAttachment[];
  }

  // 新增附件请求参数
  export interface ReqAttachment {
    name: string;
    url: string;
  }

  // 编辑工单请求参数
  export interface ReqEditTicket {
    id: number;
    customerName?: string;
    customerContact?: string;
    priority?: string;
    status?: string;
    handlerName?: string;
    description?: string;
    attachments?: ReqAttachment[];
  }

  // 新增处理记录请求参数
  export interface ReqAddProcessingRecord {
    ticketId: number;
    processingContent: string;
    processingResult: string;
  }

  // 删除工单请求参数
  export interface ReqDeleteTicket {
    ids: number[];
  }
}

// 获取工单列表
export const getTicketList = (params: Ticket.ReqTicketParams) => {
  return http.post<ResPage<Ticket.ResTicketList>>(PORT1 + `/ticket/list`, params);
};

// 获取工单详情
export const getTicketDetail = (params: Ticket.ReqTicketDetail) => {
  return http.get<Ticket.ResTicketDetail>(PORT1 + `/ticket/detail`, { params });
};

// 新增工单
export const addTicket = (params: Ticket.ReqAddTicket) => {
  return http.post(PORT1 + `/ticket/add`, params);
};

// 编辑工单
export const editTicket = (params: Ticket.ReqEditTicket) => {
  return http.post(PORT1 + `/ticket/edit`, params);
};

// 新增处理记录
export const addProcessingRecord = (params: Ticket.ReqAddProcessingRecord) => {
  return http.post(PORT1 + `/ticket/processing-record/add`, params);
};

// 删除工单
export const deleteTicket = (params: Ticket.ReqDeleteTicket) => {
  return http.post(PORT1 + `/ticket/delete`, params);
};

// 导出工单数据
export const exportTicketInfo = (params: Ticket.ReqTicketParams) => {
  return http.download(PORT1 + `/ticket/export`, params);
};
