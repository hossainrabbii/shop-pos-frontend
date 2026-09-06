// Helper to get token safely inside client service calls or pass it directly
const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
// create
export const createSaleService = async (saleData: any, token: string) => {
  const response = await fetch(`http://localhost:5000/api/v1/sales`, {
    // Replace with your actual endpoint URL
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(saleData),
  });

  return await response.json();
};
// Get sales list with filters and pagination
export const fetchSalesList = async (
  token: string,
  params?: {
    page?: string | number;
    limit?: string | number;
    search?: string;
    paymentStatus?: string;
    soldBy?: string;
    from?: string;
    to?: string;
  },
) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.paymentStatus)
      queryParams.append("paymentStatus", params.paymentStatus);
    if (params?.soldBy) queryParams.append("soldBy", params.soldBy);
    if (params?.from) queryParams.append("from", params.from);
    if (params?.to) queryParams.append("to", params.to);

    const response = await fetch(
      `http://localhost:5000/api/v1/sales?${queryParams.toString()}`,
      {
        method: "GET",
        headers: getAuthHeaders(token),
      },
    );
    return response.json();
  } catch (error) {
    console.error("Error fetching sales list:", error);
    return { data: [], meta: { totalPage: 1, total: 0 } };
  }
};

// Fetch sales statistics
export const fetchSalesStatistics = async (
  token: string,
  params?: {
    period?: string;
    year?: string;
    from?: string;
    to?: string;
  },
) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.period) queryParams.append("period", params.period);
    if (params?.year) queryParams.append("year", params.year);
    if (params?.from) queryParams.append("from", params.from);
    if (params?.to) queryParams.append("to", params.to);

    const response = await fetch(
      `http://localhost:5000/api/v1/sales/statistics?${queryParams.toString()}`,
      {
        method: "GET",
        headers: getAuthHeaders(token),
      },
    );
    return response.json();
  } catch (error) {
    console.error("Error fetching sales statistics:", error);
    return { data: {} };
  }
};

// Fetch single sales list
export const getSingleSale = async (token: string, id: string) => {
  try {
    const response = await fetch(`http://localhost:5000/api/v1/sales/${id}`, {
      method: "GET",
      headers: getAuthHeaders(token),
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching sellers list:", error);
    return [];
  }
};

// Add payment to a sale invoice
export const addSalePayment = async (
  token: string,
  saleId: string,
  amount: number,
) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/v1/sales/${saleId}/payment`,
      {
        method: "POST",
        headers: {
          ...getAuthHeaders(token),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      },
    );

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response received:", text);
      throw new Error("Server returned an invalid response format (not JSON)");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding sale payment:", error);
    throw error;
  }
};
