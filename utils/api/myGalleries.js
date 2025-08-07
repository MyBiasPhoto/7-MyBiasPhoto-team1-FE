// utils/api/myGalleries.js
export const fetchMyGalleryData = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.search) params.append("search", filters.search);
  if (filters.grade) params.append("grade", filters.grade);
  if (filters.genre) params.append("genre", filters.genre);
  if (filters.sort) params.append("sort", filters.sort); //저는 sort를 안쓰지만 쓰실분들쓰셔요
  if (filters.page) params.append("page", filters.page);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const myGalleryPath = "/users/me/userCard/gallery";

  const queryString = params.toString();

  // GET http://localhost:4000/users/me/userCard/gallery
  const url = `${baseUrl}${myGalleryPath}${
    queryString ? `?${queryString}` : ""
  }`;
  const res = await fetch(url, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("판매 목록을 불러오지 못했습니다.");
  }

  const data = await res.json();
  return data;
};
