// hooks/useMyGalleryFilters.js
import { useReducer } from "react";
import { initialMyGalleryFilters } from "@/utils/constants/Filters";

function reducer(state, action) {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload, page: 1 };
    case "SET_CATEGORY":
      return { ...state, category: action.payload, page: 1 };
    case "SET_SORT":
      return { ...state, sort: action.payload, page: 1 };
    case "SET_GRADE":
      return { ...state, grade: action.payload, page: 1 };
    case "SET_GENRE":
      return { ...state, genre: action.payload, page: 1 };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "RESET":
      return initialMyGalleryFilters;
    default:
      return state;
  }
}

export default function useGalleryFilters(initialState = initialMyGalleryFilters) {
  const [state, dispatch] = useReducer(reducer, initialMyGalleryFilters);
  return { state, dispatch };
}
