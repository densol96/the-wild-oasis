import { useNavigate } from "react-router-dom";
import { login } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    data: user,
    isLoading,
    mutate: signIn,
  } = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user.user);
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);
    },
    retry: false,
  });

  return { user, isLoading, signIn };
}

export default useLogin;
