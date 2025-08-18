import style from "./myGalleryCardSkeleton.module.css";

export default function MyGalleryCardSkeleton() {
  return (
    <div className={style.cardContainer}>
      <div className={style.skeletonWrapper}>
        <div className={style.skeletonBox + " " + style.large}></div>
        <div className={style.skeletonBox + " " + style.medium}></div>
        <div className={style.subTitle}>
          <div className={style.subTitleBox}>
            <div className={style.skeletonBox + " " + style.small}></div>
            <div className={style.skeletonBox + " " + style.small}></div>
          </div>
          <div className={style.skeletonBox + " " + style.small}></div>
        </div>
        <div className={style.skeletonBox + " " + style.content}></div>
        <div className={style.skeletonBox + " " + style.content}></div>
      </div>
    </div>
  );
}
