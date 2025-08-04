//utils/api/wjTestFetchProduct.js

// 실제 API 호출 함수
// React Query가 queryFn으로 호출하며, queryKey를 통해 파라미터를 전달받는다


export async function fetchProducts({ queryKey }) {
  const [_key, { q, limit, offset }] = queryKey;
  const res = await fetch(
    `https://learn.codeit.kr/api/codeitmall/products/?q=${q}&limit=${limit}&offset=${offset}`
  );
  if (!res.ok) throw new Error("데이터를 불러오는 데 실패했습니다.");
  return res.json();
}
