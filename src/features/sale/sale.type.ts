export interface Product {
  _id: string;
  name: string;
  sellingPrice: number;
  quantity: number;
  isActive: boolean;
}

export interface ISalePayment {
  _id?: string;
  amount: number;
  receivedBy:
    | {
        _id: string;
        name: string;
        email: string;
        role: string;
      }
    | string;
  paidAt: string | Date;
}

export interface ISaleItem {
  product:
    | {
        _id: string;
        name: string;
        sku?: string;
      }
    | string;
  quantity: number;
  purchasePrice: number;
  unitPrice: number;
  warrantyMonths?: number;
  subtotal: number;
}

export interface ISaleCustomer {
  name: string;
  phone?: string;
  address?: string;
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

// 1. Define the item structure sent during creation
export interface ICreateSaleItemPayload {
  productId: string;
  quantity: number;
  warrantyMonths?: number;
}

// 2. Define the main payload structure for creating a sale
export interface ICreateSalePayload {
  customer: ISaleCustomer;
  items: ICreateSaleItemPayload[];
  discount: number;
  paidAmount: number;
  dueCommitmentMonths?: number;
}
// export interface ISalesStatistics {
//   totalSales: number;
//   totalCollected: number;
//   totalDue: number;
//   totalProfit: number;
//   transactionCount: number;
// }
