import CardRarityCount from "./CardRarityCount.js";
import style from "./CardRarityCountList.module.css";
const gradeColorMap = {
  COMMON: "yellow",
  RARE: "blue",
  EPIC: "purple",
  LEGENDARY: "pink",
};

const grades = [
  { grade: "COMMON", value: 12 },
  { grade: "RARE", value: 7 },
  { grade: "EPIC", value: 3 },
  { grade: "LEGENDARY", value: 1 },
];

export default function CardRarityCountList() {
  return (
    <div className={style.CardRarityContainer}>
      {grades.map(({ grade, value }) => (
        <CardRarityCount
          key={grade}
          grade={grade}
          value={value}
          color={gradeColorMap[grade]}
        />
      ))}
    </div>
  );
}
