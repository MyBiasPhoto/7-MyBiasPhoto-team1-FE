import styles from "./Alarm.module.css";

export default function Alarm() {
  return (
    <div className={styles.area}>
      <div className={styles.alarmList}>
        <div className={styles.list}>
          <span className={styles.text}>테스트용 알림메시지입니다</span>
          <span className={styles.time}>1시간 전</span>
        </div>
        <div className={styles.list}>
          <span className={styles.text}>테스트용 알림메시지입니다</span>
          <span className={styles.time}>1시간 전</span>
        </div>
        <div className={styles.list}>
          <span className={styles.text}>테스트용 알림메시지입니다</span>
          <span className={styles.time}>1시간 전</span>
        </div>
        <div className={styles.list}>
          <span className={styles.text}>테스트용 알림메시지입니다</span>
          <span className={styles.time}>1시간 전</span>
        </div>
      </div>
    </div>
  );
}
