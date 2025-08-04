// utils/api/myGalleries.js
export const fetchMyGalleryData = async () => {
  const res = await fetch("http://localhost:3500/sales");

  if (!res.ok) {
    throw new Error("판매 목록을 불러오지 못했습니다.");
  }

  const data = await res.json();
  return data;
};

//@TODO  아래와 같은 방식으로 페이지별 캐시 구분하게끔 해야함
// export const fetchSales = async (page = 1, pageSize = 9) => {
//   const res = await fetch(`http://localhost:3500/sales?page=${page}&pageSize=${pageSize}`);
