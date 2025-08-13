import style from "@/app/marketPlace/page.module.css";
import Image from "next/image";
import recicle from "../../../../../public/icons/ic_exchange.svg";

export default function FilterModal({
  temp,
  selectedOptionType,
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
                selectedOptionType === opt.value ? style.optionItemActive : ""
              }`}
            >
              {opt.label}
            </p>
          ))}
        </div>

        <div className={style.modalOptionLine}></div>

        <div className={style.optionBlock}>
          {optionMap[selectedOptionType]?.map((opt) => (
            <div
              key={opt.value}
              className={`${style.options} ${
                temp[selectedOptionType] ===
                (selectedOptionType === "grade"
                  ? opt.value.toUpperCase()
                  : opt.value)
                  ? style.optionsActive
                  : ""
              }`}
              onClick={() =>
                dispatch({
                  type: "SET_TEMP",
                  payload: {
                    [selectedOptionType]:
                      selectedOptionType === "grade"
                        ? opt.value.toUpperCase()
                        : opt.value,
                  },
                })
              }
            >
              <p
                className={style[opt.value.replace(/\s+/g, "_").toLowerCase()]}
              >
                {opt.label}
              </p>
              {/* 갯수 넘기는 백엔드만들고 넘겨주기 */}
            </div>
          ))}
        </div>

        <div className={style.modalButtonBox}>
          <Image
            onClick={() => {
              dispatch({ type: "RESET_TEMP" });
            }}
            src={recicle}
            height={30}
            width={30}
            alt={"버튼"}
            className={style.modalButtonImg}
          />
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
