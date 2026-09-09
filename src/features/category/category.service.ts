import { api } from "@/lib/api";
import { CategoryFormData } from "./category.type";

export const fetchCategoryList = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const createCategory = async (data: CategoryFormData) => {
  const response = await api.post("/categories", data);
  return response.data;
};

export const updateCategory = async (
  id: string,
  data: Partial<CategoryFormData> & { isActive?: boolean },
) => {
  const response = await api.patch(`/categories/${id}`, data);
  return response.data;
};
