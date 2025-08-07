// components/myGallery/MyGalleryCardGrid.js
import style from "@/app/myGallery/page.module.css";
import MyGalleryCard from "./MyGalleryCard";

export default function MyGalleryCardGrid({ items }) {
  return (
    <div className={style.cardList}>
      {items.map((item) => (
        <div className={style.cardItem} key={item.userCardId}>
          <MyGalleryCard {...item} />
        </div>
      ))}
    </div>
  );
}
