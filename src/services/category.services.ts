const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export const getAllProducts = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Authentication required. Please login again.");
  }

  const url = `${API_URL}/sales/products`;

  console.log("Statistics API:", url);
  console.log("Access token exists:", Boolean(accessToken));

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  console.log(response);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to fetch sales statistics");
  }

  return result;
};
