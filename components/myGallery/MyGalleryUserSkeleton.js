// MyGalleryUserSkeleton.js
import style from "@/components/myGallery/MyGalleryUserSkeleton.module.css";

export default function MyGalleryUserSkeleton() {
  return (
    <div className={style.skeletonCard}>
      <div className={style.skeletonTop}></div>
      <div className={style.skeletonBottom}>
        <div className={style.skeletonBottomBox}></div>
        <div className={style.skeletonBottomBox}></div>
        <div className={style.skeletonBottomBox}></div>
        <div className={style.skeletonBottomBox}></div>
      </div>
    </div>
  );
}
