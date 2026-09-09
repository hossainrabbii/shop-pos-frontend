import { api } from "@/lib/api";
import { CreateSaleFormData } from "@/schemas/newSale.schema";
import { ICreateSaleResponse } from "@/types/newSale";

export const createSale = async (
  payload: CreateSaleFormData,
): Promise<ICreateSaleResponse> => {
  const response = await api.post<ICreateSaleResponse>("/sales", payload);
  return response.data;
};
