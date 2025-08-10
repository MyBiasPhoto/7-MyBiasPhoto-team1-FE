import CardRarityCountList from "./CardRarityCountList.js";
import style from "./CardRaritySummary.module.css";

/**
 * 사용자의 포토카드 등급별 보유 현황과 총 개수를 보여주는 컴포넌트
 *
 * @param {Object} props - 컴포넌트에 전달되는 속성들
 * @param {Array<{ grade: string, value: number }>} props.gradeCounts - 각 등급별 보유 개수를 담은 배열
 *   예: [{ grade: "COMMON", value: 12 }, { grade: "RARE", value: 7 }, ...]
 * @param {string} props.nickname - 사용자 닉네임 (표시용)
 *
 * @returns {JSX.Element} 포토카드 등급별 수량과 총 수량을 보여주는 UI 컴포넌트
 */

export default function CardRaritySummary({ gradeCounts, nickname }) {
  const totalCount = gradeCounts.reduce(
    (acc, { count }) => acc + (Number(count) || 0),
    0
  );

  return (
    <div className={style.raritySummary}>
      <div className={style.title}>
        {nickname}님이 보유한 포토카드{" "}
        <span className={style.total}>({totalCount}장)</span>
      </div>
      <CardRarityCountList gradeCounts={gradeCounts}></CardRarityCountList>
    </div>
  );
}
