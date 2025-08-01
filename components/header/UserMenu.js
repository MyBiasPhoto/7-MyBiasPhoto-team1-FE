import Link from "next/link";
import styles from "./UserMenu.module.css";

export default function UserMenu() {
  return (
    <div className={styles.info}>
      <div className={styles.userBox}>
        <span className={styles.title}>안녕하세요, 탕수육님!</span>
        <div className={styles.userPoint}>
          <span className={styles.text}>보유 포인트</span>
          <span className={styles.point}>20,000</span>
        </div>
      </div>
      <div className={styles.linkArea}>
        <Link className={styles.link} href="/marketPlace">
          마켓플레이스
        </Link>
        <Link className={styles.link} href="/myGallery">
          마이갤러리
        </Link>
        <Link className={styles.link} href="/mySalePage">
          판매 중인 포토카드
        </Link>
      </div>
    </div>
  );
}
