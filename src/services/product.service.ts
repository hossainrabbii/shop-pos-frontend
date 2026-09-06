import { api } from "@/lib/api";

export const fetchProducts = async () => {
  const response = await api.get("/products");
  return response.data.data || [];
};

export const fetchActiveCategories = async () => {
  const response = await api.get("/categories");
  return (response.data.data || []).filter((c: any) => c.isActive);
};

export const createProduct = async (data: any) => {
  const response = await api.post("/products", data);
  return response.data;
};

export const updateProduct = async (id: string, data: any) => {
  const response = await api.patch(`/products/${id}`, data);
  return response.data;
};

export const toggleProductStatus = async (id: string, isActive: boolean) => {
  const response = await api.patch(`/products/${id}`, { isActive });
  return response.data;
};
