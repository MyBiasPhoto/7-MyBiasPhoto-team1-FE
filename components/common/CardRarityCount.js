import style from "./CardRarityCount.module.css";

/**
 * 카드 희귀도와 해당 희귀도의 소유 수량을 표시하는 컴포넌트
 *
 * param {Object} props - 컴포넌트에 전달되는 props
 * @param {string} [props.grade="COMMON"] - 카드의 등급 텍스트
 * @param {number|string} [props.value=0] - 해당 등급 카드의 수량
 * @param {("yellow" | "blue" | "purple" | "pink")} [props.color="yellow"] - 스타일링에 사용할 색상 키워드
 *
 * @returns {JSX.Element} 카드 등급과 수량을 보여주는 UI 박스
 */
export default function CardRarityCount({
  grade = "COMMON",
  value = 0,
  color = "yellow",
}) {
  return (
    <div className={`${style.container} ${style[color]}`}>
      <span className={style.grade}>{grade}</span>
      <span className={style.count}>{value}장</span>
    </div>
  );
}
