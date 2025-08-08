
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletedAtSaleById } from "@/utils/api/marketPlace";

export function useCancelSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }) =>
      deletedAtSaleById({
        id,
        data: { deletedAt: new Date().toISOString() },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
}
