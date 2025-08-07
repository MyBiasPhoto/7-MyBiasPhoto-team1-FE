import CardRarityCount from "@/components/common/CardRarityCount";

export default async function MySalePage() {
  return (
    <CardRarityCount
      grade="LEGENDARY"
      value="20"
      color="pink"
    ></CardRarityCount>
  );
}
