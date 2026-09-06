import { ISaleCustomer } from "./sale";

export interface ISaleItemResponse {
  product: {
    _id: string;
    name: string;
    sku?: string;
  };
  quantity: number;
  purchasePrice: number;
  unitPrice: number;
  warrantyMonths?: number;
  subtotal: number;
}

export interface ISalePaymentResponse {
  _id: string;
  amount: number;
  receivedBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  paidAt: string;
}

export interface ISaleResponseData {
  _id: string;
  invoiceNumber: string;
  soldBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  customer: ISaleCustomer;
  items: ISaleItemResponse[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  dueCommitmentMonths?: number;
  payments: ISalePaymentResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface ICreateSaleResponse {
  success: boolean;
  message: string;
  data: ISaleResponseData;
}
