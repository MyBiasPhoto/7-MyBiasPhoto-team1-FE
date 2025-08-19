export const GRADE_COLOR_MAP = {
  COMMON: "var(--main)",
  RARE: "var(--blue)",
  "SUPER RARE": "var(--purple)",
  LEGENDARY: "var(--pink)",
};

export const gradeOption = [
  { value: "", label: "전체", color: "var(--white)" },
  { value: "COMMON", label: "COMMON", color: GRADE_COLOR_MAP["COMMON"] },
  { value: "RARE", label: "RARE", color: GRADE_COLOR_MAP["RARE"] },
  {
    value: "SUPER RARE",
    label: "SUPER RARE",
    color: GRADE_COLOR_MAP["SUPER RARE"],
  },
  {
    value: "LEGENDARY",
    label: "LEGENDARY",
    color: GRADE_COLOR_MAP["LEGENDARY"],
  },
];

export const amountOption = [
  { value: "true", label: "수량없음" },
  { value: "false", label: "판매중" },
];
export const genreOption = [
  { value: "", label: "전체" },
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

export const sortOption = [
  { value: "priceLowToHigh", label: "낮은 가격순" },
  { value: "priceHighToLow", label: "높은 가격순" },
  { value: "newest", label: "최신순" },
];

export const saleTypeOption = [
  { value: "", label: "전체" },
  { value: "ON_SALE", label: "판매중" },
  { value: "PROPOSED", label: "교환 대기" },
];

export const soldoutOption = [
  { value: "", label: "전체" },
  { value: "true", label: "판매중" },
  { value: "false", label: "판매완료" },
];
