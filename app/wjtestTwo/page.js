// app/wjtestTwo/page.js

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { fetchSales } from "@/utils/api/sales";
import SaleList from "./SaleList";

export default async function WjTestTwoPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["sales"],
    queryFn: fetchSales,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SaleList />
    </HydrationBoundary>
  );
}
