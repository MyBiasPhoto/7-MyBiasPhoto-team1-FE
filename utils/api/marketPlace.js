export default async function fetchSales(filters) {
  const query = new URLSearchParams();
  query.append("includeSoldOut", filters.soldout ?? "false");
  if (filters.grade) query.append("grade", filters.grade);
  if (filters.genre) query.append("genre", filters.genre);

  const res = await fetch(`http://localhost:3000/sales?${query.toString()}`);

  if (!res.ok) throw new Error("Network response was not ok");

  const data = await res.json();
  if (data === undefined) throw new Error("No data returned from server");

  return data;
}
