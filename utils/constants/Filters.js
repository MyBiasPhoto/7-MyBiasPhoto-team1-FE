// utils/constants/Filters.js
export const initialMyGalleryFilters = {
  search: "",
  category: "all",
  sort: "newest", //남는 쿼리 그냥 있어도 상관없음
  page: 1,
  grade: "",
  genre: "",
};

export const myGalleryGradeOption = [
  { value: "COMMON", label: "COMMON" },
  { value: "RARE", label: "RARE" },
  { value: "SUPER RARE", label: "SUPER RARE" },
  { value: "LEGENDARY", label: "LEGENDARY" },
];

export const myGalleryGenreOption = [
  { value: "앨범", label: "앨범" },
  { value: "특전", label: "특전" },
  { value: "팬싸", label: "팬싸" },
  { value: "시즌그리팅", label: "시즌그리팅" },
  { value: "팬미팅", label: "팬미팅" },
  { value: "콘서트", label: "콘서트" },
  { value: "MD", label: "MD" },
  { value: "콜라보", label: "콜라보" },
  { value: "팬클럽", label: "팬클럽" },
  { value: "기타", label: "기타" },
];

export const initialMySaleFilters = {
  search: "",
  page: 1,
};
