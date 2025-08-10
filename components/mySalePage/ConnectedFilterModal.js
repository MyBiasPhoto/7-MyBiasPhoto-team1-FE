"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import FilterModal from "@/components/marketPlace/section/landing/filterModal/FilterModal";
// 프로젝트 공용 옵션을 쓰려면 import, 아니면 하드코딩해도 OK
import {
  gradeOption as defaultGradeOption,
  genreOption as defaultGenreOption,
  saleTypeOption as defaultSaleTypeOption,
} from "@/components/marketPlace/config/config";

export default function ConnectedFilterModal({ value, onApply, onClose }) {
  // 내부 기본 옵션들(필요하면 이 파일에 하드코딩해도 됨)
  const optionTypes = useMemo(
    () => [
      { value: "grade", label: "등급" },
      { value: "genre", label: "장르" },
      { value: "saleType", label: "판매방법" },
    ],
    []
  );
  const optionMap = useMemo(
    () => ({
      grade: defaultGradeOption,
      genre: defaultGenreOption,
      saleType: defaultSaleTypeOption,
    }),
    []
  );

  // 모달 내부 상태(기존 FilterModal 인터페이스에 맞춤)
  const [modalState, setModalState] = useState(() => ({
    selectedOptionType: "grade",
    temp: {
      grade: value?.grade ?? null,
      genre: value?.genre ?? null,
      saleType: value?.saleType ?? null,
      orderBy: value?.orderBy ?? null,
      search: value?.search ?? "",
    },
  }));

  // 부모 value가 바뀌면 동기화
  useEffect(() => {
    setModalState((s) => ({
      ...s,
      temp: {
        grade: value?.grade ?? null,
        genre: value?.genre ?? null,
        saleType: value?.saleType ?? null,
        orderBy: value?.orderBy ?? null,
        search: value?.search ?? "",
      },
    }));
  }, [value]);

  // FilterModal이 기대하는 dispatch를 어댑팅
  const dispatch = useCallback(
    (action) => {
      switch (action.type) {
        case "SET_OPTION_TYPE":
          setModalState((s) => ({ ...s, selectedOptionType: action.payload }));
          break;
        case "SET_TEMP":
          setModalState((s) => ({
            ...s,
            temp: { ...s.temp, ...action.payload },
          }));
          break;
        case "RESET_TEMP":
          setModalState((s) => ({
            ...s,
            temp: {
              grade: null,
              genre: null,
              saleType: null,
              search: "",
            },
          }));

          break;
        case "APPLY_TEMP":
          onApply?.(modalState.temp); // 부모에 최종값 전달
          onClose?.(); // 닫기
          break;
        default:
          break;
      }
    },
    [modalState.temp, onApply, onClose]
  );

  return (
    <FilterModal
      filterState={modalState}
      dispatch={dispatch}
      optionTypes={optionTypes}
      optionMap={optionMap}
      onClose={onClose}
      // countMap 필요 없으니 안 넘김
    />
  );
}
