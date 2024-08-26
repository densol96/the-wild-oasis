import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCabin as createCabinApi } from "../../services/apiCabins";
import toast from "react-hot-toast";

function useCreateCabin(reset) {
  const queryClient = useQueryClient();

  const { mutate: createCabin, isLoading: isCreating } = useMutation({
    mutationFn: createCabinApi,
    onSuccess: () => {
      toast.success(`Cabin has been created!`);
      queryClient.invalidateQueries({
        queryKey: ["cabin"],
      });
      reset && reset();
    },
    onError: (e) => toast.error(e.message),
  });

  return { isCreating, createCabin };
}

export default useCreateCabin;
