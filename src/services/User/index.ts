const BASE_URL = "http://localhost:5000/api/v1/user";
// const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API}/user`;
console.log(BASE_URL);
const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export const fetchUser = async (token: string) => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "GET",
      cache: "no-store",
      headers: getAuthHeaders(token),
    });

    if (!response?.ok) {
      throw new Error("Failed to fetch user");
    }
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.log(error);
  }
};
