import { api } from "@/lib/api";

export const fetchUser = async () => {
  const response = await api.get("/user");
  console.log(response?.data?.data)
  return response?.data;
};
