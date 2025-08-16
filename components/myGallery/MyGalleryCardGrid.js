// // components/myGallery/MyGalleryCardGrid.js
// import style from "@/app/myGallery/page.module.css";
// import MyGalleryCard from "./MyGalleryCard";
// import CoupangCardSlot from "../common/ads/CoupangCardSlot";

// export default function MyGalleryCardGrid({ items }) {
//   const withAd = [];

//   items.forEach((item, idx) => {
//     // 원래 카드
//     withAd.push(
//       <div className={style.cardItem} key={item.userCardId}>
//         <MyGalleryCard {...item} />
//       </div>
//     );

//     // n번째 자리에 광고 카드 삽입 (items 길이가 n 이상일 때만)
//     // if (idx === 2) {
//     //   withAd.push(
//     //     <div className={style.cardItem} key="__ad-slot__">
//     //       <CoupangCardSlot
//     //         widgetId={/* 쿠팡 위젯 ID */ 3456789}
//     //         trackingCode="AF1234567"
//     //         // 필요시 사이즈 조정
//     //       />
//     //     </div>
//     //   );
//     // }
//   });

//   return <div className={style.cardList}>{withAd}</div>;
// import MyGalleryCardSkeleton from "@/components/myGallery/MyGalleryCardSkeleton";

// export default function MyGalleryCardGrid({ items, isLoading, isPending }) {
//   if (isLoading || isPending) {
//     // 로딩일 때 스켈레톤 여러 개
//     return (
//       <div className={style.cardList}>
//         {[...Array(8)].map((_, idx) => (
//           <div className={style.cardItem} key={idx}>
//             <MyGalleryCardSkeleton />
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (items?.length === 0) {
//     return <div>검색결과 없음</div>;
//   }

//   return (
//     <div className={style.cardList}>
//       {items.map((item) => (
//         <div className={style.cardItem} key={item.userCardId}>
//           <MyGalleryCard {...item} />
//         </div>
//       ))}
//     </div>
//   );
// }

// components/myGallery/MyGalleryCardGrid.js
import style from "@/app/myGallery/page.module.css";
import MyGalleryCard from "./MyGalleryCard";
import CoupangCardSlot from "../common/ads/CoupangCardSlot";
import MyGalleryCardSkeleton from "@/components/myGallery/MyGalleryCardSkeleton";

export default function MyGalleryCardGrid({ items, isLoading, isPending }) {
  if (isLoading || isPending) {
    // 로딩일 때 스켈레톤 여러 개
    return (
      <div className={style.cardList}>
        {[...Array(8)].map((_, idx) => (
          <div className={style.cardItem} key={idx}>
            <MyGalleryCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return <div>검색결과 없음</div>;
  }

  const withAd = [];

  items.forEach((item, idx) => {
    // 원래 카드
    withAd.push(
      <div className={style.cardItem} key={item.userCardId}>
        <MyGalleryCard {...item} />
      </div>
    );

    // n번째 자리에 광고 카드 삽입 (items 길이가 n 이상일 때만)
    if (idx === 2) {
      withAd.push(
        <div className={style.cardItem} key="__ad-slot__">
          <CoupangCardSlot
            widgetId={3456789} // 쿠팡 위젯 ID
            trackingCode="AF1234567"
          />
          {/* export default function MyGalleryCardGrid({ items }) {
  return (
    <div className={style.cardList}>
      {items.map((item) => (
        <div className={style.cardItem} key={item.photoCardId}>
          <MyGalleryCard {...item} /> */}
        </div>
      );
    }
  });

  return <div className={style.cardList}>{withAd}</div>;
}
