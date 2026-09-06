import type {
  IAddSalePaymentPayload,
  ICreateSalePayload,
  ISale,
  ISaleStatistics,
  ISalesResponse,
  SalePaymentStatus,
  SalePeriod,
} from "@/types/sale";

interface IGetSalesParams {
  page?: number;
  limit?: number;
  search?: string;
  paymentStatus?: SalePaymentStatus;
  soldBy?: string;
  from?: string;
  to?: string;
}

interface IGetStatisticsParams {
  period?: SalePeriod;
  year?: number;
  from?: string;
  to?: string;
}

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const request = async <T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    credentials: "include",
  });

  const result = (await response.json()) as IApiResponse<T>;

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result.data;
};

export const createSale = async (
  payload: ICreateSalePayload,
): Promise<ISale> => {
  return request<ISale>("/sale", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getAllSales = async (
  params: IGetSalesParams = {},
): Promise<ISalesResponse> => {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.paymentStatus && params.paymentStatus !== "ALL") {
    searchParams.set("paymentStatus", params.paymentStatus);
  }

  if (params.soldBy) {
    searchParams.set("soldBy", params.soldBy);
  }

  if (params.from) {
    searchParams.set("from", params.from);
  }

  if (params.to) {
    searchParams.set("to", params.to);
  }

  const query = searchParams.toString();

  return request<ISalesResponse>(`/sale${query ? `?${query}` : ""}`);
};

export const getSaleById = async (saleId: string): Promise<ISale> => {
  return request<ISale>(`/sale/${saleId}`);
};

export const getSaleStatistics = async (
  params: IGetStatisticsParams = {},
): Promise<ISaleStatistics> => {
  const searchParams = new URLSearchParams();

  if (params.period) {
    searchParams.set("period", params.period);
  }

  if (params.year !== undefined) {
    searchParams.set("year", String(params.year));
  }

  if (params.from) {
    searchParams.set("from", params.from);
  }

  if (params.to) {
    searchParams.set("to", params.to);
  }

  const query = searchParams.toString();

  return request<ISaleStatistics>(
    `/sales/statistics${query ? `?${query}` : ""}`,
  );
};

export const addSalePayment = async (
  saleId: string,
  payload: IAddSalePaymentPayload,
): Promise<ISale> => {
  return request<ISale>(`/sales/${saleId}/payment`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
