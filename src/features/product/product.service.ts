import { api } from "@/lib/api";
import { ProductFormData } from "./product.validation";

export const fetchProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const fetchActiveCategories = async () => {
  const response = await api.get("/categories?isActive=true");
  return response.data?.data || response.data || [];
};

export const createProduct = async (data: ProductFormData) => {
  const response = await api.post("/products", data);
  return response.data;
};

export const updateProduct = async (
  id: string,
  data: Partial<ProductFormData>,
) => {
  const response = await api.patch(`/products/${id}`, data);
  return response.data;
};

export const toggleProductStatus = async (id: string, isActive: boolean) => {
  const response = await api.patch(`/products/${id}`, { isActive });
  return response.data;
};
