import CardRarityCount from "./CardRarityCount.js";
import style from "./CardRarityCountList.module.css";
const gradeColorMap = {
  COMMON: "yellow",
  RARE: "blue",
  "SUPER RARE": "purple",
  LEGENDARY: "pink",
};

export default function CardRarityCountList({ gradeCounts }) {
  return (
    <div className={style.CardRarityContainer}>
      {gradeCounts.map(({ grade, count }) => (
        <CardRarityCount
          key={grade}
          grade={grade}
          value={count}
          color={gradeColorMap[grade]}
        />
      ))}
    </div>
  );
}
