const BASE_URL = "http://localhost:5000/api/v1/products";
const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

console.log(BASE_URL);
export const getProducts = async (token: string) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "GET",
      cache: "no-store",
      headers: getAuthHeaders(token),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await res.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || "An unknown error occurred");
  }
};
