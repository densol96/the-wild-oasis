import toast from "react-hot-toast";
import { signup as signUpApi } from "../../services/apiAuth";
import { useMutation } from "@tanstack/react-query";

function useSignUp() {
  const { mutate: signUp, isLoading: isSigningUp } = useMutation({
    mutationFn: signUpApi,
    onSuccess: (data) => {
      toast.success("Registration successful! Please, verify your email!");
    },
    onError: (e) => {
      console.log(e);
      toast.error("Sign up failed! " + e.message);
    },
  });
  return { signUp, isSigningUp };
}

export default useSignUp;
