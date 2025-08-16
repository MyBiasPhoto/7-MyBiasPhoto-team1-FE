// app/myGallery/page.js
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import MyGalleryClient from "./MyGalleryClient";
import { fetchMyGalleryData } from "@/utils/api/myGalleries";
import { initialMyGalleryFilters } from "@/utils/constants/Filters";
import { cookies, headers } from "next/headers";
export default async function myGalleryPage() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const ua = headerStore.get("user-agent") ?? "";

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["gallery", initialMyGalleryFilters],
    queryFn: () =>
      fetchMyGalleryData(initialMyGalleryFilters, {
        cookie: cookieHeader,
        headers: {
          "user-agent": ua,
        },
      }),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyGalleryClient initialFilters={initialMyGalleryFilters} />
    </HydrationBoundary>
  );
}
