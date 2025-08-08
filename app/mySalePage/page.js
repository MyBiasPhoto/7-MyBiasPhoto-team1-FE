"use client";
import CardRaritySummary from "@/components/common/CardRarityCount/CardRaritySummary.js";
import FilterContainer from "@/components/mySalePage/FilterContainer.js";
import style from "./page.module.css";
import UserCardList from "@/components/common/userCard/UserCardList";

export default function MySalePage() {
  const gradeCounts = [
    { grade: "COMMON", value: 12 },
    { grade: "RARE", value: 7 },
    { grade: "SUPER RARE", value: 3 },
    { grade: "LEGENDARY", value: 1 },
  ];
  const nickname = "유디";

  const dummyCard = [
    {
      name: "그랜드 피날레",
      genre: "로맨스",
      grade: "RARE",
      owner: "유디",
      imageUrl: "/assets/cardImage.png",
      price: 3200,
    },
    {
      name: "그랜드 피날레",
      genre: "로맨스",
      grade: "RARE",
      owner: "유디",
      imageUrl: "/assets/cardImage.png",
      price: 3200,
    },
    {
      name: "그랜드 피날레",
      genre: "로맨스",
      grade: "RARE",
      owner: "유디",
      imageUrl: "/assets/cardImage.png",
      price: 3200,
    },
    {
      name: "그랜드 피날레",
      genre: "로맨스",
      grade: "RARE",
      owner: "유디",
      imageUrl: "/assets/cardImage.png",
      price: 3200,
    },
    {
      name: "그랜드 피날레",
      genre: "로맨스",
      grade: "RARE",
      owner: "유디",
      imageUrl: "/assets/cardImage.png",
      price: 3200,
    },
    {
      name: "그랜드 피날레",
      genre: "로맨스",
      grade: "RARE",
      owner: "유디",
      imageUrl: "/assets/cardImage.png",
      price: 3200,
    },
    {
      name: "그랜드 피날레",
      genre: "로맨스",
      grade: "RARE",
      owner: "유디",
      imageUrl: "/assets/cardImage.png",
      price: 3200,
    },
    {
      name: "그랜드 피날레",
      genre: "로맨스",
      grade: "RARE",
      owner: "유디",
      imageUrl: "/assets/cardImage.png",
      price: 3200,
    },
    {
      name: "그랜드 피날레",
      genre: "로맨스",
      grade: "RARE",
      owner: "유디",
      imageUrl: "/assets/cardImage.png",
      price: 3200,
    },
  ];

  return (
    <div className={style.container}>
      <CardRaritySummary
        gradeCounts={gradeCounts}
        nickname={nickname}
      ></CardRaritySummary>
      <FilterContainer></FilterContainer>
      <UserCardList cards={dummyCard}></UserCardList>
    </div>
  );
}
