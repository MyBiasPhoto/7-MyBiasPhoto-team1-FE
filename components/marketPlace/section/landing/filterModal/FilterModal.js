import style from "@/app/marketPlace/page.module.css";
import Image from "next/image";
import recicle from "../../../../../public/icons/ic_exchange.svg";

export default function FilterModal({
  filterState,
  dispatch,
  optionTypes,
  optionMap,
  onClose,
  countMap,
}) {
  return (
    <div className={style.modalOverlay}>
      <div className={style.modalContent}>
        <div className={style.modalTitle}>
          <div></div>
          <p className={style.modalTitleFont}>필터</p>
          <p className={style.modalClose} onClick={onClose}>
            x
          </p>
        </div>

        <div className={style.modalOption}>
          {optionTypes.map((opt) => (
            <p
              key={opt.value}
              onClick={() =>
                dispatch({ type: "SET_OPTION_TYPE", payload: opt.value })
              }
              className={`${style.optionItem} ${
                filterState.selectedOptionType === opt.value
                  ? style.optionItemActive
                  : ""
              }`}
            >
              {opt.label}
            </p>
          ))}
        </div>

        <div className={style.modalOptionLine}></div>

        <div className={style.optionBlock}>
          {optionMap[filterState.selectedOptionType]?.map((opt) => (
            <div
              key={opt.value}
              className={style.options}
              onClick={() =>
                dispatch({
                  type: "SET_TEMP",
                  payload: {
                    [filterState.selectedOptionType]:
                      filterState.selectedOptionType === "grade"
                        ? opt.value.toUpperCase()
                        : opt.value,
                  },
                })
              }
            >
              <p className={style[opt.value.toLowerCase()]}>{opt.label}</p>
              <p>개</p>
              {/* 갯수 넘기는 백엔드만들고 넘겨주기 */}
            </div>
          ))}
        </div>

        <div className={style.modalButtonBox}>
          <button>
            <Image src={recicle} height={50} width={50} alt={"버튼"} />
          </button>
          <button
            className={style.modalButton}
            onClick={() => {
              dispatch({ type: "APPLY_TEMP" });
              onClose();
            }}
          >
            포토보기
          </button>
        </div>
      </div>
    </div>
  );
}
