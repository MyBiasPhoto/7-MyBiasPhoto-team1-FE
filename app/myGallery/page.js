import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import MyGalleryClient from "./MyGalleryClient";
import { fetchMyGalleryData } from "@/utils/api/myGalleries";

// app/myGallery/page.js
export default async function myGalleryPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    // queryKey: ["gallery", initialFilter],
    // queryFn: () => fetchMyGalleryData(initialFilter),
    queryKey: ["gallery"],
    queryFn: () => fetchMyGalleryData(),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyGalleryClient />
    </HydrationBoundary>
  );
}
