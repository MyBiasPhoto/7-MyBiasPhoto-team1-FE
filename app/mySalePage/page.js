import CardRaritySummary from "@/components/common/CardRarityCount/CardRaritySummary.js";
export default async function MySalePage() {
  const gradeCounts = [
    { grade: "COMMON", value: 12 },
    { grade: "RARE", value: 7 },
    { grade: "SUPER RARE", value: 3 },
    { grade: "LEGENDARY", value: 1 },
  ];
  const nickname = "유디";
  return (
    <>
      <CardRaritySummary
        gradeCounts={gradeCounts}
        nickname={nickname}
      ></CardRaritySummary>
    </>
  );
}
