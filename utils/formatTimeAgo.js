// utils/formatTimeAgo.js
export function formatTimeAgo(dateString) {
  const now = new Date();
  const created = new Date(dateString);
  const diffMs = now - created;

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30); // 단순화 (30일)
  const diffYear = Math.floor(diffDay / 365);

  if (diffHour >= 1 && diffHour < 24) {
    return `${diffHour}시간 전`;
  }
  if (diffDay >= 1 && diffDay <= 6) {
    return `${diffDay}일 전`;
  }
  if (diffWeek >= 1 && diffWeek <= 3) {
    return `${diffWeek}주일 전`;
  }
  if (diffMonth >= 1 && diffMonth <= 11) {
    return `${diffMonth}개월 전`;
  }
  if (diffYear >= 1) {
    return `${diffYear}년 전`;
  }
  // 1시간 미만은 그냥 분 단위 표시 (추가)
  if (diffMin >= 1) {
    return `${diffMin}분 전`;
  }
  return "방금 전";
}
