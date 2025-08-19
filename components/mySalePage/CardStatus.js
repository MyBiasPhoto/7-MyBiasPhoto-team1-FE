import { style } from "./CardStatus.module.css";

export default function CardStatus(status) {
  let statusMemo;
  if (status === "ON_SALE") {
    status = "판매중";
  } else if (status === "PROPOSED") {
    status = "교환 제시 대기 중";
  } else {
    status = "";
  }
  return <p className={`${style.cardStatus} ${style[status]}`}>{statusMemo}</p>;
}
