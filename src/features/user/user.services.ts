import { api } from "@/lib/api";

export const fetchUser = async () => {
  const response = await api.get("/user");
  return response?.data;
};
