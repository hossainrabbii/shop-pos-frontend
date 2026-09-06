import { CreateSaleFormData } from "@/schemas/newSale.schema";
import { ICreateSaleResponse } from "@/types/newSale";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const createSale = async (
  payload: CreateSaleFormData,
): Promise<ICreateSaleResponse> => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Authentication required. Please login again.");
  }

  const url = `${API_URL}/sales`;

  console.log("Create Sale API:", url);
  console.log("Access token exists:", Boolean(accessToken));

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to create sale");
  }

  return result;
};
