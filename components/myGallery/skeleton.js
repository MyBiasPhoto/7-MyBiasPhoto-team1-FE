import style from "@/components/myGallery/skeleton.module.css";

export default function CardRarityCountSkeleton() {
  return (
    <div className={`${style.container}`}>
      <span className={style.grade}></span>
      <span className={style.value}></span>
      <span className={style.grade}></span>
      <span className={style.grade}></span>
    </div>
  );
}
