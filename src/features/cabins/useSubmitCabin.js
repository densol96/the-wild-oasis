import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCabin, updateCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

function useSubmitCabin(cabin, reset) {
  const queryClient = useQueryClient();

  const { mutate, isLoading: isSubmitting } = useMutation({
    mutationFn: !cabin
      ? createCabin
      : ({ oldCabin, newCabin }) => updateCabin(oldCabin, newCabin),
    onSuccess: () => {
      toast.success(`Cabin has been ${!cabin ? "created" : "updated"}!`);
      queryClient.invalidateQueries({
        queryKey: ["cabin"],
      });
      reset();
    },
    onError: (e) => toast.error(e.message),
  });

  function submit(data) {
    if (!cabin) mutate({ ...data, image: data.image[0] });
    else
      mutate({
        oldCabin: cabin,
        newCabin: { ...data, image: data.image[0] },
      });
  }

  return { isSubmitting, submit };
}

export default useSubmitCabin;
