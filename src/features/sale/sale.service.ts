import { api } from "@/lib/api";
import { CreateSaleFormData } from "@/schemas/newSale.schema";

// Create a sale
export const createSaleService = async (saleData: CreateSaleFormData) => {
  const response = await api.post("/sales", saleData);
  return response.data;
};

// Get sales list with filters and pagination
export const fetchSalesList = async (params?: {
  page?: string | number;
  limit?: string | number;
  search?: string;
  paymentStatus?: string;
  soldBy?: string;
  from?: string;
  to?: string;
}) => {
  const response = await api.get("/sales", { params });
  return response.data;
};

// Fetch sales statistics
export const fetchSalesStatistics = async (params?: {
  period?: string;
  year?: string;
  from?: string;
  to?: string;
}) => {
  const response = await api.get("/sales/statistics", { params });
  return response.data;
};

// Fetch single sale
export const getSingleSale = async (id: string) => {
  const response = await api.get(`/sales/${id}`);
  return response.data;
};

// Add payment to a sale invoice
export const addSalePayment = async (saleId: string, amount: number) => {
  const response = await api.post(`/sales/${saleId}/payment`, { amount });
  return response.data;
};
