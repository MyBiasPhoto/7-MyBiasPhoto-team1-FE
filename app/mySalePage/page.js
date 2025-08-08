"use client";
import CardRaritySummary from "@/components/common/CardRarityCount/CardRaritySummary.js";
import FilterContainer from "@/components/mySalePage/FilterContainer.js";
import style from "./page.module.css";

export default function MySalePage() {
  const gradeCounts = [
    { grade: "COMMON", value: 12 },
    { grade: "RARE", value: 7 },
    { grade: "SUPER RARE", value: 3 },
    { grade: "LEGENDARY", value: 1 },
  ];
  const nickname = "유디";
  return (
    <div className={style.container}>
      <CardRaritySummary
        gradeCounts={gradeCounts}
        nickname={nickname}
      ></CardRaritySummary>
      <FilterContainer></FilterContainer>
    </div>
  );
}
