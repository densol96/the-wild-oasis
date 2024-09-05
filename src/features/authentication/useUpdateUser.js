import { useMutation } from "@tanstack/react-query";
import { updateCurrentUser } from "../../services/apiAuth";
import toast from "react-hot-toast";
import useLogout from "./useLogout";

function useUpdateUser() {
  const { mutate: updateUser, isLoading: isUpdating } = useMutation({
    mutationFn: updateCurrentUser,
    onError: (e) => {
      toast.error(
        "Unable to update your account at present. Please, try again later!"
      );
    },
  });

  return { updateUser, isUpdating };
}

export default useUpdateUser;
