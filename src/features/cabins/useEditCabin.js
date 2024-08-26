import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCabin as updateCabinApi } from "../../services/apiCabins";
import toast from "react-hot-toast";

function useEditCabin(reset) {
  const queryClient = useQueryClient();

  const { mutate: updateCabin, isLoading: isUpdating } = useMutation({
    mutationFn: ({ oldCabin, newCabin }) => updateCabinApi(oldCabin, newCabin),
    onSuccess: () => {
      toast.success(`Cabin has been updated!`);
      queryClient.invalidateQueries({
        queryKey: ["cabin"],
      });
      reset();
    },
    onError: (e) => toast.error(e.message),
  });

  return { isUpdating, updateCabin };
}

export default useEditCabin;
