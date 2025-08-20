const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function fetchSales(filters) {
  const query = new URLSearchParams();
  query.append("includeSoldOut", filters.soldout ?? "false");
  if (filters.grade) query.append("grade", filters.grade);
  if (filters.genre) query.append("genre", filters.genre);
  if (filters.orderBy) query.append("orderBy", filters.orderBy);
  if (filters.search) query.append("search", filters.search);
  if (filters.page) query.append("page", filters.page);

  const res = await fetch(`${API_URL}/sales?${query.toString()}`);

  if (!res.ok) throw new Error("Network response was not ok");

  const data = await res.json();
  if (data === undefined) throw new Error("No data returned from server");

  return data;
}

export async function fetchSaleById(id) {
  const res = await fetch(`${API_URL}/sales/${id}`);

  if (!res.ok) throw new Error("Network response was not ok");

  const data = await res.json();
  if (data === undefined) throw new Error("No data returned from server");

  return data;
}

export async function updatedSale({ id, data }) {
  const res = await fetch(`${API_URL}/sales/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Network response was not ok");

  const responseData = await res.json();
  if (responseData === undefined)
    throw new Error("No data returned from server");

  return responseData;
}

export async function deletedAtSaleById({ id, data }) {
  const res = await fetch(`${API_URL}/sales/${id}/delete`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Network response was not ok");

  const responseData = await res.json();
  if (responseData === undefined)
    throw new Error("No data returned from server");

  return responseData;
}
