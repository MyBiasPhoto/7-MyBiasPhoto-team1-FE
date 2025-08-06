// app/myGallery/page.js
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import MyGalleryClient from "./MyGalleryClient";
import { fetchMyGalleryData } from "@/utils/api/myGalleries";
import { initialMyGalleryFilters } from "@/utils/constants/Filters";

export default async function myGalleryPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    
    queryKey: ["gallery", initialMyGalleryFilters],
    queryFn: () => fetchMyGalleryData(initialMyGalleryFilters),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyGalleryClient initialFilters={initialMyGalleryFilters} />
    </HydrationBoundary>
  );
}
