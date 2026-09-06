export interface ISaleCustomer {
  name: string;
  phone?: string;
  address?: string;
}

export interface ISalePayment {
  amount: number;
  receivedBy:
    | {
        _id: string;
        name: string;
        email: string;
        role: string;
      }
    | string;
  paidAt: string;
}
export interface ISaleItemProduct {
  _id: string;
  name: string;
  sku: string;
}

export interface ISaleItem {
  product: ISaleItemProduct | string;
  quantity: number;
  purchasePrice: number;
  unitPrice: number;
  warrantyMonths?: number;
  subtotal: number;
}

export interface ISale {
  _id: string;
  invoiceNumber: string;

  soldBy:
    | {
        _id: string;
        name: string;
        email: string;
        role: string;
      }
    | string;

  customer: ISaleCustomer;

  items: ISaleItem[];

  subtotal: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;

  dueCommitmentMonths?: number;

  payments: ISalePayment[];

  createdAt: string;
  updatedAt: string;
}

export interface ICreateSaleItem {
  productId: string;
  quantity: number;
  warrantyMonths?: number;
}

export interface ICreateSalePayload {
  customer: ISaleCustomer;
  items: ICreateSaleItem[];
  discount?: number;
  paidAmount: number;
  dueCommitmentMonths?: number;
}

export interface IAddSalePaymentPayload {
  amount: number;
}

export type SalePaymentStatus = "ALL" | "PAID" | "DUE";

export type SalePeriod = "today" | "week" | "month" | "year" | "custom";

export interface ISalePagination {
  currentPage: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ISalesResponse {
  sales: ISale[];
  pagination: ISalePagination;
}

export interface ISaleStatistics {
  totalSales: number;
  totalPaid: number;
  totalDue: number;
  totalProfit: number;
  totalTransactions: number;
}
