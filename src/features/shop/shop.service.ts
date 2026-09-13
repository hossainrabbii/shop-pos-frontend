import { api } from "@/lib/api";
import { IShop } from "./shop.type";
import { IShopFormValues } from "./shop.validation";

export const getShopSettings = async (): Promise<IShop | null> => {
  const response = await api.get("/shop");
  return response.data?.data || response.data;
};

export const updateShopSettings = async (
  data: IShopFormValues,
): Promise<IShop> => {
  const response = await api.patch("/shop", data);
  return response.data?.data || response.data;
};

export const createShopSettings = async (
  data: IShopFormValues,
): Promise<IShop> => {
  const response = await api.post("/shop", data);
  return response.data?.data || response.data;
};
