//app/myGallery/MyGalleryClient.js
"use client";
import FilterBar from "@/components/common/FilterBar";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import MyGalleryCardGrid from "@/components/myGallery/MyGalleryCardGrid";
import { fetchMyGalleryData } from "@/utils/api/myGalleries";
import { useQuery } from "@tanstack/react-query";

export default function MyGalleryClient() {
  const { data, isPending, isLoading, error } = useQuery({
    // queryKey: ["gallery", filters],
    // queryFn: () => fetchMyGalleryData(filters),
    queryKey: ["gallery"],
    queryFn: () => fetchMyGalleryData(),
  });
  const saleList = data?.saleList ?? [];
  if (isPending) return <LoadingSpinner />;
  if (error) return <div>에러 발생: {error.message}</div>;
  return (
    <>
      <div>정우진 님이 보유한 포토카드 자리(CardStatus 컴포넌트 예정)</div>
      <div>Common 10장 Rare 3장 ~~~</div>
      <FilterBar />
      <MyGalleryCardGrid items={saleList} />;
    </>
  );
}
